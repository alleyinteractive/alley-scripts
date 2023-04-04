import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Components.
import { MediaPicker } from '..';

// Styled components.
const PreviewContainer = styled.div`
  box-sizing: border-box;
  flex-shrink: 0;
  height: auto;
  max-height: 1450px;
  max-width: 1450px;
  min-height: 20px;
  min-width: 20px;
  position: relative;
  width: auto;
`;

// Create a component to represent the image preview.
const Preview = ({ src }) => (
  <PreviewContainer>
    <img
      alt={__('Edit image', 'alley-scripts')}
      className="edit-image-preview"
      src={src}
      title={__('Edit image', 'alley-scripts')}
    />
  </PreviewContainer>
);

Preview.propTypes = {
  src: PropTypes.string.isRequired,
};

/**
 * Allows a user to select or remove an image using the media modal or via
 * direct URL entry. This component is a thin wrapper around `MediaPicker` and
 * sets the allowed types for the `MediaPicker` to `image` as well as provides a
 * custom preview component that embeds the selected image in the editor.
 */
const ImagePicker = ({
  className,
  imageSize,
  displayControlsInToolbar,
  onReset,
  onUpdate,
  onUpdateURL,
  value,
  valueURL,
}) => (
  <MediaPicker
    allowedTypes={['image']}
    className={className}
    icon="format-image"
    imageSize={imageSize}
    displayControlsInToolbar={displayControlsInToolbar}
    onReset={onReset}
    onUpdate={onUpdate}
    onUpdateURL={onUpdateURL}
    preview={Preview}
    value={value}
    valueURL={valueURL}
  />
);

ImagePicker.defaultProps = {
  className: '',
  imageSize: 'thumbnail',
  displayControlsInToolbar: false,
  onUpdateURL: null,
  valueURL: '',
};

ImagePicker.propTypes = {
  /**
   * Class name for the media picker container.
   */
  className: PropTypes.string,
  /**
   * The size to display in the preview. Defaults to `thumbnail`.
   */
  imageSize: PropTypes.string,
  /**
   * Determines if controls should render in the block toolbar.
   */
  displayControlsInToolbar: PropTypes.bool,
  /**
   * Function to reset the image ID to 0 and/or the image URL to an empty string.
   */
  onReset: PropTypes.func.isRequired,
  /**
   * Function to set the image ID on image selection/upload.
   */
  onUpdate: PropTypes.func.isRequired,
  /**
   * Function to set the image URL on entry. If not set, the button to enter a
   * URL manually will not display.
   */
  onUpdateURL: PropTypes.func,
  /**
   * The ID of the selected image. 0 represents no selection.
   */
  value: PropTypes.number.isRequired,
  /**
   * The URL of the image. An empty string represents no selection.
   */
  valueURL: PropTypes.string,
};

export default ImagePicker;
