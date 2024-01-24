export type DirectorySource = {
  /* Directory to use as the source. Can be a relative path. */
  directory: string;
  /* Directory within the source directory to use as the root. */
  root?: string;
};

export type GithubSource = {
  /* Repository to clone from (organization/repository with an optional branch). */
  github: string;
};

export type GitSource = {
  git: string;
};

/**
 * Source configuration.
 */
export type Source = DirectorySource | GithubSource | GitSource;
