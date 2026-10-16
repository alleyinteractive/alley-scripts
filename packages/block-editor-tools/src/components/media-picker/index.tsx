import type { ComponentType, ReactNode } from 'react';
import styled from 'styled-components';

import * as blockEditor from '@wordpress/block-editor';
import {
  Button,
  Spinner,
  ToolbarButton,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Attachment as Attachment } from 'wp-types';

// Services.
import { getMediaUrl } from '../../services';

type BlockEditorMedia = { id: number, url: string, [key: string]: any };

/*
 * The block editor components used here, typed locally. The cast also keeps
 * this file compiling for code that type-checks it against the older
 * DefinitelyTyped version of `@wordpress/block-editor`.
 */
const {
  BlockControls,
  BlockIcon,
  MediaPlaceholder,
  MediaReplaceFlow,
} = blockEditor as unknown as {
  BlockControls: ComponentType<{
    children?: ReactNode,
    group?: 'default' | 'block' | 'inline' | 'other' | 'parent',
  }>,
  BlockIcon: ComponentType<{ icon: string | ReactNode }>,
  MediaPlaceholder: ComponentType<{
    allowedTypes?: string[],
    disableMediaButtons?: boolean,
    icon?: ReactNode,
    onSelect: (media: BlockEditorMedia) => void,
    onSelectURL?: ((url: string) => void) | null,
    value?: { id?: number, src?: string },
  }>,
  MediaReplaceFlow: ComponentType<{
    allowedTypes?: string[],
    children?: ReactNode,
    mediaId?: number,
    mediaURL?: string,
    name?: string,
    onSelect: (media: BlockEditorMedia) => void,
    onSelectURL?: ((url: string) => void) | null,
  }>,
};

// Styled components.
const Container = styled.div`
  display: block;
  position: relative;
`;

const DefaultPreview = styled.div`
  background: white;
  border: 1px solid black;
  padding: 1em;
`;

export type SelectedMedia = {
  id: number,
  url: string,
  [key: string]: any,
};

export interface MediaPickerProps {
  /**
   * Media types the picker accepts, such as `image` or `application/pdf`.
   */
  allowedTypes?: string[];
  /**
   * Class name for the media picker container.
   */
  className?: string;
  /**
   * Dashicon name for the placeholder icon.
   */
  icon?: string;
  /**
   * The size to display in the preview. Defaults to `thumbnail`.
   */
  imageSize?: string;
  /**
   * Determines if controls should render in the block toolbar.
   */
  displayControlsInToolbar?: boolean;
  /**
   * Function to reset the media ID to 0 and/or the media URL to an empty string.
   */
  onReset: () => void;
  /**
   * Function to set the media ID on media selection/upload.
   */
  onUpdate: (media: SelectedMedia) => void;
  /**
   * Function to set the media URL on entry. If not set, the button to enter a
   * URL manually will not display.
   */
  onUpdateURL?: ((url: string) => void) | null;
  /**
   * Component that renders a preview of the selected media.
   */
  preview?: ComponentType<{ src: string }> | null;
  /**
   * The ID of the selected media. 0 represents no selection.
   */
  value: number;
  /**
   * The URL of the media. An empty string represents no selection.
   */
  valueURL?: string;
}

const MediaPicker = ({
  allowedTypes = [],
  className = '',
  icon = 'format-aside',
  imageSize = 'thumbnail',
  displayControlsInToolbar = false,
  onReset,
  onUpdate,
  onUpdateURL = null,
  preview: Preview = null,
  value,
  valueURL = '',
}: MediaPickerProps) => {
  // Get the media object, if given the media ID.
  const {
    media = undefined,
  } = useSelect((select) => ({
    media: value ? (select('core') as {
      getMedia: (id: number) => Attachment | null | undefined,
    }).getMedia(value) : undefined,
  }), [value]);

  // getEntityRecord returns `null` if the load is in progress.
  if (value !== 0 && media === null) {
    return (
      <Spinner />
    );
  }

  // If we have a valid source URL of any type, display it.
  const src = media ? getMediaUrl(media, imageSize) : valueURL;

  const controls = () => {
    if (!displayControlsInToolbar) {
      return (
        <Button
          variant="primary"
          onClick={onReset}
        >
          {__('Reset', 'alley-scripts')}
        </Button>
      );
    }

    return (
      <BlockControls group="other">
        <MediaReplaceFlow
          name={__('Edit Media', 'alley-scripts')}
          mediaId={value}
          mediaURL={src}
          allowedTypes={allowedTypes}
          onSelect={onUpdate}
          onSelectURL={onUpdateURL}
        >
          <ToolbarButton
            isDestructive
            text={__('Remove', 'alley-scripts')}
            onClick={onReset}
          />
        </MediaReplaceFlow>
      </BlockControls>
    );
  };

  if (src) {
    return (
      <Container className={className}>
        {Preview ? (
          <Preview src={src} />
        ) : (
          <DefaultPreview className="alley-scripts-media-picker__preview">
            <p>{__('Selected file:', 'alley-scripts')}</p>
            <p><a href={src}>{src}</a></p>
          </DefaultPreview>
        )}
        {controls()}
      </Container>
    );
  }

  return (
    <Container className={className}>
      <MediaPlaceholder
        allowedTypes={allowedTypes}
        disableMediaButtons={!!valueURL}
        icon={<BlockIcon icon={icon} />}
        onSelect={onUpdate}
        onSelectURL={onUpdateURL}
        value={{ id: value, src }}
      />
    </Container>
  );
};

export default MediaPicker;
