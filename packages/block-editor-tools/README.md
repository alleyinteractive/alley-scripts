# Alley Block Editor Tools

[![README standard](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

This package contains a set of modules used by [Alley](https://alley.com) to aid in building features for the WordPress block editor.

## Install

Install this package in your project:

```sh
npm install @alleyinteractive/block-editor-tools --save
```

## Usage

To use modules from this package, import them into your files using the `import` declaration.

**Example**
```jsx
import { usePostMeta } from '@alleyinteractive/block-editor-tools';

const MyComponent = () => {
  const [meta, setMeta] = usePostMeta();
  const { my_meta_key: myMetaKey } = meta;

  return (
    <TextControl
      label={__('My Meta Key', 'alley-scripts')}
      value={myMetaKey}
      onChange={(newValue) => setMeta({ ...meta, my_meta_key: newValue })}
    />
  );
};
```

Below is the documentation for all available components, hooks, and services.

## Components

React components that can be used within the WordPress block editor.

### AudioPicker

Allows a user to select or remove audio using the media modal or via direct
URL entry. This component is a thin wrapper around `MediaPicker` and sets the
allowed types for the `MediaPicker` to `audio` as well as provides a custom
preview component that embeds the selected audio in the editor.

For more information on how to use this component, see
[MediaPicker](src/components/media-picker/README.md).

**Usage**

``` js
<AudioPicker
  className="audio-picker"
  onReset={() => setAttributes({ audioId: 0 })}
  onUpdate={({ id }) => setAttributes({ audioId: id })}
  value={audioId}
/>
```

**Props**

| Prop        | Default     | Required | Type     | Description                                                                                              |
|-------------|-------------|----------|----------|----------------------------------------------------------------------------------------------------------|
| className   | ''          | No       | string   | Class name for the media picker container.                                                               |
| onReset     |             | Yes      | function | Function to reset the audio ID to 0 and/or the audio URL to an empty string.                             |
| onUpdate    |             | Yes      | function | Function to set the audio ID on audio selection/upload.                                                  |
| onUpdateURL | null        | No       | function | Function to set the audio URL on entry. If not set, the button to enter a URL manually will not display. |
| value       |             | Yes      | integer  | The ID of the selected audio. 0 represents no selection.                                                 |
| valueURL    | ''          | No       | string   | The URL of the audio. An empty string represents no selection.                                           |

### Checkboxes

Provides a UI component that uses the `Checkbox` component to render the equivalent
of a multi-select without needing to use the `SelectControl` component.

#### Usage

``` js
<Checkboxes
  label={__('Setting', 'alley-scripts')}
  value={setting}
  onChange={(newValue) => setAttributes({ setting: newValue })}
  options={[
    { value: 'option-1', label: __('Option 1', 'alley-scripts') },
    { value: 'option-2', label: __('Option 2', 'alley-scripts') },
  ]}
/>
```

#### Props

| Prop        | Default     | Required | Type     | Description                                                                                              |
|-------------|-------------|----------|----------|----------------------------------------------------------------------------------------------------------|
| label       |             | Yes      | string   | The label for the component.                                                                             |
| value       |             | Yes      | array    | The current value as an array of strings.                                                                |
| options     |             | Yes      | array    | Available options to choose from with a structure of `{ value: '', label: '' }`.                         |
| onChange    |             | Yes      | function | Function called with the selected options after the user makes an update.                                |


### CSVUploader

Allows a user to upload a CSV file, which is parsed in the browser, converted to a JSON structure, passed through a user specified callback function for further transformation, and saved to block attributes. This component is intended to be used to save the resulting JSON data to postmeta, but that is controlled in the parent block scope.

#### Usage

Render a CSV upload component with a callback to further process the JSON data.
```jsx
  <CSVUploader
    attributeName="data"
    callback={transformData}
    setAttributes={setAttributes}
  /> 
```
#### Callback Function

The callback function is optional, and allows for further processing of the data returned by the parser.

The callback function accepts an array of objects as its only parameter. Each object will be a description of one row in the CSV, with keys matching the headers in the file.

Given a CSV file in the following format:
```csv
title,slug,description
Sample Title,sample-title,Lorem ipsum dolor sit amet.
```
The array of objects passed to the callback function will take the following form:
```js
[
  {
    title: 'Sample Title',
    slug: 'sample-title',
    description: 'Lorem ipsum dolor sit amet.',
  },
]
```

Under the hood, the CSV parser uses PapaParse and attempts to make intelligent choices about data formats based on data in each column. Columns of integers should come through as integers, for example.

### ImagePicker

Allows a user to select or remove an image using the media modal or via direct
URL entry. This component is a thin wrapper around `MediaPicker` and sets the
allowed types for the `MediaPicker` to `image` as well as provides a custom
preview component that embeds the selected image in the editor.

For more information on how to use this component, see
[MediaPicker](../media-picker/README.md).

**Usage**

``` jsx
<ImagePicker
  className="image-picker"
  imageSize="thumbnail"
  onReset={() => setAttributes({ imageId: 0 })}
  onUpdate={({ id }) => setAttributes({ imageId: id })}
  value={imageId}
/>
```

**Props**

| Prop         | Default     | Required | Type     | Description                                                                                              |
|--------------|-------------|----------|----------|----------------------------------------------------------------------------------------------------------|
| className    | ''          | No       | string   | Class name for the media picker container.                                                               |
| imageSize    | 'thumbnail' | No       | string   | The size to display in the preview.                                                                      |
| displayControlsInToolbar | false | No | boolean | Determines if controls should render in the block toolbar.                                                |
| onReset      |             | Yes      | function | Function to reset the image ID to 0 and/or the image URL to an empty string.                             |
| onUpdate     |             | Yes      | function | Function to set the image ID on image selection/upload.                                                  |
| onUpdateURL  | null        | No       | function | Function to set the image URL on entry. If not set, the button to enter a URL manually will not display. |
| value        |             | Yes      | integer  | The ID of the selected image. 0 represents no selection.                                                 |
| valueURL     | ''          | No       | string   | The URL of the image. An empty string represents no selection.                                           |

### MediaPicker

Allows for a simple media upload/replace/remove feature for media for blocks.

**Usage**

``` js
<MediaPicker
  allowedTypes={['application/pdf']}
  className="media-picker"
  onReset={() => setAttributes({ mediaId: 0 })}
  onUpdate={({ id }) => setAttributes({ mediaId: id })}
  value={mediaId}
/>
```

The value of `mediaId` is the ID of the media element, and is destructured from
`props.attributes`.

There are additional options for the MediaPicker that can be configured via the
props listed below. For example, the MediaPicker also supports URL entry as well
as custom preview components, which is useful when you want to render an image
or an embed instead of just a text link to the selected asset.

**Props**

| Prop         | Default        | Required | Type     | Description                                                                                                     |
|--------------|----------------|----------|----------|-----------------------------------------------------------------------------------------------------------------|
| allowedTypes | []             | No       | array    | Array with the types of the media to upload/select from the media library. Defaults to empty array (all types). |
| className    | ''             | No       | string   | Class name for the media picker container.                                                                      |
| icon         | 'format-aside' | No       | string   | The name of the Dashicon to use next to the title when no selection has been made yet.                          |
| imageSize    | 'thumbnail'    | No       | string   | If the selected item is an image, the size to display in the preview.                                           |
| displayControlsInToolbar | false | No | boolean | Determines if controls should render in the block toolbar. |
| onReset      |                | Yes      | function | Function to reset the attachment ID to 0 and/or the attachment URL to an empty string.                          |
| onUpdate     |                | Yes      | function | Function to set the attachment ID on attachment selection/upload.                                               |
| onUpdateURL  | null           | No       | function | Function to set the attachment URL on entry. If not set, the button to enter a URL manually will not display.   |
| preview      | null           | No       | element  | An optional JSX component that accepts an `src` prop as a string to render the preview upon selection.          |
| value        |                | Yes      | integer  | The ID of the selected attachment. 0 represents no selection.                                                   |
| valueURL     | ''             | No       | string   | The URL of the attachment. An empty string represents no selection.                                             |


### PostPicker

Allows for a simple post select/replace/remove feature, similar to selecting an item from the media library.

**Usage**

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

**Props**

| Prop           | Default        | Required | Type     | Description                                                                                                     |
|----------------|----------------|----------|----------|-----------------------------------------------------------------------------------------------------------------|
| allowedTypes   | `[]`         | No       | array    | Array with the post types to select from. Defaults to empty array (all types). |
| className      | `''`           | No       | string   | Class name for the post picker container.                                                                      |
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

### SafeHTML

A lightweight, reusable component for safely creating a component
that contains arbitrary HTML, such as from a REST API.

Uses `dangerouslySetInnerHTML` and `DOMPurify` under the hood.

Because of how `dangerouslySetInnerHTML` works, you need to
provide a tag to inject the HTML into. If the HTML you want to
inject is wrapped in the tag you want to use, you will need to
strip that out first.

**Usage**

```jsx
<SafeHTML
  className="some-classname"
  html="<p>some arbitrary html</p>"
  tag="div"
/>
```

**Props**

| prop      | required | type   |                                                 |
|-----------|----------|--------|-------------------------------------------------|
| className | No       | string | A classname for the element.                    |
| html      | Yes      | string | The arbitrary HTML to sanitize and insert      |
| tag       | Yes      | string | The tag name to wrap the HTML in, e.g.,  `div`. |

### Selector

Allows users to select an item or multiple items using a search query against the REST API. Optionally, accepts a list of subtypes to which to restrict the search. Utilizes the search endpoint, so items must have the appropriate visibility within the REST API to appear in the result list.

Importantly, this component does not save the selected item, it just returns it in the `onSelect` method. The enclosing block or component is responsible for managing the selected items in some way, and using this component as a method for picking a new one.

**Usage**

``` js
  <Selector
    className="custom-autocomplete-classname"
    emptyLabel="No items."
    label="Label"
    multiple
    onSelect={onSelect}
    placeholder="Placeholder..."
    subTypes={['post', 'page']}
    selected={[{
      id: 123,
      title: 'Title of Element',
    }]}
    threshold={3}
  />
```
**Props**

| Prop        | Default          | Required | Type     | Description                                                                                                                 |
|-------------|------------------|----------|----------|-----------------------------------------------------------------------------------------------------------------------------|
| className   |                  | false    | string   | If specified, the className is prepended to the top-level container.                                                        |
| emptyLabel  | No items found   | false    | string   | If specified, this overrides the default language when no items are found.                                                  |
| label       | Search for items | false    | string   | If specified, this overrides the default label text for the item selection search input.                                    |
| multiple    | false            | false    | boolean  | If set to true the component allows for the ability to select multiple items returned through the `onSelect` callback.      |
| onSelect    | NA               | true     | function | Callback to receive the selected item array, as it is returned from the `search` REST endpoint. Required.                   |
| placeholder | Search for items | false    | string   | If specified, this overrides the default input placeholder value.                                                           |
| subTypes   | []               | false    | array    | All queryable subtypes that will be included in the form comma-separated array. The default query is "any" subtype.     |
| selected    | []               | false    | array    | Optional array of objects with id and title keys to auto-hydrate selections on load.                                        |
| threshold   | 3                | false    | integer  | If specified, this overrides the default minimum number of characters that must be entered in order for the search to fire. |


### TermSelect

A component for selecting terms.

**Usage**
See the Selector component for usage details. The `type` prop is preset to `term`.

### VideoPicker

Allows a user to select or remove a video using the media modal or via direct
URL entry. This component is a thin wrapper around `MediaPicker` and sets the
allowed types for the `MediaPicker` to `video` as well as provides a custom
preview component that embeds the selected video in the editor.

For more information on how to use this component, see
[MediaPicker](../media-picker/README.md).

**Usage**

``` js
<VideoPicker
  className="video-picker"
  onReset={() => setAttributes({ videoId: 0 })}
  onUpdate={({ id }) => setAttributes({ videoId: id })}
  value={videoId}
/>
```

**Props**

| Prop        | Default     | Required | Type     | Description                                                                                              |
|-------------|-------------|----------|----------|----------------------------------------------------------------------------------------------------------|
| className   | ''          | No       | string   | Class name for the media picker container.                                                               |
| onReset     |             | Yes      | function | Function to reset the video ID to 0 and/or the video URL to an empty string.                             |
| onUpdate    |             | Yes      | function | Function to set the video ID on video selection/upload.                                                  |
| onUpdateURL | null        | No       | function | Function to set the video URL on entry. If not set, the button to enter a URL manually will not display. |
| value       |             | Yes      | integer  | The ID of the selected video. 0 represents no selection.                                                 |
| valueURL    | ''          | No       | string   | The URL of the video. An empty string represents no selection.                                           |

---

## Hooks

Hooks are custom React hooks that provide various functionalities within the block editor.

### useBlockName

A custom React hook that returns the name of a block.

**Usage**

```jsx
const MyBlock = ({ clientId }) => {
  const blockName = useBlockName(clientId);

  ...
};
```

```jsx
const MyBlock = ({ clientId }) => {
  const parentBlockClientId = useParentClientId(clientId);
  const parentBlockName = useBlockName(parentBlockClientId);
  ...
};
```

### useCurrentPostId

A custom React hook to retrieve the current post ID.

**Usage**

```jsx
const MyBlock = () => {
  const currentPostID = useCurrentPostId();

  if (currentPostID) {
    ...
  }
};
```

### useDebounce

A custom React hook that creates and returns a new debounced version of the passed value that will postpone its execution until after wait milliseconds have elapsed since the last time it was invoked

@see <https://github.com/alleyinteractive/alley-scripts/issues/250>

## Usage

```jsx
const MyComponent = () => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 500);

  // This value will display after 500 miliseconds
  useEffect(() => {
    // Kickoff Function on a delay.
  }, [debouncedValue]);

  return (
    <>
      <TextControl
        label={__('Set Value', 'your-textdomain-here')}
        onChange={(next) => setValue(next)}
        value={value}
      />
    </>
  );
};
```

### useHasInnerBlocks

A custom React hook that determines if a block has inner blocks.

**Usage**

```jsx
const MyBlock = ({
 clientId
}) => {
  const hasInnerBlocks = useHasInnerBlocks(clientId);

  if (hasInnerBlocks) {
    ...
  } else {
    ...
  }

  ...
};
```

### useInnerBlockIndex

A custom React hook that returns the current block's index relative to its siblings
within a parent block.

**Usage**

```jsx
const MyBlock = ({
 clientId
}) => {
  const blockIndex = useInnerBlockIndex(clientId);

  ...
};
```

### useInnerBlocksAttributes

A custom React hook that returns the current blocks' inner block's attributes.

**Usage**

```jsx
const MyBlock = ({
 clientId
}) => {
  const innerBlockAttributes = useInnerBlocksAttributes(clientId);

  ...
};
```

### useInnerBlocksCount

A custom React hook that returns the current block's inner block count.

**Usage**

```jsx
const MyBlock = ({
 clientId
}) => {
  const innerBlocksCount = useInnerBlocksCount(clientId);

  ...
};
```

### useMedia

A custom React hook for attachment data given an ID.

**Usage**

```jsx
const MyBlock = ({
	imageID,
}) => {
  const image = useMedia(imageID);

  ...
};
```

### useParentBlock

A custom React hook that returns the current block's parent block.

**Usage**

```jsx
const MyBlock = ({ clientId }) => {
  const parentBlock = useParentBlock(clientId);

  ...
};
```

### useParentBlockAttributes

A custom React hook that returns the current block's parent block attributes.

**Usage**

```jsx
const MyBlock = ({
 clientId
}) => {
  const parentBlockAttributes = useParentBlockAttributes(clientId);

  ...
};
```

### useParentClientId

A custom React hook that returns the client id of the parent block of the current block.

**Usage**

```jsx
const MyBlock = ({ clientId }) => {
  const parentBlockClientId = useParentClientId(clientId);

  ...
};
```

### usePost

A custom React hook to retrieve post data given a post ID and post type.

**Usage**

```jsx
const MyBlock = ({
 postID,
}) => {
  const post = usePost(postID, postType);

  if (post) {
    ...
  }
};
```

### usePostById

A custom React hook to retrieve post data given only a post ID.
If you have the post type, use `usePost` instead.

**Usage**

```jsx
const MyBlock = ({
 postID,
}) => {
  const post = usePostById(postID);

  if (post) {
    ...
  }
};
```

You can also pass a function to lookup the post type when passed the post id.

```jsx
const MyBlock = ({
 postID,
}) => {
  const myCustomPostTypeLookup = (id) => (
    myCustomPostTypeMap[id]
  );

  const post = usePostById(postID, myCustomPostTypeLookup);

  if (post) {
    ...
  }
};
```

This function must return a string that is the post type.

### usePostMeta

A custom React hook that wraps useEntityProp for working with postmeta. This
hook is intended to reduce boilerplate code in components that need to read
and write postmeta. By default, it operates on postmeta for the current post,
but you can optionally pass a post type and post ID in order to get and set
post meta for an arbitrary post.

**Usage**

**Editing the Current Post's Meta**

```jsx
const MyComponent = () => {
  const [meta, setMeta] = usePostMeta();
  const { my_meta_key: myMetaKey } = meta;

  return (
    <TextControl
      label={__('My Meta Key', 'your-textdomain-here')}
      onChange={(next) => setMeta({ ...meta, my_meta_key: next })}
      value={myMetaKey}
    />
  );
};
```

**Editing Another Post's Meta**

```jsx
const MyComponent = ({
  postId,
  postType,
}) => {
  const [meta, setMeta] = usePostMeta(postType, postId);
  const { my_meta_key: myMetaKey } = meta;

  return (
    <TextControl
      label={__('My Meta Key', 'your-textdomain-here')}
      onChange={(next) => setMeta({ ...meta, my_meta_key: next })}
      value={myMetaKey}
    />
  );
};
```

### usePostMetaValue

A custom React hook that wraps useEntityProp for working with a specific
postmeta value. It returns the value for the specified meta key as well as a
setter for the meta value. This hook is intended to reduce boilerplate code
in components that need to read and write postmeta. It differs from
usePostMeta in that it operates on a specific meta key/value pair.
By default, it operates on postmeta for the current post, but you can
optionally pass a post type and post ID in order to get and set post meta
for an arbitrary post.

**Usage**

**Editing the Current Post's Meta**

```jsx
const MyComponent = () => {
  const [myMetaKey, setMyMetaKey] = usePostMetaValue('my_meta_key');

  return (
    <TextControl
      label={__('My Meta Key', 'your-textdomain-here')}
      onChange={setMyMetaKey}
      value={myMetaKey}
    />
  );
};
```

**Editing Another Post's Meta**

```jsx
const MyComponent = ({
  postId,
  postType,
}) => {
  const [myMetaKey, setMyMetaKey] = usePostMetaValue('my_meta_key', postType, postId);

  return (
    <TextControl
      label={__('My Meta Key', 'your-textdomain-here')}
      onChange={setMyMetaKey}
      value={myMetaKey}
    />
  );
};
```

### usePosts

A custom React hook to retrieve multiple posts' data given an array of post IDs and a single post type.

**Usage**

```jsx
const MyBlock = ({
 postIDs,
}) => {
  const posts = usePosts(postIDs, postType);

  if (posts) {
    ...
  }
};
```

### useTerms

 A custom React hook that wraps useEntityProp for working with a post's terms.
 It returns an array that contains a copy of a post's terms assigned from a
 given taxonomy as well as a helper function that sets the terms for a given
 post. This hook is intended to reduce boilerplate code in components that
 need to update a post's terms. By default, it operates on terms for the
 current post, but you can optionally pass a post type and post ID in order to
 get and set terms for an arbitrary post.

**Usage**

**Editing the Current Post's Terms**

```jsx
const MyComponent = ({
  taxonomy,
}) => {
  const [terms, setTerms] = useTerms(null, null, taxonomy);

  return (
    <SelectControl
      label={__('My Terms', 'your-textdomain-here')}
      multiple
      onChange={(next) => setTerms(next)}
      options={options}
      value={terms}
    />
  );
};
```

**Editing Another Post's Terms**

```jsx
const MyComponent = ({
  postId,
  postType,
  taxonomy,
}) => {
  const [terms, setTerms] = useTerms(postType, postId, taxonomy);

  return (
    <SelectControl
      label={__('My Terms', 'your-textdomain-here')}
      multiple
      onChange={(next) => setTerms(next)}
      options={options}
      value={terms}
    />
  );
};
```
---
## Services

Services are utility functions that provide additional functionalities.

### parseCSVFile

Parses a CSV file and converts it into an array of objects.

Given a File object containing CSV data, `parseCSVFile` parses the CSV and returns an array of objects that are keyed by column names. Assumes that the first row in the CSV is the name of the column. Skips empty lines and attempts to do automatic type conversion.

_Parameters_
* {File} `file` - The CSV file object.

_Returns_
* {Promise} - A Promise that will resolve to an array of row objects.

### getMediaUrl

Extracts the URL for a media item at a requested size from a media object.

Given a media object returned from the WordPress REST API, extracts the URL for the media item at the requested size if it exists, or the full size if it does not. Returns an empty string if unable to find either. Uses a superset of the same logic that the Gutenberg Image component uses for selecting the correct image size from a media REST API response.

_Parameters_
* {object} `media` - A media object returned by the WordPress API.
* {string} `size` - Media size to request. Default: full

_Returns_
* {string} - The URL to the asset, or an empty string on failure.

---

## Changelog

This project keeps a [changelog](CHANGELOG.md).

## Development Process

This package is developed as part of the [Alley Scripts](https://github.com/alleyinteractive/alley-scripts) project on GitHub. The project is organized as a monorepo using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) and individual packages are published to npm under the [@alleyinteractive](https://www.npmjs.com/org/alleyinteractive) organization.

### Contributing

You can contribute to this project in several ways:

- Visit the main [Alley Scripts GitHub repo](https://github.com/alleyinteractive/alley-scripts) to [Open an issue](https://github.com/alleyinteractive/alley-scripts/issues/new) or submit PRs.

### Releases

This project adheres to the [Semantic Versioning 2.0.0](https://semver.org/) specification. All major, minor, and patch releases are published to npm and tagged in the repo. We will maintain separate branches for each minor release (e.g. block-editor-tools/0.1) to manage patch releases while keeping future development in the `main` branch.

## Maintainers

This project is actively maintained by [Alley Interactive](https://github.com/alleyinteractive). Like what you see? [Come work with us](https://alley.com/careers/).

![Alley logo](https://avatars.githubusercontent.com/u/1733454?s=200&v=4)

## License

This software is released under the terms of the GNU General Public License version 2 or any later version.
