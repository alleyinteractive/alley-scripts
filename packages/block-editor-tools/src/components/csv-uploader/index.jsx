import React from 'react';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

import { parseCSVFile } from '../../services';

/**
 * Allows a user to upload a CSV file, which is parsed in the browser, converted
 * to a JSON structure, passed through a user specified callback function for
 * further transformation, and saved to block attributes. This component is
 * intended to be used to save the resulting JSON data to postmeta, but that is
 * controlled in the parent block scope.
 *
 * ## Callback Function
 *
 * The callback function is optional, and allows for further processing of the
 * data returned by the parser.
 *
 * The callback function accepts an array of objects as its only parameter. Each
 * object will be a description of one row in the CSV, with keys matching the
 * headers in the file.
 *
 * Given a CSV file in the following format:
 *
 *     title,slug,description
 *     Sample Title,sample-title,Lorem ipsum dolor sit amet.
 *
 * The array of objects passed to the callback function will take the following
 * form:
 *
 *     [
 *       {
 *         title: 'Sample Title',
 *         slug: 'sample-title',
 *         description: 'Lorem ipsum dolor sit amet.',
 *       },
 *     ]
 *
 * Under the hood, the CSV parser uses PapaParse and attempts to make
 * intelligent choices about data formats based on data in each column. Columns
 * of integers should come through as integers, for example.
 *
 * It is recommended to put the callback function in the `services/data`
 * directory with a corresponding test.
 *
 * ## Sanitization
 *
 * When registering the meta field using `register_meta_helper`, you will need
 * to provide a `sanitize_callback` in the fourth parameter pointing to a
 * function that is able to validate and sanitize the data as it comes in.
 *
 * For example:
 *
 * ```php
 * register_meta_helper(
 *     'post',
 *     [
 *         'my-post-type',
 *     ],
 *     'wp_starter_plugin_csv_data',
 *     [
 *         'sanitize_callback' => __NAMESPACE__ . '\sanitize_csv_data',
 *     ]
 * );
 * ```
 *
 * You should put the sanitization function in `inc/meta.php`:
 *
 * ```php
 *  /**
 *   * A 'sanitize_callback' for the csv_data meta field.
 *   *
 *   * @param mixed $meta_value Meta value to sanitize.
 *   * @return string Sanitized meta value.
 *   *\/
 *  function sanitize_csv_data( $meta_value ) : string {
 *
 *      // The meta value should be a stringified JSON array. Ensure that it is.
 *      $raw_meta_value = json_decode( $meta_value, true );
 *      if ( ! is_array( $raw_meta_value ) ) {
 *          return '';
 *      }
 *
 *      // Rebuild the data, sanitizing values, and validating keys.
 *      $sanitized_meta_value = [];
 *      foreach ( $raw_meta_value as $row ) {
 *          $sanitized_meta_value[] = [
 *              'title' => sanitize_text_field( $row['title'] ?? '' ),
 *              'slug' => sanitize_title( $row['slug'] ?? '' ),
 *              'description' => sanitize_text_field( $row['description'] ?? '' ),
 *          ];
 *      }
 *
 *      return wp_json_encode( $sanitized_meta_value );
 *  }
 * ```
 */
export default class CSVUploader extends React.PureComponent {
  /**
   * A callback for the upload form submit action.
   * @param {Event} e - The form submit event.
   */
  static handleSubmit(e) {
    e.preventDefault();
  }

  /**
   * Re-binds class methods to use `this` properly.
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    // Set initial state for this component.
    this.state = {
      error: '',
      success: '',
    };
  }

  /**
   * A callback for the change event on the file input.
   * @param {Event} e - The input change event.
   */
  handleChange(e) {
    const {
      attributeName,
      callback,
      setAttributes,
    } = this.props;

    // Ensure there is a file selected.
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    // Parse the file and send the contents to the callback for transformation.
    parseCSVFile(e.target.files[0])
      .then((data) => (callback ? callback(data) : data))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.setState({
            error: '',
            success: __(
              'Successfully read CSV data.',
              'alley-scripts',
            ),
          });
          setAttributes({
            [attributeName]: JSON.stringify(data),
          });
        } else {
          this.setState({
            error: __(
              'Could not map CSV data. Please check the source file to ensure that it has the correct structure.', // eslint-disable-line max-len
              'alley-scripts',
            ),
            success: '',
          });
        }
      })
      .catch((error) => {
        this.setState({
          error,
          success: '',
        });
      });
  }

  /**
   * Renders this component.
   * @returns {object} - JSX for the component.
   */
  render() {
    const {
      error = '',
      success = '',
    } = this.state;
    return (
      <div className="alley-scripts-block-csv-uploader">
        <h2>{__('Upload CSV', 'alley-scripts')}</h2>
        <form onSubmit={this.handleSubmit}>
          {error !== '' ? (
            <div style={{ color: '#c00' }}>
              <strong>
                {__(
                  'Error:',
                  'alley-scripts',
                )}
              </strong>
              &nbsp;
              {error}
            </div>
          ) : null}
          {success !== '' ? (
            <div style={{ color: '#0c0' }}>
              <strong>
                {__(
                  'Success:',
                  'alley-scripts',
                )}
              </strong>
              &nbsp;
              {success}
            </div>
          ) : null}
          <div>
            <label
              htmlFor="alley-scripts-block-csv-uploader-file"
            >
              <p>
                {__(
                  'Select a file to load data.',
                  'alley-scripts',
                )}
              </p>
              <input
                id="alley-scripts-block-csv-uploader-file"
                onChange={this.handleChange}
                type="file"
              />
            </label>
          </div>
        </form>
      </div>
    );
  }
}

/**
 * Default props.
 * @type {object}
 */
CSVUploader.defaultProps = {
  callback: null,
};

/**
 * Set PropTypes for this component.
 * @type {object}
 */
CSVUploader.propTypes = {
  /**
   * The name of the attribute to set.
   */
  attributeName: PropTypes.string.isRequired,
  /**
   * A callback to transform the data before setting the attribute.
   */
  callback: PropTypes.func,
  /**
   * A callback to set the attributes.
   */
  setAttributes: PropTypes.func.isRequired,
};
