/**
 * Escape a string for use in a regular expression.
 */
export function pregQuote(str: string) {
  return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&').replace(/-/g, '\\x2d');
}
