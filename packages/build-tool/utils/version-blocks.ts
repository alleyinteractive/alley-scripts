import { createHash } from 'crypto';
import {
  existsSync, readdirSync, readFileSync, writeFileSync,
} from 'fs';
import { join } from 'path';
import { type Compiler } from 'webpack';

/**
 * Set each built block's `version` to a hash of every other file the build wrote for it.
 *
 * WordPress versions a block's assets by the `version` in its metadata, and a source block.json
 * rarely changes it, so browsers and caches would keep serving old styles after a deploy.
 *
 * @param buildDir - The directory the blocks were built into.
 */
function versionBlocks(buildDir: string): void {
  if (!existsSync(buildDir)) {
    return;
  }

  readdirSync(buildDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(buildDir, entry.name, 'block.json')))
    .forEach(({ name }) => {
      const blockDir = join(buildDir, name);
      const hash = createHash('sha256');

      readdirSync(blockDir, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name !== 'block.json')
        .map((entry) => entry.name)
        .sort()
        .forEach((file) => hash.update(file).update(readFileSync(join(blockDir, file))));

      const blockJsonPath = join(blockDir, 'block.json');
      const blockJson = JSON.parse(readFileSync(blockJsonPath, 'utf8'));
      blockJson.version = hash.digest('hex').slice(0, 20);
      writeFileSync(blockJsonPath, JSON.stringify(blockJson, null, 2));
    });
}

/**
 * Version the built blocks after every emit, in `build` and `start` alike.
 *
 * It has to come before wp-scripts' BlocksManifestPlugin, which copies the versions into the
 * manifest WordPress registers the blocks from on the same hook.
 */
class VersionBlocksPlugin {
  // eslint-disable-next-line class-methods-use-this
  apply(compiler: Compiler): void {
    compiler.hooks.afterEmit.tap('VersionBlocks', () => {
      versionBlocks(compiler.outputPath);
    });
  }
}

export { versionBlocks, VersionBlocksPlugin };
