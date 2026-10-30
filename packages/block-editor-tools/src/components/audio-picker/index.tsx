import styled from 'styled-components';

// Components.
import { MediaPicker } from '..';

import type { MediaPickerPreviewProps, MediaPickerProps } from '../media-picker';

type AudioPickerPropKeys =
  | 'className'
  | 'onReset'
  | 'onUpdate'
  | 'onUpdateURL'
  | 'value'
  | 'valueURL';

export type AudioPickerProps = Pick<MediaPickerProps, AudioPickerPropKeys>;

// Styled components.
const PreviewContainer = styled.div`
  height: auto;
  width: 100%;
`;

// Create a component to represent the audio preview.
const Preview = ({ src }: MediaPickerPreviewProps) => (
  <PreviewContainer>
    <audio // eslint-disable-line jsx-a11y/media-has-caption
      className="edit-audio-preview"
      controls
      src={src}
    />
  </PreviewContainer>
);

/**
 * Allows a user to select or remove audio using the media modal or via direct
 * URL entry. This component is a thin wrapper around `MediaPicker` and sets the
 * allowed types for the `MediaPicker` to `audio` as well as provides a custom
 * preview component that embeds the selected audio in the editor.
 */
const AudioPicker = ({
  className = '',
  onReset,
  onUpdate,
  onUpdateURL = null,
  value,
  valueURL = '',
}: AudioPickerProps) => (
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

export default AudioPicker;
