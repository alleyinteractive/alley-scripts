// Dependencies.
import { __ } from '@wordpress/i18n';
import { Selector } from '..';
import type { SelectorProps } from '../selector';

export type PostSelectorProps = Omit<SelectorProps, 'type'>;

/**
 * Render post selector component.
 *
 * Props left undefined fall through to Selector's defaults.
 * @deprecated since version 0.3.0
 */
const PostSelector = ({
  className,
  emptyLabel = __('No posts found', 'alley-scripts'),
  label = __('Search for posts', 'alley-scripts'),
  maxPages,
  multiple,
  onSelect,
  placeholder = __('Search for posts', 'alley-scripts'),
  subTypes,
  selected,
  threshold,
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
