/**
 * Configuration of how to define a GitHub/Git remote reference.
 *
 * Used within sources and features to define where to clone from.
 */

export type GitHubConfig = {
  /* GitHub organization and repository to clone from. */
  github?: string;
  /* GitHub organization and repository to clone from. */
  name?: string;
  /* URL of the repository to clone from. */
  url?: string;
  /* The branch, tag, or commit to checkout. */
  ref?: string;
};

export type GitConfig = {
  /* URL of the repository to clone from. */
  url?: string;
  /* URL of the repository to clone from. */
  git?: string;
  /* The branch, tag, or commit to checkout. */
  ref?: string;
};
