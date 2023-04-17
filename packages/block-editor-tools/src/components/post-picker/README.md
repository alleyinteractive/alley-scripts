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

| Prop           | Default        | Required | Type     | Description                                                                                                     |
|----------------|----------------|----------|----------|-----------------------------------------------------------------------------------------------------------------|
| allowedTypes   | []             | No       | array    | Array with the post types to select from. Defaults to empty array (all types). |
| className      | ''             | No       | string   | Class name for the post picker container.                                                                      |
| getPost        |                | No       | function | Function to retrieve the post data for a post ID. Defaults to using getPostById. |
| onReset        |                | Yes      | function | Function to reset the post ID to 0.                          |
| onUpdate       |                | Yes      | function | Function to set the post ID on post selection.                                               |
| params         |                | No       | object   | Optional key value pairs to append to the search request. Ex: `{ per_page: 20 }`.                     |
| previewRender  |                | No       | function | Optional component to render the preview of the selected post. Must recieve an object similar to what is returned from the `/wp/v2/posts/<ID>` endpoint. |
| searchEndpoint | `/vp/v2/search` | No | Optional search endpoint. |
| searchRender   |                | No       | function | Optional component to render the preview of posts in the modal window. Must recieve an object similar to what is returned from the `/wp/v2/search` endpoint. |
| title          |                | No       | string   | Optional title for the component. |
| value          |                | Yes      | integer  | The ID of the selected post. 0 represents no selection.                                                   |