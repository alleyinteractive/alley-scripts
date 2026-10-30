import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

import {
  pestComposerScripts,
  pestConfig,
  pestFeatureTestStub,
  raisePhpConstraint,
  raisePhpcsTestVersion,
  raiseRequiresPhpHeader,
  raiseWorkflowPhpMatrix,
  stripUsesTestCase,
  testCaseClass,
  usesPest,
} from './transforms.js';

const runCommand = (command, cwd, allowedExitCodes = [0]) => new Promise((resolve, reject) => {
  // Pest Drift ends with an interactive prompt, so stdin stays closed.
  const run = spawn(command, [], { cwd, shell: true, stdio: ['ignore', 'inherit', 'inherit'] });

  run.on('error', reject);
  run.on('close', (code) => {
    if (allowedExitCodes.includes(code)) {
      resolve(code);
    } else {
      reject(new Error(`Command "${command}" failed with code ${code}.`));
    }
  });
});

const listFiles = async (directory) => {
  const entries = await fs.readdir(directory, { recursive: true, withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name));
};

const updateFile = async (file, transform, context) => {
  if (!existsSync(file)) {
    return;
  }

  const contents = await fs.readFile(file, 'utf8');
  const updated = transform(contents);

  if (updated === contents) {
    return;
  }

  const relative = path.relative(context.cwd, file);

  if (context.dryRun) {
    context.logger.info(`Would update ${relative}.`);
  } else {
    context.logger.info(`Updating ${relative}.`);
    await fs.writeFile(file, updated);
  }
};

