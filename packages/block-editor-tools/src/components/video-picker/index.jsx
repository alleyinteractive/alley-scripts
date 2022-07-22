import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

// Components.
import { MediaPicker } from '@/components';

// Styled components.
const PreviewContainer = styled.div`
  height: auto;
  width: 100%;
`;

// Create a component to represent the video preview.
const Preview = ({ src }) => (
  <PreviewContainer>
    <video // eslint-disable-line jsx-a11y/media-has-caption
      className="edit-video-preview"
      controls
      src={src}
    />
  </PreviewContainer>
);

Preview.propTypes = {
  src: PropTypes.string.isRequired,
};

const VideoPicker = ({
  className,
  onReset,
  onUpdate,
  onUpdateURL,
  value,
  valueURL,
}) => (
  <MediaPicker
    allowedTypes={['video']}
    className={className}
    icon="format-video"
    onReset={onReset}
    onUpdate={onUpdate}
    onUpdateURL={onUpdateURL}
    preview={Preview}
    value={value}
    valueURL={valueURL}
  />
);

VideoPicker.defaultProps = {
  className: '',
  onUpdateURL: null,
  valueURL: '',
};

VideoPicker.propTypes = {
  className: PropTypes.string,
  onReset: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onUpdateURL: PropTypes.func,
  value: PropTypes.number.isRequired,
  valueURL: PropTypes.string,
};

export default VideoPicker;
