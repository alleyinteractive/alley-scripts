/**
 * An item returned from the `/wp/v2/search` endpoint and tracked as a
 * selection by `Selector`.
 */
export interface SelectorItem {
  id: number;
  title: string;
  [key: string]: unknown;
}
