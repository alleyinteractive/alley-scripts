import { existsSync, readdirSync } from 'fs';
import { cwd } from 'node:process';
import { join } from 'path';
import { type PathData, type Chunk, Configuration } from 'webpack';

type DirectorySrcName = 'name' | 'runtime';
type ConfigType = 'script' | 'module';

/**
 * Get the entry points from a directory.
 *
 * @param entryDirName - The name of the directory to get entries from.
 * @returns An object of entries.
 */
function getEntries(entryDirName: string): object {
  const directoryPath = join(cwd(), entryDirName);
  const directoryExists = existsSync(directoryPath);

  if (directoryExists) {
    return readdirSync(directoryPath)
      .reduce((acc: { [x: string]: string; }, dirPath: string) => {
        // Ignore .gitkeep files and README.md files.
        if (dirPath?.includes('.gitkeep') || dirPath?.includes('README.md')) {
          return acc;
        }

        acc[
          `${entryDirName}-${dirPath}`
        ] = join(cwd(), entryDirName, dirPath);
        return acc;
      }, {});
  }
  // eslint-disable-next-line no-console
  console.log(`Directory "${entryDirName}" does not exist.\n`);
  return {};
}

/**
 * Process the filename and chunkFilename for Webpack output and MiniCssExtractPlugin.
 * This reusable function dynamically generates filenames based on the provided `pathData`,
 * a flag to determine whether to set the filename as 'index', the file extension (`ext`),
 * and a parameter to explicitly specify whether to use 'runtime' or 'name' as the dirname source.
 *
 * For non-entries entries, it returns a filename in the format '[name].[ext]'.
 * For entries, it constructs a filename with the directory name (stripping 'entries-')
 * and appends '/index' or '/[name]' (if a name is present) followed by the file extension.
 *
 * @param   pathData      - The path data object provided by Webpack.
 * @param   setAsIndex    - A flag to determine whether to set the filename as 'index'
 *                                    when processing entries. Pass `true` to use 'index' or `false`
 *                                    to use '[name]'.
 * @param   ext           - The file extension to be used for the output filename.
 * @param   dirnameSource - The pathData.chunk prop to set the directory name.
 *                                    'runtime' or 'name'. Defaults to 'name' if not provided.
 * @returns                 The generated filename.
 */
function processFilename(
  pathData: PathData,
  setAsIndex: boolean,
  ext: string,
  dirnameSource: DirectorySrcName = 'name',
): string {
  const entriesDir = process.env.ENTRIES_DIRECTORY || 'entries';

  // For runtime chunks we are casting chunk to Chunk as runtime does not exist on ChunkPathData.
  const { chunk } = pathData as { chunk: Chunk };

  const dirname = dirnameSource === 'runtime'
    ? chunk?.runtime : pathData?.chunk?.name;

  let filename = '[name]';
  if (typeof setAsIndex === 'boolean' && setAsIndex) {
    filename = 'index';
  }

  // Process all block entries that do not include the entriesDir prefix.
  if (
    typeof dirname !== 'string'
    || !dirname.includes(`${entriesDir}-`)
  ) {
    return `[name].${ext}`;
  }

  const srcDirname = dirname.replace(`${entriesDir}-`, '');
  return `${srcDirname}/${filename}.${ext}`;
}

/**
 * Returns the appropriate webpack configuration based on the requested type.
 *
 * @param type    - The type of configuration to return ('script' or 'module').
 * @param configs - Array of webpack configurations from @wordpress/scripts.
 * @returns         The selected webpack configuration.
 */
function getConfigByType(type: ConfigType, configs: Configuration[]): Configuration {
  const isModuleConfig = (config: Configuration): boolean => config.output?.module === true;

  // If we want module config, find the one with output.module === true
  // Otherwise, find the one without output.module === true
  const desiredConfig = configs.find(
    type === 'module' ? isModuleConfig : (config) => !isModuleConfig(config),
  );

  if (!desiredConfig) {
    return {};
  }

  return desiredConfig;
}

export {
  getConfigByType,
  getEntries,
  processFilename,
};
