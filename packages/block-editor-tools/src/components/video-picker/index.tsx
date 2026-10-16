import styled from 'styled-components';

// Components.
import { MediaPicker } from '..';

import type { MediaPickerPreviewProps, MediaPickerProps } from '../media-picker';

type VideoPickerPropKeys =
  | 'className'
  | 'onReset'
  | 'onUpdate'
  | 'onUpdateURL'
  | 'value'
  | 'valueURL';

export type VideoPickerProps = Pick<MediaPickerProps, VideoPickerPropKeys>;

// Styled components.
const PreviewContainer = styled.div`
  height: auto;
  width: 100%;
`;

// Create a component to represent the video preview.
const Preview = ({ src }: MediaPickerPreviewProps) => (
  <PreviewContainer>
    <video // eslint-disable-line jsx-a11y/media-has-caption
      className="edit-video-preview"
      controls
      src={src}
    />
  </PreviewContainer>
);

const VideoPicker = ({
  className = '',
  onReset,
  onUpdate,
  onUpdateURL = null,
  value,
  valueURL = '',
}: VideoPickerProps) => (
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

export default VideoPicker;
