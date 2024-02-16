import chalk from 'chalk';
import fs from 'node:fs';
import { glob } from 'fast-glob';
import path from 'node:path';

import { FeatureFile } from '../types';
import { logger } from '../logger';
import { Generator } from './generator';
import { parseExpression, parseFalsy, parseObjectExpression } from '../expressions';
import handleError from '../error';

/**
 * File-based feature.
 *
 * Can generate a set of files/folders in a new source directory while parsing
 * the files/folders for expressions based on the user's input.
 */
export class FileGenerator extends Generator {
  /**
   * Collect the feature source files and parse the expressions.
   *
   * Compiles all the expressions from the configuration and returns the list of
   * source files that should be generated for a feature.
   *
   * @todo Allow files to be overwritten.
   */
  collectFeatureSourceFiles(): FeatureFile[] {
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
        // Calculate the proper destination directory for the file relative to
        // the configuration of the feature.
        destination: this.getDestinationDirectory(
          parseExpression(file.destination || process.cwd(), context),
        ),
      }, context))
      // Check if the already-parsed condition is not falsy.
      .filter(({ if: condition = null }) => condition === null || !parseFalsy(condition))
      // Expand any directories into their files that match the glob pattern.
      .flatMap((file) => {
        const {
          base = this.path,
          destination,
          source,
        } = file;

        const relativeSource = path.resolve(this.path, source);

        // If the source is a file and it exists, return the file.
        if (fs.existsSync(relativeSource) && fs.statSync(relativeSource).isFile()) {
          return { ...file, source: relativeSource };
        }

        // Check if it's a glob pattern. Warn the user if no files were found
        // and it isn't a glob pattern.
        if (!source.includes('*')) {
          logger().warn(`No files found against "${chalk.yellow(source)}" for "${chalk.yellow(featureName)}" (calculated source path: ${chalk.yellow(relativeSource)}).`);
          return [];
        }

        // Calculate the base directory for the glob pattern.
        const baseDirectory = base ? path.resolve(this.path, base) : this.path;

        // Find all files that match the glob pattern.
        const matchedFiles = glob.sync(source, {
          absolute: true,
          cwd: baseDirectory,
        });

        // Warn the user if no files were found.
        if (!matchedFiles.length) {
          logger().warn(`No files found against "${chalk.yellow(source)}" for "${chalk.yellow(featureName)}".`);
          return file;
        }

        return matchedFiles.map((matchedFile) => ({
          destination: matchedFile.replace(baseDirectory, destination),
          source: matchedFile,
        }));
      })
      // Filter out any files that already exist.
      .filter(({ destination: destinationPath }) => {
        if (fs.existsSync(destinationPath)) {
          logger().error(`Destination file already exists: ${chalk.yellow(destinationPath)}. Skipping generation.`);

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
    files.forEach(({ base = null, destination, source }) => {
      const baseDirectory = base ? path.resolve(this.path, base) : this.path;
      let fileContents: string;
      let compiledExpression: string;

      try {
        fileContents = fs.readFileSync(source, 'utf8');
      } catch (error: any) {
        handleError(`Error reading from ${chalk.yellow(source)}: ${chalk.white(error.message || '')}`);
      }

      // Don't parse the expression of select file extensions because they are
      // cause issues with the Handlebars parser.
      // Maybe this can be improved in the future.
      if (source.endsWith('.jsx') || source.endsWith('.tsx')) {
        compiledExpression = fileContents;
      } else {
        try {
          compiledExpression = parseExpression(fileContents, context);
        } catch (error: any) {
          handleError(`Error generating template from ${chalk.yellow(source)}: ${chalk.white(error.message || '')}`);
        }
      }

      // Ensure that the destination is set to appease TypeScript.
      if (!destination) {
        handleError(`No destination for ${chalk.yellow(source)}`);
      }

      if (!this.dryRun) {
        try {
          const destinationDir = path.dirname(destination);

          // Ensure that the parent directories exist.
          if (!fs.existsSync(destinationDir) && !this.dryRun) {
            fs.mkdirSync(destinationDir, { recursive: true });
          }
        } catch (error: any) {
          handleError(`Error creating directory for ${chalk.yellow(destination)}: ${chalk.white(error.message || '')}`);
        }
      } else {
        logger().info(`Would create directory: ${chalk.green(destination)}`);
      }

      if (!this.dryRun) {
        try {
          fs.writeFileSync(destination, compiledExpression);

          logger().info(
            `${chalk.greenBright('✔')} Generated ${chalk.green(destination.replace(baseDirectory, '').replace(/^\//, ''))}`,
          );
        } catch (error: any) {
          handleError(`Error generating file from ${chalk.yellow(source)} to ${chalk.yellow(destination)}: ${chalk.white(error.message || '')}`);
        }
      } else {
        logger().info(
          `Would generate ${chalk.green(destination.replace(baseDirectory, '').replace(/^\//, ''))}`,
        );
      }
    });
  }
}
