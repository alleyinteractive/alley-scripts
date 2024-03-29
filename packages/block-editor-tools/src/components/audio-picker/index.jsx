import PropTypes from 'prop-types';
import styled from 'styled-components';

// Components.
import { MediaPicker } from '..';

// Styled components.
const PreviewContainer = styled.div`
  height: auto;
  width: 100%;
`;

// Create a component to represent the audio preview.
const Preview = ({ src }) => (
  <PreviewContainer>
    <audio // eslint-disable-line jsx-a11y/media-has-caption
      className="edit-audio-preview"
      controls
      src={src}
    />
  </PreviewContainer>
);

Preview.propTypes = {
  src: PropTypes.string.isRequired,
};

/**
 * Allows a user to select or remove audio using the media modal or via direct
 * URL entry. This component is a thin wrapper around `MediaPicker` and sets the
 * allowed types for the `MediaPicker` to `audio` as well as provides a custom
 * preview component that embeds the selected audio in the editor.
 */
const AudioPicker = ({
  className,
  onReset,
  onUpdate,
  onUpdateURL,
  value,
  valueURL,
}) => (
  <MediaPicker
    allowedTypes={['audio']}
    className={className}
    icon="format-audio"
    onReset={onReset}
    onUpdate={onUpdate}
    onUpdateURL={onUpdateURL}
    preview={Preview}
    value={value}
    valueURL={valueURL}
  />
);

AudioPicker.defaultProps = {
  className: '',
  onUpdateURL: null,
  valueURL: '',
};

AudioPicker.propTypes = {
  /**
   * Class name for the media picker container.
   */
  className: PropTypes.string,
  /**
   * Function to reset the audio ID to 0 and/or the audio URL to an empty string.
   */
  onReset: PropTypes.func.isRequired,
  /**
   * Function to set the audio ID on audio selection/upload.
   */
  onUpdate: PropTypes.func.isRequired,
  /**
   * Function to set the audio URL on entry. If not set, the button to enter a
   * URL manually will not display.
   */
  onUpdateURL: PropTypes.func,
  /**
   * The ID of the selected audio. 0 represents no selection.
   */
  value: PropTypes.number.isRequired,
  /**
   * The URL of the audio. An empty string represents no selection.
   */
  valueURL: PropTypes.string,
};

export default AudioPicker;
