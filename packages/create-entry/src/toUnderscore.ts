/**
 * Converts all characters to lowercase and hyphens to underscores for use in PHP.
 *
 * @param str - A string to format to a PHP namespace.
 */
export default function toUnderscore(str: string): string {
  return str.toLowerCase().replace(/-/g, '_');
}
