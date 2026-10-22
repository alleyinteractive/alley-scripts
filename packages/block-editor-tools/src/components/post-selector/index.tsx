// Dependencies.
import { __ } from '@wordpress/i18n';
import { Selector } from '..';

import type { SelectorItem, SelectorProps } from '../selector';

export type PostSelectorProps = Omit<SelectorProps, 'type'>;

// Stable default references, matching the previous `defaultProps` behavior.
const DEFAULT_SELECTED: SelectorItem[] = [];
const DEFAULT_SUB_TYPES: string[] = [];

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
  subTypes = DEFAULT_SUB_TYPES,
  selected = DEFAULT_SELECTED,
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
