import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  BlockControls,
  BlockIcon,
  MediaPlaceholder,
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
import getMediaURL from '@alleyco/block-editor-tools';

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
  allowedTypes,
  className,
  icon,
  imageSize,
  displayControlsInToolbar,
  onReset,
  onUpdate,
  onUpdateURL,
  preview: Preview,
  value,
  valueURL,
}) => {
  // Get the media object, if given the media ID.
  const {
    media = null,
  } = useSelect((select) => ({
    media: value ? select('core').getMedia(value) : null,
  }), [value]);

  // getEntityRecord returns `null` if the load is in progress.
  if (value !== 0 && media === null) {
    return (
      <Spinner />
    );
  }

  // If we have a valid source URL of any type, display it.
  const src = media ? getMediaURL(media, imageSize) : valueURL;

  const controls = () => {
    if (!displayControlsInToolbar) {
      return (
        <Button
          isLarge
          isPrimary
          onClick={onReset}
        >
          {__('Replace', 'alley-scripts')}
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
    <>
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
    </>
  );
};

MediaPicker.defaultProps = {
  allowedTypes: [],
  className: '',
  icon: 'format-aside',
  imageSize: 'thumbnail',
  displayControlsInToolbar: false,
  onUpdateURL: null,
  preview: null,
  valueURL: '',
};

MediaPicker.propTypes = {
  allowedTypes: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  icon: PropTypes.string,
  imageSize: PropTypes.string,
  displayControlsInToolbar: PropTypes.bool,
  onReset: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onUpdateURL: PropTypes.func,
  preview: PropTypes.element,
  value: PropTypes.number.isRequired,
  valueURL: PropTypes.string,
};

export default MediaPicker;
