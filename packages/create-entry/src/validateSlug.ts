/**
 * Validate a slug to ensure it is all lowercase and contains no spaces, only hyphens.
 * @param slug - A string to validate.
 */
export default function validateSlug(slug: string): boolean | string {
  // Regex to check if string is all lowercase and contains no spaces, only hyphens.
  const regex = /^[a-z]+(-[a-z]+)*$/;
  // Check if string matches the regex.
  return regex.test(slug) || 'Please enter a valid slug (lowercase, no spaces, only hyphens)';
}
