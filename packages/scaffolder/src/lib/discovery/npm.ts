import fs from 'node:fs';
import path, {
  delimiter,
  dirname,
  join,
  resolve,
  sep,
} from 'node:path';
import { DirectorySource } from '../../types';
// import fg from 'fast-glob';
import { execaOutput } from '../../helpers';

const win32 = process.platform === 'win32';
const nvm = process.env.NVM_HOME;
const PROJECT_ROOT = resolve(__dirname, '../../..');

/**
 * Extract the paths to the node_modules directories.
 *
 * Code is from yeoman-environment.
 */

/**
 * Get the local npm lookup directories
 */
function getLocalNpmPaths(): string[] {
  const paths: string[] = [];

  // Walk up the CWD and add `node_modules/` folder lookup on each level
  process
    .cwd()
    .split(sep)
    .forEach((part, i, parts) => {
      let lookup = join(...parts.slice(0, i + 1), 'node_modules');

      if (!win32) {
        lookup = `/${lookup}`;
      }

      if (fs.existsSync(lookup)) {
        paths.push(lookup);
      }
    });

  return paths
    .reverse()
    .filter((path, index, arr) => path && arr.indexOf(path) === index);
}

/**
 * Get the global npm lookup directories
 * Reference: https://nodejs.org/api/modules.html
 */
async function getGlobalNpmPaths(filterPaths = true): string[] {
  let paths: string[] = [];

  // Use the node_modules included with the current installation.
  paths.push(path.resolve(__dirname, '../../../node_modules'));

  // Node.js will search in the following list of GLOBAL_FOLDERS:
  // 1: $HOME/.node_modules
  // 2: $HOME/.node_libraries
  // 3: $PREFIX/lib/node
  const filterValidNpmPath = function (path: string, ignore = false): string[] {
    return ignore ? [path] : ['/node_modules', '/.node_modules', '/.node_libraries', '/node'].some(dir => path.endsWith(dir)) ? [path] : [];
  };

  // Default paths for each system
  if (nvm && process.env.NVM_HOME) {
    paths.push(join(process.env.NVM_HOME, process.version, 'node_modules'));
  } else if (win32 && process.env.APPDATA) {
    paths.push(join(process.env.APPDATA, 'npm/node_modules'));
  } else {
    paths.push('/usr/lib/node_modules', '/usr/local/lib/node_modules');
  }

  // Add NVM prefix directory
  if (process.env.NVM_PATH) {
    paths.push(join(dirname(process.env.NVM_PATH), 'node_modules'));
  }

  // Adding global npm directories
  // We tried using npm to get the global modules path, but it haven't work out
  // because of bugs in the parseable implementation of `ls` command and mostly
  // performance issues. So, we go with our best bet for now.
  if (process.env.NODE_PATH) {
    paths = process.env.NODE_PATH.split(delimiter).filter((i) => !!i).concat(paths);
  }

  // Get yarn global directory and infer the module paths from there
  const yarnBase = await execaOutput('yarn', ['global', 'dir'], { encoding: 'utf8' });

  if (yarnBase) {
    paths.push(resolve(yarnBase, 'node_modules'));
    paths.push(resolve(yarnBase, '../link/'));
  }

  // Get npm global prefix and infer the module paths from there
  const globalInstall = await execaOutput('npm', ['root', '-g'], {
    encoding: 'utf8',
  });

  if (globalInstall) {
    paths.push(resolve(globalInstall));
  }

  // Adds support for generator resolving when @alleyinteractive/scaffolder has been linked
  // if (process.argv[1]) {
  //   paths.push(...filterValidNpmPath(join(dirname(process.argv[1]), '../..'), !filterPaths));
  // }

  return paths.filter(
    (value, index, self) => self.indexOf(value) === index && fs.existsSync(value),
  );

  // return paths.filter((path, index, arr) => path && arr.indexOf(path) === index);
}

/**
 * Retrieve the npm lookup directories (node_modules).
 */
export async function getNpmLookupSources(localOnly: boolean = false): DirectorySource[] {
  let paths = getLocalNpmPaths();

  if (!localOnly) {
    paths.push(...await getGlobalNpmPaths());
  }

  console.log('npm paths', paths);
  paths = paths
    .filter((path, index, arr) => path && arr.indexOf(path) === index)
    .map((path) => ({
      directory: path,
    } as DirectorySource));

  console.log('PATHS', paths);

  return [];

  // Find any directories with a .scaffolder/config.yml file.
  // return fg.glob()
}
