# Custom Hooks: useOption

A custom React hook to read and write an option/"site setting".

## Usage

1. Ensure that your option is set to show in REST.
```php
add_action ('admin_init', __NAMESPACE__ . '\register_settings' );
add_action( 'rest_api_init', __NAMESPACE__ . '\register_settings' );

function register_settings() {
  register_setting( 'options', 'my_option', [
    'type'              => 'string',
    'description'       => 'A custom option to do a little of this, that, or the other.',
    'sanitize_callback' => 'sanitize_text_field',
    'show_in_rest'      => true,
  ] );
}
```
2. Use the hook in your component.
```jsx
  const {
    value,
    isEdited,
    isSaving,
    onChange,
    onSave,
  } = useOption( 'my_option' );
```

## Reference

### `value` (mixed)

The option value.

### `isEdited` (boolean)

Is the value "dirty" -- edited but not yet saved to the database?

### `isSaving` (boolean)

Is the update request currently pending?

### `onChange` (callable)

Edit the value in local state. This updates the value in core/data, so the updated (dirty) value will reflect anywhere it's used in the editor.

### `onSave` (callable)

Persist the edited/dirty value to the database.

## Example

Below is a more complete working example of this hook. This component represents the `edit` interface of a block that renders the site's title in the site's primary brand color. This assumes that there's a custom option `primary_brand_color` properly registered elsewhere which stores a hex color. It reads the site title, the core/built-in WordPress option, to illustrate a use case of reading an option without the need to edit it.

```jsx
const {
  value: color,
  isEdited,
  isSaving,
  onChange,
  onSave,
} = useOption( 'primary_brand_color' );
const { value: siteTitle } = useOption( 'title' );

return (
  <>
    <InspectorControls>
      <PanelBody>
        <PanelRow>
          <TextControl
            label="Primary Brand Color"
            value={color}
            onChange={onChange}
          />
        </PanelRow>
        <PanelRow>
          <Button
            variant="primary"
            onClick={onSave}
            disabled={!isEdited}
            isBusy={isSaving}
          >Save Brand Color</Button>
        </PanelRow>
      </PanelBody>
    </InspectorControls>

    <h1 { ...useBlockProps() } style={color ? { color } : {}}>
      {siteTitle}
    </h1>
  </>
);
```

## TypeScript Support

`useOption` will infer the option value type for built-in WordPress core options. When using `useOption` with a custom option, it accepts a type variable to assist you with your usage of its return properties. Below are examples of the types of `value` for core options (`title`, `page_on_front`) and custom options (one with a provided type variable and one without).

```ts
useOption('title').value
// --> string | undefined

useOption<boolean>('my_custom_option').value
// --> boolean | undefined

useOption('page_on_front').value
// --> number | undefined

useOption('my_custom_option').value
// --> unknown
```
