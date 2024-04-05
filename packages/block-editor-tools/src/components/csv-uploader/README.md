# CSVUploader

Allows a user to upload a CSV file, which is parsed in the browser, converted to a JSON structure, passed through a user specified callback function for further transformation, and saved to block attributes. This component is intended to be used to save the resulting JSON data to postmeta, but that is controlled in the parent block scope.

## Development Guidelines

### Usage

Render a CSV upload component with a callback to further process the JSON data.
```js
<CSVUploader
  attributeName="data"
  callback={transformData}
  setAttributes={setAttributes}
/>
```

### Callback Function

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
