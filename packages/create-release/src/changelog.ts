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

  // If the changelog already includes the release version (with or without 'v' prefix),
  // no need to prompt.
  if (contents.includes(releaseVersion) || contents.includes(`v${releaseVersion}`)) {
    return;
  }

  console.log(chalk.blue(`\n⏳ Checking changelog for version ${releaseVersion}...\n`));

  // Check if there's an Unreleased section
  let updatedContents = contents;
  const unreleasedMatch = contents.match(/^##\s+\[?Unreleased\]?/im);

  if (unreleasedMatch) {
    const { convertUnreleased } = await prompts({
      type: 'confirm',
      name: 'convertUnreleased',
      message: `Found an "Unreleased" section. Would you like to convert it to version ${releaseVersion}?`,
      initial: true,
    });

    if (convertUnreleased) {
      // Replace the Unreleased header with the new version
      updatedContents = updatedContents.replace(
        /^##\s+\[?Unreleased\]?.*$/im,
        `## ${releaseVersion}`,
      );

      // Write the updated contents back to the file
      fs.writeFileSync(changelogPath, updatedContents, 'utf8');
      console.log(chalk.green(`\n✓ Converted "Unreleased" section to version ${releaseVersion}.\n`));
      console.log(chalk.green('\n✓ Changelog updated successfully.\n'));
      return;
    }
  }

  // First, prompt the user to enter the changelog entry
  const { changelogEntry } = await prompts({
    type: 'text',
    name: 'changelogEntry',
    message: `Enter changelog entry for version ${releaseVersion} (or leave empty to open editor):`,
    initial: '',
  });

  // If they provided a changelog entry, append it to the changelog.
  if (changelogEntry && changelogEntry.trim()) {
    const lines = contents.split('\n');
    let insertIndex = -1;

    // Find the first ## entry (existing changelog entry) to insert before it.
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].match(/^##\s+/)) {
        insertIndex = i;
        break;
      }
    }

    // If no existing entry found, find the Changelog header and insert after any intro text.
    if (insertIndex === -1) {
      for (let i = 0; i < lines.length; i += 1) {
        if (lines[i].match(/^#\s+changelog/i)) {
          // Skip past the header and any intro paragraph/empty lines
          insertIndex = i + 1;

          // Skip empty lines immediately after header
          while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
            insertIndex += 1;
          }

          // Skip intro paragraph if it exists (any non-heading text)
          while (insertIndex < lines.length
                 && lines[insertIndex].trim() !== ''
                 && !lines[insertIndex].match(/^##?\s+/)) {
            insertIndex += 1;
          }

          // Skip any trailing empty lines after intro
          while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
            insertIndex += 1;
          }

          break;
        }
      }
    }

    // If still no position found, insert at the beginning
    if (insertIndex === -1) {
      insertIndex = 0;
    }

    // Check if the changelog uses 'v' prefixes for version headers.
    const useVPrefixes = contents.match(/^##\s+v/im) !== null;

    const newEntry = [
      `## ${useVPrefixes ? `v${releaseVersion}` : releaseVersion}`,
      '',
      changelogEntry.trim(),
      '',
    ];

    // Insert the new entry
    lines.splice(insertIndex, 0, ...newEntry);

    const finalContents = lines.join('\n');

    fs.writeFileSync(changelogPath, finalContents, 'utf8');
    console.log(chalk.green('\n✓ Changelog updated successfully.\n'));
    return;
  }

  // If we're still here, they didn't provide an entry, so open the editor directly.
  while (true) { // eslint-disable-line no-constant-condition
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
    const editedContents = fs.readFileSync(tmpFile, 'utf8');

    if (editedContents.includes(releaseVersion) || editedContents.includes(`v${releaseVersion}`)) {
      // Copy the edited content back to the actual CHANGELOG.md
      fs.copyFileSync(tmpFile, changelogPath);
      fs.unlinkSync(tmpFile);
      console.log(chalk.green('\n✓ Changelog updated successfully.'));
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
      console.log(chalk.yellow('\n⚠️  Remember to update the changelog before releasing!'));
      break;
    }
  }
}
