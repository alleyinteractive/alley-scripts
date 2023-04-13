# PostPicker

Allows for a simple post upload/replace/remove feature for post for blocks.

## Usage

``` js
<PostPicker
  allowedTypes={['post']}
  className="post-picker"
  onReset={() => setAttributes({ postId: 0 })}
  onUpdate={({ id }) => setAttributes({ postId: id })}
  value={postId}
/>
```

The value of `postId` is the ID of the post element, and is destructured from
`props.attributes`.

There are additional options for the PostPicker that can be configured via the
props listed below. For example, the PostPicker also supports URL entry as well
as custom preview components, which is useful when you want to render an image
or an embed instead of just a text link to the selected asset.

## Props

| Prop         | Default        | Required | Type     | Description                                                                                                     |
|--------------|----------------|----------|----------|-----------------------------------------------------------------------------------------------------------------|
| allowedTypes | []             | No       | array    | Array with the post types to select from. Defaults to empty array (all types). |
| className    | ''             | No       | string   | Class name for the post picker container.                                                                      |
| icon         | 'format-aside' | No       | string   | The name of the Dashicon to use next to the title when no selection has been made yet.                          |
| onReset      |                | Yes      | function | Function to reset the attachment ID to 0 and/or the attachment URL to an empty string.                          |
| onUpdate     |                | Yes      | function | Function to set the attachment ID on attachment selection/upload.                                               |
| value        |                | Yes      | integer  | The ID of the selected attachment. 0 represents no selection.                                                   |
