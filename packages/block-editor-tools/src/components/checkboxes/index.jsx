import PropTypes from 'prop-types';

import { BaseControl, CheckboxControl } from '@wordpress/components';

/**
 * Provides a UI component that uses the `Checkbox` component to render the
 * equivalent of a multi-select without needing to use the `SelectControl`
 * component.
 */
const Checkboxes = ({
  label,
  value,
  options,
  onChange,
}) => (
  <>
    <BaseControl
      label={label}
    />
    {options.map((option) => (
      <CheckboxControl
        label={option.label}
        checked={value.includes(option.value)}
        onChange={(checked) => {
          if (checked) {
            onChange([...value, option.value]);
          } else {
            onChange([...value.filter((item) => item !== option.value)]);
          }
        }}
      />
    ))}
  </>
);

Checkboxes.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Checkboxes;
