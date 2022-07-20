# VideoPicker

Allows a user to select or remove a video using the media modal or via direct
URL entry. This component is a thin wrapper around `MediaPicker` and sets the
allowed types for the `MediaPicker` to `video` as well as provides a custom
preview component that embeds the selected video in the editor.

For more information on how to use this component, see
[MediaPicker](../media-picker/README.md).

## Usage

``` js
<VideoPicker
  className="video-picker"
  onReset={() => setAttributes({ videoId: 0 })}
  onUpdate={({ id }) => setAttributes({ videoId: id })}
  value={videoId}
/>
```

## Props

| Prop        | Default     | Required | Type     | Description                                                                                              |
|-------------|-------------|----------|----------|----------------------------------------------------------------------------------------------------------|
| className   | ''          | No       | string   | Class name for the media picker container.                                                               |
| onReset     |             | Yes      | function | Function to reset the video ID to 0 and/or the video URL to an empty string.                             |
| onUpdate    |             | Yes      | function | Function to set the video ID on video selection/upload.                                                  |
| onUpdateURL | null        | No       | function | Function to set the video URL on entry. If not set, the button to enter a URL manually will not display. |
| value       |             | Yes      | integer  | The ID of the selected video. 0 represents no selection.                                                 |
| valueURL    | ''          | No       | string   | The URL of the video. An empty string represents no selection.                                           |
