const { existsSync, readdirSync } = require('fs');
const { cwd } = require('node:process');

const { join } = require('path');

/**
 * Get the entry points from a directory.
 *
 * @param {string} entryDirName - The name of the directory to get entries from.
 * @returns {Object} An object of entries.
 */
function getEntries(entryDirName) {
  const directoryPath = join(cwd(), entryDirName);
  const directoryExists = existsSync(directoryPath);

  if (directoryExists) {
    return readdirSync(directoryPath)
      .reduce((acc, dirPath) => {
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
 * @param   {Object}  pathData      - The path data object provided by Webpack.
 * @param   {boolean} setAsIndex    - A flag to determine whether to set the filename as 'index'
 *                                    when processing entries. Pass `true` to use 'index' or `false`
 *                                    to use '[name]'.
 * @param   {string}  ext           - The file extension to be used for the output filename.
 * @param   {string}  dirnameSource - The pathData.chunk prop to set the directory name.
 *                                    'runtime' or 'name'. Defaults to 'name' if not provided.
 * @returns {string}                  The generated filename.
 */
function processFilename(pathData, setAsIndex, ext, dirnameSource = 'name') {
  const entriesDir = process.env.ENTRIES_DIRECTORY || 'entries';

  const dirname = dirnameSource === 'runtime'
    ? pathData.chunk.runtime : pathData.chunk.name;

  let filename = '[name]';
  if (typeof setAsIndex === 'boolean' && setAsIndex) {
    filename = 'index';
  }

  // Process all block entries.
  if (!dirname.includes(`${entriesDir}-`)) {
    return `[name].${ext}`;
  }

  const srcDirname = dirname.replace(`${entriesDir}-`, '');
  return `${srcDirname}/${filename}.${ext}`;
}

module.exports = {
  getEntries,
  processFilename,
};
