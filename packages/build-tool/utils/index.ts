import { existsSync } from 'node:fs';
import { cwd } from 'node:process';
import path from 'path';
import { Configuration } from 'webpack';

type CliArg = string | undefined;
type PathToConfig = CliArg;

/**
 * Get the absolute path to a file from the project root.
 *
 * @param fileName - The file name to get the absolute path to.
 *
 * @returns The absolute path to the file.
 */
const fromProjectRoot = (fileName: string): string => path.join(cwd(), fileName);

/**
 * Check if a file exists in the project root.
 *
 * @param fileName - The file name to check for.
 */
const hasProjectFile = (fileName: string) : boolean => existsSync(fromProjectRoot(fileName));

/**
 * Get all arguments passed to the CLI.
 */
const getArgsFromCLI = (): string[] => {
  const args = process.argv.slice(2);
  return args;
};

/**
 * Get the value of an argument passed to the CLI.
 *
 * @param arg - The argument to get the value of.
 */
const getArgFromCLI = (arg: string): CliArg => {
  let argValue: CliArg;

  getArgsFromCLI().forEach((cliArg) => {
    const [name, value] = cliArg.split('=');
    if (name === arg) {
      // return the value if it exists, otherwise return the name.
      argValue = value || name;
    }
  });
  return argValue;
};

/**
 * Check if an argument is present in the CLI.
 *
 * @param arg - The argument to check for.
 */
const hasArgInCLI = (arg: string): boolean => getArgFromCLI(arg) !== undefined;

/**
 * Get the path to the user's webpack config file.
 */
const getUserWebpackConfigFilePath = (): PathToConfig => {
  if (hasProjectFile('webpack.config.js')) {
    return fromProjectRoot('webpack.config.js');
  }

  if (hasArgInCLI('--config')) {
    const args = getArgsFromCLI();
    // Get the --config flag that is not the one from this package.
    const userCLIConfigArg: string[] = args.filter((arg) => arg.startsWith('--config')
      && !arg.includes('build-tool/dist'));

    if (typeof userCLIConfigArg[0] !== 'undefined') {
      // Get the value of the --config flag.
      const configPath = userCLIConfigArg[0].split('=')[1];

      if (typeof configPath !== 'undefined') {
        return path.join(cwd(), configPath);
      }
    }
  }
  return undefined;
};

/**
 * Get the path to the webpack config file.
 */
const getWebpackConfig = (): PathToConfig => path.join(__dirname, '../config/extended.config.js');

/**
 * Get the user's webpack configuration.
 */
const getUserWebpackConfig = (): Configuration | {} => {
  const webpackConfigFilePath = getUserWebpackConfigFilePath();

  if (typeof webpackConfigFilePath === 'undefined') {
    return {};
  }

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const webpackConfig = require(require.resolve(webpackConfigFilePath));
    return webpackConfig;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to load webpack config from ${webpackConfigFilePath}:`, error);
    return {};
  }
};

/**
 * Get the default arguments to pass to wp-scripts.
 *
 * @returns {string[]}
 */
const getDefaultArgs = (): string[] => {
  /**
   * The default arguments to pass to wp-scripts.
   */
  const defaultArgs: string[] = [];

  /**
   * If the `build` or `start` command is used, add the necessary wp-scripts args.
   */
  if (hasArgInCLI('build') || hasArgInCLI('start')) {
    defaultArgs.push(`--config=${getWebpackConfig()}`);

    // Include the --webpack-copy-php flag explicitly.
    if (!hasArgInCLI('--webpack-copy-php')) {
      defaultArgs.push('--webpack-copy-php');
    }

    /**
     * The default directory where wp-scripts will detect block.json files.
     * Explicitly set the webpack source directory to "blocks" unless specified.
     *
     * @see https://github.com/WordPress/gutenberg/tree/trunk/packages/scripts#automatic-blockjson-detection-and-the-source-code-directory
     */
    const webpackSrcDir: PathToConfig = hasArgInCLI('--webpack-src-dir')
      ? getArgFromCLI('--webpack-src-dir') : 'blocks';

    defaultArgs.push(`--webpack-src-dir=${webpackSrcDir}`);
  }

  return defaultArgs;
};

/**
 * Check whether wp-scripts will run in experimental modules (dual-compiler) mode.
 *
 * wp-scripts decides this from the `WP_EXPERIMENTAL_MODULES` environment variable; the
 * `--experimental-modules` flag is just one way to set it. The variable is parsed the
 * same way wp-scripts' `getAsBooleanFromENV()` parses it.
 */
const isExperimentalModulesMode = (): boolean => {
  if (hasArgInCLI('--experimental-modules')) {
    return true;
  }

  const value = process.env.WP_EXPERIMENTAL_MODULES;
  return !!value && value !== 'false' && value !== '0';
};

/**
 * Get the absolute build output directory.
 *
 * Defaults to `build/` (set in the webpack config), but webpack-cli's `--output-path`
 * flag (also `-o`) overrides it for every compiler. Both `--output-path=dir` and
 * `--output-path dir` forms are supported, matching webpack-cli.
 */
const getBuildDir = (): string => {
  const args = getArgsFromCLI();
  let outputPath: CliArg;

  args.forEach((arg, index) => {
    if (arg.startsWith('--output-path=')) {
      outputPath = arg.slice('--output-path='.length);
    } else if ((arg === '--output-path' || arg === '-o') && args[index + 1]) {
      outputPath = args[index + 1];
    }
  });

  return path.resolve(cwd(), outputPath || 'build');
};

/**
 * Get the build directory to clean once before an experimental modules `build` or `start`.
 *
 * In that mode wp-scripts runs a script compiler and a module compiler in parallel, both
 * writing to the build directory. Neither can clean it without deleting the other's
 * output, so the CLI cleans it once before either compiler starts. Without the
 * pre-clean, deleted or renamed blocks would linger and still be versioned and
 * registered. This mirrors the initial wipe that `build` and `start` get in
 * non-module mode.
 *
 * As a safeguard, a build directory that is the project root or lies outside it is
 * never cleaned.
 *
 * @returns The absolute build directory path, or undefined when no pre-clean is needed.
 */
const getBuildDirToPreClean = (): string | undefined => {
  if (!(hasArgInCLI('build') || hasArgInCLI('start')) || !isExperimentalModulesMode()) {
    return undefined;
  }

  const buildDir = getBuildDir();
  const relativeToRoot = path.relative(cwd(), buildDir);

  if (!relativeToRoot || relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
    return undefined;
  }

  return buildDir;
};

export {
  fromProjectRoot,
  getBuildDir,
  getBuildDirToPreClean,
  getArgFromCLI,
  getArgsFromCLI,
  getDefaultArgs,
  getWebpackConfig,
  getUserWebpackConfigFilePath,
  getUserWebpackConfig,
  hasArgInCLI,
  hasProjectFile,
  isExperimentalModulesMode,
};
