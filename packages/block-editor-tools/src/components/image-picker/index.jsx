import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Components.
import { MediaPicker } from '@/components';

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
  className: PropTypes.string,
  imageSize: PropTypes.string,
  displayControlsInToolbar: PropTypes.bool,
  onReset: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onUpdateURL: PropTypes.func,
  value: PropTypes.number.isRequired,
  valueURL: PropTypes.string,
};

export default ImagePicker;
