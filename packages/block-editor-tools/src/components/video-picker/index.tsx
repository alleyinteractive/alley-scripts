import styled from 'styled-components';

// Components.
import MediaPicker, { type MediaPickerProps } from '../media-picker';

// Styled components.
const PreviewContainer = styled.div`
  height: auto;
  width: 100%;
`;

// Create a component to represent the video preview.
const Preview = ({ src }: { src: string }) => (
  <PreviewContainer>
    <video // eslint-disable-line jsx-a11y/media-has-caption
      className="edit-video-preview"
      controls
      src={src}
    />
  </PreviewContainer>
);

type VideoPickerProps = Omit<MediaPickerProps, 'allowedTypes' | 'icon' | 'preview' | 'imageSize' | 'displayControlsInToolbar'>;

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
