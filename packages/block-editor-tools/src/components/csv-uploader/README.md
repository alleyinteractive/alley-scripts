# CSVUploader

Allows a user to upload a CSV file, which is parsed in the browser, converted to a JSON structure, passed through a user specified callback function for further transformation, and saved to block attributes. This component is intended to be used to save the resulting JSON data to postmeta, but that is controlled in the parent block scope.

## Development Guidelines

### Usage

Render a CSV upload component with a callback to further process the JSON data.

    <CSVUploader
      attributeName="data"
      callback={transformData}
      setAttributes={setAttributes}
    /> 

### Callback Function

The callback function is optional, and allows for further processing of the data returned by the parser.

The callback function accepts an array of objects as its only parameter. Each object will be a description of one row in the CSV, with keys matching the headers in the file.

Given a CSV file in the following format:

    title,slug,description
    Sample Title,sample-title,Lorem ipsum dolor sit amet.
    
The array of objects passed to the callback function will take the following form:

    [
      {
        title: 'Sample Title',
        slug: 'sample-title',
        description: 'Lorem ipsum dolor sit amet.',
      },
    ]
    
Under the hood, the CSV parser uses PapaParse and attempts to make intelligent choices about data formats based on data in each column. Columns of integers should come through as integers, for example.

It is recommended to put the callback function in the `services/data` directory with a corresponding test.

### Sanitization

When registering the meta field using `register_meta_helper`, you will need to provide a `sanitize_callback` in the fourth parameter pointing to a function that is able to validate and sanitize the data as it comes in.

For example:

    register_meta_helper(
        'post',
        [
            'my-post-type',
        ],
        'wp_starter_plugin_csv_data',
        [
            'sanitize_callback' => __NAMESPACE__ . '\sanitize_csv_data',
        ]
    );

You should put the sanitization function in `inc/meta.php`:

    /**
     * A 'sanitize_callback' for the csv_data meta field.
     *
     * @param mixed $meta_value Meta value to sanitize.
     * @return string Sanitized meta value.
     */
    function sanitize_csv_data( $meta_value ) : string {

        // The meta value should be a stringified JSON array. Ensure that it is.
        $raw_meta_value = json_decode( $meta_value, true );
        if ( ! is_array( $raw_meta_value ) ) {
            return '';
        }

        // Rebuild the data, sanitizing values, and validating keys.
        $sanitized_meta_value = [];
        foreach ( $raw_meta_value as $row ) {
            $sanitized_meta_value[] = [
                'title' => sanitize_text_field( $row['title'] ?? '' ),
                'slug' => sanitize_title( $row['slug'] ?? '' ),
                'description' => sanitize_text_field( $row['description'] ?? '' ),
            ];
        }
        
        return wp_json_encode( $sanitized_meta_value );
    }
