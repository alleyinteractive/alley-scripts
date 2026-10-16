import { BaseControl, CheckboxControl } from '@wordpress/components';

export interface CheckboxOption {
  label: string;
  value: string;
}

export interface CheckboxesProps {
  /**
   * The label for the component.
   */
  label: string;
  /**
   * The current value(s) as an array of strings.
   */
  value: string[];
  /**
   * Available options to choose from with a structure of `{ value: '', label: '' }`.
   */
  options: CheckboxOption[];
  /**
   * Function called with the selected options after the user makes an update.
   */
  onChange: (value: string[]) => void;
}

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
}: CheckboxesProps) => (
  <>
    {/* BaseControl's types require children; it is used here only for its label. */}
    <BaseControl
      label={label}
    >
      {null}
    </BaseControl>
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

export default Checkboxes;
