import type { ComponentType, ReactNode } from 'react';
import styled from 'styled-components';

import {
  BlockControls as UntypedBlockControls,
  BlockIcon as UntypedBlockIcon,
  MediaPlaceholder as UntypedMediaPlaceholder,
  // @ts-expect-error MediaReplaceFlow is missing from @types/wordpress__block-editor.
  MediaReplaceFlow,
} from '@wordpress/block-editor';
import {
  Button,
  Spinner,
  ToolbarButton,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

// Services.
import { getMediaUrl } from '../../services';
import type { MediaObject } from '../../services/media/get-media-url';

/**
 * A media item as passed to onUpdate by the media modal or upload flow.
 */
export interface SelectedMedia {
  id: number;
  url?: string;
  [key: string]: unknown;
}

export interface MediaPickerProps {
  allowedTypes?: string[];
  className?: string;
  icon?: string;
  imageSize?: string;
  displayControlsInToolbar?: boolean;
  onReset: () => void;
  onUpdate: (media: SelectedMedia) => void;
  onUpdateURL?: (url: string) => void;
  preview?: ComponentType<{ src: string }> | null;
  value: number;
  valueURL?: string;
}

/*
 * @types/wordpress__block-editor omits BlockControls' group prop and
 * MediaPlaceholder's disableMediaButtons prop, types MediaPlaceholder's value
 * as an ID although it reads { id, src }, and its nested copy of @types/react
 * makes BlockIcon unusable as a JSX component here.
 */
const BlockControls = UntypedBlockControls as unknown as ComponentType<{
  children: ReactNode,
  group?: string,
}>;
const BlockIcon = UntypedBlockIcon as unknown as ComponentType<{ icon: string }>;
const MediaPlaceholder = UntypedMediaPlaceholder as unknown as ComponentType<{
  allowedTypes: string[],
  disableMediaButtons: boolean,
  icon: ReactNode,
  onSelect: (media: SelectedMedia) => void,
  onSelectURL?: (url: string) => void,
  value: { id: number, src: string },
}>;

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

const MediaPicker = ({
  allowedTypes = [],
  className = '',
  icon = 'format-aside',
  imageSize = 'thumbnail',
  displayControlsInToolbar = false,
  onReset,
  onUpdate,
  onUpdateURL,
  preview: Preview = null,
  value,
  valueURL = '',
}: MediaPickerProps) => {
  // Get the media object, if given the media ID.
  const {
    media = undefined,
  } = useSelect((select) => ({
    media: value ? (select('core') as {
      getMedia: (id: number) => MediaObject | null | undefined,
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
