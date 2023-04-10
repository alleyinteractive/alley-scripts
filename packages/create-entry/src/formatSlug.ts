/**
 * Format a value to lowercase and replace spaces and underscores with hyphens.
 *
 * @param slug - A string to format.
 */
export default function formatSlug(slug: string): string {
  return slug.toLowerCase().replace(/[\s_]/g, '-');
}
