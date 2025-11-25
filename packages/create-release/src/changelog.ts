/* eslint-disable no-console, no-await-in-loop */
import fs from 'fs';
import os from 'os';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';
import { spawnSync } from 'child_process';

/**
 * Prompt the user to edit the changelog and ensure the release version is included.
 *
 * @param basePath - The base path of the plugin.
 * @param releaseVersion - The release version to check for in the changelog.
 * @returns A promise that resolves when the changelog editing is complete.
 */
export default async function promptToEditChangelog(
  basePath: string,
  releaseVersion: string,
): Promise<void> {
  const changelogPath = path.join(basePath, 'CHANGELOG.md');

  // Check if the CHANGELOG.md file exists
  if (!fs.existsSync(changelogPath)) {
    return;
  }

  const contents = fs.readFileSync(changelogPath, 'utf8');

  // If the changelog already includes the release version, no need to prompt
  if (contents.includes(releaseVersion)) {
    return;
  }

  console.log(chalk.yellow(`\n⚠️  Remember to update ${chalk.yellow('CHANGELOG.md')} with the changes for version ${releaseVersion}!\n`)); // eslint-disable-line max-len

  const { editChangelog } = await prompts({
    type: 'confirm',
    name: 'editChangelog',
    message: 'Would you like to edit the changelog now?',
    initial: true,
  });

  if (!editChangelog) {
    return;
  }

  while (true) { // eslint-disable-line no-constant-condition
    // Create a temporary file with the changelog content
    const tmpDir = os.tmpdir();
    const tmpFile = path.join(tmpDir, `CHANGELOG-${Date.now()}.md`);
    fs.copyFileSync(changelogPath, tmpFile);

    const editorCmd = process.env.EDITOR || 'vi';

    // Parse the editor command and arguments
    const editorParts = editorCmd.split(' ');
    const editor = editorParts[0];
    const editorArgs = editorParts.slice(1);

    // Wait for the editor to close
    const result = spawnSync(editor, [...editorArgs, tmpFile], {
      stdio: 'inherit',
      shell: true,
    });

    // Check if the editor was killed by a signal
    if (result.signal) {
      console.log(chalk.red(`\n⚠️  Editor was terminated by signal ${result.signal}. Changes not saved.\n`)); // eslint-disable-line max-len
      fs.unlinkSync(tmpFile);
      break;
    }

    // Check if there was an error spawning the process
    if (result.error) {
      console.log(chalk.red(`\n⚠️  Error launching editor: ${result.error.message}\n`));
      fs.unlinkSync(tmpFile);
      break;
    }

    // Read the edited content from the temporary file
    const updatedContents = fs.readFileSync(tmpFile, 'utf8');

    if (updatedContents.includes(releaseVersion)) {
      // Copy the edited content back to the actual CHANGELOG.md
      fs.copyFileSync(tmpFile, changelogPath);
      fs.unlinkSync(tmpFile);
      console.log(chalk.green('\n✓ Changelog updated successfully.\n'));
      break;
    }

    // Clean up the temporary file
    fs.unlinkSync(tmpFile);

    console.log(chalk.red(`\n⚠️  The changelog still does not include version ${releaseVersion}.\n`)); // eslint-disable-line max-len

    const { tryAgain } = await prompts({
      type: 'confirm',
      name: 'tryAgain',
      message: 'Would you like to try editing the changelog again?',
      initial: true,
    });

    if (!tryAgain) {
      console.log(chalk.yellow('\n⚠️  Remember to update the changelog before releasing!\n'));
      break;
    }
  }
}
