import { __ } from '@wordpress/i18n';
import styled from 'styled-components';

// Components.
import { MediaPicker } from '..';

import type { MediaPickerPreviewProps, MediaPickerProps } from '../media-picker';

type ImagePickerPropKeys =
  | 'className'
  | 'displayControlsInToolbar'
  | 'imageSize'
  | 'onReset'
  | 'onUpdate'
  | 'onUpdateURL'
  | 'value'
  | 'valueURL';

export type ImagePickerProps = Pick<MediaPickerProps, ImagePickerPropKeys>;

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
const Preview = ({ src }: MediaPickerPreviewProps) => (
  <PreviewContainer>
    <img
      alt={__('Edit image', 'alley-scripts')}
      className="edit-image-preview"
      src={src}
      title={__('Edit image', 'alley-scripts')}
    />
  </PreviewContainer>
);

/**
 * Allows a user to select or remove an image using the media modal or via
 * direct URL entry. This component is a thin wrapper around `MediaPicker` and
 * sets the allowed types for the `MediaPicker` to `image` as well as provides a
 * custom preview component that embeds the selected image in the editor.
 */
const ImagePicker = ({
  className = '',
  imageSize = 'thumbnail',
  displayControlsInToolbar = false,
  onReset,
  onUpdate,
  onUpdateURL = null,
  value,
  valueURL = '',
}: ImagePickerProps) => (
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

export default ImagePicker;
