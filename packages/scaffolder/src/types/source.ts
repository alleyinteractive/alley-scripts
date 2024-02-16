export type DirectorySource = {
  /* Directory to use as the source. Can be a relative path. */
  directory: string;
  /* Directory within the source directory to use as the root. */
  root?: string;
};

export type GithubSource = {
  /* Repository to clone from (organization/repository with an optional branch). */
  github: string | {
    github?: string;
    name?: string;
    url?: string;
    ref?: string;
    /* The subdirectory within the repository to use as the root. */
    directory?: string;
  };
};

export type GitSource = {
  git: string | {
    url?: string;
    git?: string;
    ref?: string;
    /* The subdirectory within the repository to use as the root. */
    directory?: string;
    /* The number of seconds to wait before updating the repository. Defaults to  */
    updateThreshold?: number;
  };
};

/**
 * Source configuration.
 */
export type Source = DirectorySource | GithubSource | GitSource;
