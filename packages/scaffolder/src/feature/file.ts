import chalk from 'chalk';
import fs from 'node:fs';
import { glob } from 'fast-glob';
import path, { dirname } from 'node:path';

import { FeatureFile } from '../types';
import { logger } from '../logger';
import { Feature } from './feature';
import { parseExpression, parseFalsy, parseObjectExpression } from '../expressions';
import handleError from '../error';

/**
 * File-based feature.
 *
 * Can generate a set of files/folders in a new source directory while parsing
 * the files/folders for expressions based on the user's input.
 */
class FileFeature extends Feature {
  /**
   * Collect the feature source files and parse the expressions.
   *
   * Compiles all the expressions from the configuration and returns the list of
   * source files that should be generated for a feature.
   *
   * @todo Allow files to be overwritten.
   */
  collectFeatureSourceFiles(): FeatureFile[] { // eslint-disable-line max-len
    const context = this.collectContextVariables();
    const {
      name: featureName,
      files: featureFiles = [],
    } = this.config;

    logger().debug('Collecting source files');

    return featureFiles
      // Parse the expression of any file attribute.
      .map((file) => parseObjectExpression({
        ...file,
        // Ensure that destination/source directories are prefixed with the
        // feature/root directories, respectively, to allow the configuration to
        // be relative from the config file.
        destination: parseExpression(this.getDestinationDirectory(file.destination), context),
        source: `${this.path}/${file.source}`,
      }, context))
      // Check if the already-parsed condition is not falsy.
      .filter(({ if: condition = null }) => condition === null || !parseFalsy(condition))
      // Expand any directories into their files that match the glob pattern.
      .flatMap((file) => {
        const { destination, source } = file;
        const { base = null } = file;

        // if (base) {
        //   base = fs.existsSync(base) ? base : path.resolve(destination, base);
        // }

        console.log('destination', destination);
        console.log('source', source);
        console.log('base', base);
        console.log('this.path', this.path);
        console.log('glob', base ? path.resolve(this.path, base) : this.path);
        // throw new Error('Not implemented');
        // If the source is a file and it exists, return the file.
        if (fs.existsSync(source) && fs.statSync(source).isFile()) {
          return file;
        }

        // Find all files that match the glob pattern.
        const matchedFiles = glob.sync(source, {
          absolute: true,
          cwd: base ? path.resolve(this.path, base) : this.path,
        });

        console.log('matchedFiles', matchedFiles);
        throw new Error('Not implemented');

        // Warn the user if no files were found.
        if (!matchedFiles.length) {
          logger().warn(`No files found against "${chalk.yellow(source)}" for "${chalk.yellow(featureName)}".`);
          return file;
        }

        return matchedFiles.map((matchedFile) => ({
          destination: `${destination.replace(/\/$/, '')}/${matchedFile.replace(this.path, '').replace(/^\//, '')}`,
          source: matchedFile,
        }));
      })
      // Filter out any files that already exist.
      .filter(({ destination: destinationPath }) => {
        if (fs.existsSync(destinationPath)) {
          logger().error(`Destination file already exists: ${destinationPath}. Skipping generation.`);

          return false;
        }

        return true;
      });
  }

  /**
   * Process a feature and scaffold the files.
   */
  async invoke() {
    const { name: featureName } = this.config;

    logger().debug(`Processing feature ${chalk.yellow(featureName)}`);

    const context = this.collectContextVariables();
    const files = this.collectFeatureSourceFiles();

    logger().debug(`Found ${files.length} files to generate`);

    if (!files.length) {
      handleError(`No files to generate for the feature ${featureName}`);
    }

    // Run each file through the expression parser and write the file to their new
    // file destination.
    files.forEach(async ({ destination, source }) => {
      let fileContents: string;
      let compiledExpression: string;

      try {
        fileContents = fs.readFileSync(source, 'utf8');
      } catch (error: any) {
        handleError(`Error reading from ${chalk.yellow(source)}: ${chalk.white(error.message || '')}`);
      }

      // Don't parse the expression of select file extensions.
      if (source.endsWith('.jsx') || source.endsWith('.tsx')) {
        compiledExpression = fileContents;
      } else {
        try {
          compiledExpression = parseExpression(fileContents, context);
        } catch (error: any) {
          handleError(`Error generating template from ${chalk.yellow(source)}: ${chalk.white(error.message || '')}`);
        }
      }

      try {
        const destinationDir = dirname(destination);

        // Ensure that the parent directories exist.
        if (!fs.existsSync(destinationDir) && !this.dryRun) {
          fs.mkdirSync(destinationDir, { recursive: true });
        }
      } catch (error: any) {
        handleError(`Error creating directory for ${chalk.yellow(destination)}: ${chalk.white(error.message || '')}`);
      }

      try {
        if (!this.dryRun) {
          fs.writeFileSync(destination, compiledExpression);

          logger().info(
            `${chalk.greenBright('✔')} Generated ${chalk.green(destination.replace(this.rootDir, '').replace(/^\//, ''))}`,
          );
        } else {
          logger().info(
            `Would generate ${chalk.green(destination.replace(this.rootDir, '').replace(/^\//, ''))}`,
          );
        }
      } catch (error: any) {
        handleError(`Error writing from ${chalk.yellow(source)} to ${chalk.yellow(destination)}: ${chalk.white(error.message || '')}`);
      }
    });
  }
}

export { FileFeature };