const readComposer = async (root) => {
  const file = path.join(root, 'composer.json');

  if (!existsSync(file)) {
    throw new Error(`No composer.json found in ${root}. Run this feature from the root of the plugin.`);
  }

  const contents = await fs.readFile(file, 'utf8');

  return {
    file,
    composer: JSON.parse(contents),
    indent: contents.match(/^[ \t]+(?=")/m)?.[0] || '  ',
  };
};

const packageTag = async (root, composer) => {
  const bootstrap = path.join(root, 'tests', 'bootstrap.php');
  const tag = existsSync(bootstrap)
    ? (await fs.readFile(bootstrap, 'utf8')).match(/@package\s+(\S+)/)?.[1]
    : null;

  return tag || `${composer.name || path.basename(root)}`.split('/').pop();
};

/**
 * Convert a create-wordpress-plugin project's PHPUnit test suite to Pest.
 */
export default {
  name: 'convert-plugin-to-pest',
  description: 'Convert a create-wordpress-plugin PHPUnit test suite to Pest',

  prompts(context) {
    return [
      {
        type: 'confirm',
        name: 'confirm',
        message: `Convert the tests in ${context.cwd} to Pest? Commit or stash your changes first.`,
        initial: true,
      },
    ];
  },

  async generate(context) {
    const { cwd: root, dryRun, logger } = context;

    if (!context.inputs.confirm) {
      logger.info('Conversion canceled.');
      return;
    }

    const { file: composerFile, composer, indent } = await readComposer(root);

    if (usesPest(composer)) {
      throw new Error('This project already requires Pest.');
    }

    if (!existsSync(path.join(root, 'tests'))) {
      throw new Error(`No tests directory found in ${root}.`);
    }

    const baseTestCase = existsSync(path.join(root, 'tests', 'TestCase.php'))
      ? testCaseClass(composer)
      : null;
    const tag = await packageTag(root, composer);

    await updateFile(composerFile, () => {
      const updated = { ...composer };

      if (updated.require?.php) {
        updated.require = { ...updated.require, php: raisePhpConstraint(updated.require.php) };
      }

      if (updated.scripts) {
        updated.scripts = pestComposerScripts(updated.scripts);
      }

      updated.config = {
        ...updated.config,
        'allow-plugins': { ...updated.config?.['allow-plugins'], 'pestphp/pest-plugin': true },
      };

      return `${JSON.stringify(updated, null, indent)}\n`;
    }, context);

    const rootFiles = await fs.readdir(root);
    await Promise.all(rootFiles.filter((file) => file.endsWith('.php')).map(async (file) => {
      const contents = await fs.readFile(path.join(root, file), 'utf8');

      if (/^\s*\*?\s*Plugin Name:/m.test(contents)) {
        await updateFile(path.join(root, file), raiseRequiresPhpHeader, context);
      }
    }));

    const workflows = path.join(root, '.github', 'workflows');
    if (existsSync(workflows)) {
      const files = (await fs.readdir(workflows)).filter((file) => /\.ya?ml$/.test(file));
      await Promise.all(files.map((file) => (
        updateFile(path.join(workflows, file), raiseWorkflowPhpMatrix, context)
      )));
    }

    await Promise.all(['.phpcs.xml', 'phpcs.xml', '.phpcs.xml.dist', 'phpcs.xml.dist'].map((file) => (
      updateFile(path.join(root, file), raisePhpcsTestVersion, context)
    )));

    await updateFile(
      path.join(root, '.scaffolder', 'plugin-feature', 'test.php.hbs'),
      (contents) => (/extends\s+TestCase/.test(contents) ? pestFeatureTestStub(tag) : contents),
      context,
    );

    const commands = [
      'composer require --dev --with-all-dependencies --no-interaction alleyinteractive/pest-plugin-wordpress pestphp/pest-plugin-drift',
      'vendor/bin/pest --drift',
      'composer remove --dev --no-interaction pestphp/pest-plugin-drift',
      'vendor/bin/phpcbf tests',
    ];

    if (dryRun) {
      logger.info('Would write tests/Pest.php.');
      commands.forEach((command) => logger.info(`Would run: ${command}`));
      return;
    }

    await fs.writeFile(path.join(root, 'tests', 'Pest.php'), pestConfig(tag, baseTestCase));

    const existingTests = new Set(await listFiles(path.join(root, 'tests')));

    logger.info(`Running: ${commands[0]}`);
    await runCommand(commands[0], root);

    logger.info(`Running: ${commands[1]}`);
    await runCommand(commands[1], root);

    // Drift runs `pest --init` first, which adds example tests and a TestCase.php in the wrong namespace.
    const createdByDrift = (await listFiles(path.join(root, 'tests')))
      .filter((file) => !existingTests.has(file));
    await Promise.all(createdByDrift.map((file) => {
      logger.info(`Removing ${path.relative(root, file)} created by Pest Drift.`);
      return fs.rm(file);
    }));

    if (baseTestCase && existsSync(path.join(root, 'tests', 'Feature'))) {
      const featureTests = await listFiles(path.join(root, 'tests', 'Feature'));
      await Promise.all(featureTests.map((file) => (
        updateFile(file, (contents) => stripUsesTestCase(contents, baseTestCase), context)
      )));
    }

    logger.info(`Running: ${commands[2]}`);
    await runCommand(commands[2], root);

    if (existsSync(path.join(root, 'vendor', 'bin', 'phpcbf'))) {
      logger.info(`Running: ${commands[3]}`);
      // phpcbf exits 1 when it fixed files and 2 when some errors remain.
      const code = await runCommand(commands[3], root, [0, 1, 2]);

      if (code === 2) {
        logger.warn('phpcbf could not fix every coding standards error in tests/. Run "composer phpcs" to review them.');
      }
    }

    const docs = ['README.md', 'CLAUDE.md', 'AGENTS.md']
      .filter((file) => existsSync(path.join(root, file)));
    const mentionsPhpunit = (await Promise.all(docs.map(async (file) => (
      /phpunit/i.test(await fs.readFile(path.join(root, file), 'utf8')) ? file : null
    )))).filter(Boolean);

    if (mentionsPhpunit.length) {
      logger.warn(`Review PHPUnit references in ${mentionsPhpunit.join(', ')}.`);
    }

    logger.info('Converted to Pest. Run "vendor/bin/pest" to run the test suite.');
  },
};
