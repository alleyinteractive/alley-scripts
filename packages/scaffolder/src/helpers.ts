import { spawn } from 'node:child_process';

/**
 * Parse a GitHub URL into its components.
 *
 * Match the organization, repository, and revision from the URL.
 * Example: https://github.com/organization/repository.git#revision
 */
export const parseGitHubUrl = (url: string) => {
  const [, org, repo, revision] = url.match(/^(?:(?:https:\/\/github.com\/)|(?:git@github.com:))?([A-Za-z0-9_.-]*)\/([A-Za-z0-9_.-]*)(?:\.git)?(#[A-Za-z0-9_.-/]*)?$/) || [];

  return {
    org,
    repo: repo ? repo.replace(/\.git$/, '') : undefined,
    revision: revision ? revision.slice(1) : undefined,
  };
};

/**
 * Run a command with child_process.spawn().
 */
export const runCommand = (command: string, cwd: string) => new Promise<void>((resolve, reject) => {
  const run = spawn(command, [], {
    cwd,
    shell: true,
    stdio: 'inherit',
  });

  run.on('close', (code) => {
    if (code === 0) {
      resolve();
    } else {
      reject(new Error(`Command failed with code ${code}`));
    }
  });
});
