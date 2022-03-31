// Dependencies.
import PropTypes from 'prop-types';

import { __ } from '@wordpress/i18n';

import { Selector } from '../selector';

/**
 * Render term selector component.
 */
const TermSelector = ({
  className,
  emptyLabel,
  label,
  maxPages,
  maxSelections,
  multiple,
  onSelect,
  placeholder,
  subTypes,
  selected,
  threshold,
}) => (
  <Selector
    type="term"
    className={className}
    emptyLabel={emptyLabel}
    label={label}
    maxPages={maxPages}
    maxSelections={maxSelections}
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
TermSelector.defaultProps = {
  className: '',
  emptyLabel: __('No terms found', 'prhuk-core'),
  label: __('Search for terms', 'prhuk-core'),
  maxPages: 5,
  maxSelections: 0,
  multiple: false,
  placeholder: __('Search for terms', 'prhuk-core'),
  subTypes: [],
  selected: [],
  threshold: 3,
};

/**
 * Set PropTypes for this component.
 * @type {object}
 */
TermSelector.propTypes = {
  className: PropTypes.string,
  emptyLabel: PropTypes.string,
  label: PropTypes.string,
  maxPages: PropTypes.number,
  maxSelections: PropTypes.number,
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

export default TermSelector;
