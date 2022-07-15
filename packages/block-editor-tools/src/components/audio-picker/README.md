# AudioPicker

Allows a user to select or remove audio using the media modal or via direct
URL entry. This component is a thin wrapper around `MediaPicker` and sets the
allowed types for the `MediaPicker` to `audio` as well as provides a custom
preview component that embeds the selected audio in the editor.

For more information on how to use this component, see
[MediaPicker](../media-picker/README.md).

## Usage

``` js
<AudioPicker
  className="audio-picker"
  onReset={() => setAttributes({ audioId: 0 })}
  onUpdate={({ id }) => setAttributes({ audioId: id })}
  value={audioId}
/>
```

## Props

| Prop        | Default     | Required | Type     | Description                                                                                              |
|-------------|-------------|----------|----------|----------------------------------------------------------------------------------------------------------|
| className   | ''          | No       | string   | Class name for the media picker container.                                                               |
| onReset     |             | Yes      | function | Function to reset the audio ID to 0 and/or the audio URL to an empty string.                             |
| onUpdate    |             | Yes      | function | Function to set the audio ID on audio selection/upload.                                                  |
| onUpdateURL | null        | No       | function | Function to set the audio URL on entry. If not set, the button to enter a URL manually will not display. |
| value       |             | Yes      | integer  | The ID of the selected audio. 0 represents no selection.                                                 |
| valueURL    | ''          | No       | string   | The URL of the audio. An empty string represents no selection.                                           |
