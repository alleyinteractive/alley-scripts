// Dependencies.
import PropTypes from 'prop-types';

import { __ } from '@wordpress/i18n';
import { Selector } from '..';

/**
 * Render post selector component.
 * @deprecated since version 0.3.0
 */
const PostSelector = ({
  className,
  emptyLabel,
  label,
  maxPages,
  multiple,
  onSelect,
  placeholder,
  subTypes,
  selected,
  threshold,
}) => (
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

/**
 * Set initial props.
 * @type {object}
 */
PostSelector.defaultProps = {
  className: '',
  emptyLabel: __('No posts found', 'alley-scripts'),
  label: __('Search for posts', 'alley-scripts'),
  maxPages: 5,
  multiple: false,
  placeholder: __('Search for posts', 'alley-scripts'),
  subTypes: [],
  selected: [],
  threshold: 3,
};

/**
 * Set PropTypes for this component.
 * @type {object}
 */
PostSelector.propTypes = {
  className: PropTypes.string,
  emptyLabel: PropTypes.string,
  label: PropTypes.string,
  maxPages: PropTypes.number,
  multiple: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  subTypes: PropTypes.arrayOf(PropTypes.string),
  selected: PropTypes.arrayOf([
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    }),
  ]),
  threshold: PropTypes.number,
};

export default PostSelector;
