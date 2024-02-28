/**
 * Get the global configuration directory for the scaffolder.
 *
 * By default this is located at `~/.scaffolder`.
 */
export function getGlobalDirectory(): string {
  return process.env.SCAFFOLDER_HOME || `${process.env.HOME}/.scaffolder`;
}
