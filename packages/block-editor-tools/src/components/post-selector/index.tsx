// Dependencies.
import { __ } from '@wordpress/i18n';
import Selector, { type SelectorItem, type SelectorProps } from '../selector';

type PostSelectorProps = Omit<SelectorProps, 'type'>;

// Shared empty defaults, so Selector's effects see stable references.
const NO_SUB_TYPES: string[] = [];
const NO_SELECTED: SelectorItem[] = [];

/**
 * Render post selector component.
 * @deprecated since version 0.3.0
 */
const PostSelector = ({
  className = '',
  emptyLabel = __('No posts found', 'alley-scripts'),
  label = __('Search for posts', 'alley-scripts'),
  maxPages = 5,
  multiple = false,
  onSelect,
  placeholder = __('Search for posts', 'alley-scripts'),
  subTypes = NO_SUB_TYPES,
  selected = NO_SELECTED,
  threshold = 3,
}: PostSelectorProps) => (
  <Selector
    type="post"
    className={className}
    emptyLabel={emptyLabel}
    label={label}
    maxPages={maxPages}
    multiple={multiple}
    onSelect={onSelect}
    placeholder={placeholder}
    subTypes={subTypes}
    selected={selected}
    threshold={threshold}
  />
);

export default PostSelector;
