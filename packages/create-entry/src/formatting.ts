/**
 * Format a value to lowercase and replace spaces and underscores with hyphens.
 *
 * @param slug - A string to format.
 */
export function formatSlug(slug: string): string {
  if (!slug) {
    return '';
  }

  return slug.toLowerCase().replace(/[\s_]/g, '-');
}

/**
 * Converts all characters to snake case which
 * separates each word with an underscore character ( _ )
 * and all letters to lowercase.
 *
 * @param str - A string to format to a snake case string.
 */
export function toSnakeCase(str: string): string {
  if (!str) {
    return '';
  }

  return str.toLowerCase().replace(/-/g, '_');
}
