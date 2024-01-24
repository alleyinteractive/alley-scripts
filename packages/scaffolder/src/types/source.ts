export type DirectorySource = {
  directory: string;
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
