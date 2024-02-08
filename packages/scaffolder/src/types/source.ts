export type DirectorySource = {
  /* Directory to use as the source. Can be a relative path. */
  directory: string;
  /* Directory within the source directory to use as the root. */
  root?: string;
};

export type GithubSourceConfig = {
  github?: string;
  name?: string;
  url?: string;
  ref?: string;
  /* The subdirectory within the repository to use as the root. */
  directory?: string;
};

export type GithubSource = {
  /* Repository to clone from (organization/repository with an optional branch). */
  github: string | GithubSourceConfig;
};

export type GitSourceConfig = {
  url?: string;
  git?: string;
  ref?: string;
  /* The subdirectory within the repository to use as the root. */
  directory?: string;
};

export type GitSource = {
  git: string | GitSourceConfig;
};

/**
 * Source configuration.
 */
export type Source = DirectorySource | GithubSource | GitSource;
