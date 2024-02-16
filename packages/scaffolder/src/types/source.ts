import type { GitHubConfig, GitConfig } from './remoteSource';

export type DirectorySource = {
  /* Directory to use as the source. Can be a relative path. */
  directory: string;
  /* Directory within the source directory to use as the root. */
  root?: string;
};

type GitSourceConfiguration = {
  /* The subdirectory within the repository to use as the root for sources. */
  directory?: string;
  /* The number of seconds to wait before updating the repository. Defaults to  */
  updateThreshold?: number;
};

/* Configuration of a GitHub source within a source/feature configuration. */
export type GithubSource = {
  /* Repository to clone from (organization/repository with an optional branch). */
  github: string | (GitHubConfig & GitSourceConfiguration);
};

/* Configuration of a Git source within a source/feature configuration. */
export type GitSource = {
  git: string | (GitConfig & GitSourceConfiguration);
};

/**
 * Source configuration.
 */
export type Source = DirectorySource | GithubSource | GitSource;
