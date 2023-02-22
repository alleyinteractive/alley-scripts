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
  /**
   * The label for the component.
   */
  label: PropTypes.string.isRequired,
  /**
   * The current value(s) as an array of strings.
   */
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * Available options to choose from with a structure of `{ value: '', label: '' }`.
   */
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  /**
   * Function called with the selected options after the user makes an update.
   */
  onChange: PropTypes.func.isRequired,
};

export default Checkboxes;
