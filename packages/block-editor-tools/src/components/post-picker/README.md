# PostPicker

Allows for a simple post select/replace/remove feature, similar to selecting an item from the media library.

## Usage

``` js
<PostPicker
  allowedTypes={['post']}
  className="post-picker"
  onReset={() => setAttributes({ postId: 0 })}
  onUpdate={( id ) => setAttributes({ postId: id })}
  value={postId}
/>
```

There are additional options for the PostPicker that can be configured via the
props listed below. For example, the PostPicker also supports customizing the arguments
sent to the search endpoint, a custom renderer for previews, a custom renderer for search
results, and a custom function for fetching post data given a post ID.

## Props

| Prop           | Default        | Required | Type     | Description                                                                                                     |
|----------------|----------------|----------|----------|-----------------------------------------------------------------------------------------------------------------|
| allowedTypes   | `[]`         | No       | array    | Array with the post types to select from. Defaults to empty array (all types). |
| className      | `''`           | No       | string   | Class name for the post picker container.                                                                      |
| filters        |                | No       | JSX Node(s) | Optional JSX to display between the search field and post list in the modal, to add
instructions or filters. It is up to the implementer to handle changes and adjust the other props (such as allowedTypes or params) accordingly. |
| getPostType    |                | No       | function | Function to retrieve the post type for a post ID. This function must return a string. |
| modalTitle     | `Select Post`  | No       | string   | Title of the modal that shows posts. |
| onReset        |                | Yes      | function | Function to reset the post ID to 0.                          |
| onUpdate       |                | Yes      | function | Function to set the post ID on post selection.                                               |
| params         | `{}`           | No       | object   | Optional key value pairs to append to the search request. Ex: `{ per_page: 20 }`.                     |
| previewRender  |                | No       | function | Optional component to render the preview of the selected post. Must recieve an object similar to what is returned from the `/wp/v2/posts/<ID>` endpoint. |
| replaceText    | `Replace`      | No       | string   | Text shown on the button that will open the picker to replace a currently selected post. |
| resetText      | `Reset`        | No       | string   |Text shown on the button that will reset the picker to having no post selected. |
| searchEndpoint | `/wp/v2/search` | No | string | Optional search endpoint. |
| searchRender   |                | No       | function | Optional component to render the preview of posts in the modal window. Must recieve an object similar to what is returned from the `/wp/v2/search` endpoint. |
| selectText     | `Select`       | No       | string   | Text shown on the button that will open the picker to select a post. |
| suppressPostIds |                | No       | array    | Array of post ids to not show in the results list. |
| title          | `''`           | No       | string   | Optional title for the component. |
| value          |                | Yes      | integer  | The ID of the selected post. 0 represents no selection.                                                   |
