import { BaseControl, CheckboxControl } from '@wordpress/components';

interface CheckboxesProps {
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
  options: { label: string, value: string }[];
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
    {/* BaseControl's types require children; the checkboxes stay siblings to keep the markup. */}
    <BaseControl
      label={label}
    >
      {null}
    </BaseControl>
    {options.map((option) => (
      <CheckboxControl
        key={option.value}
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
