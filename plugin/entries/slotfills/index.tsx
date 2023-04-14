/**
 * Entry for Gutenberg Slotfills
 *
 * Register slotfills for testing the `@alleyinteractive/block-editor-tools` package.
 */

import { useState } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar } from '@wordpress/edit-post';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
  AudioPicker,
  Checkboxes,
  CSVUploader,
  ImagePicker,
  MediaPicker,
  PostPicker,
  PostSelector,
  TermSelector,
  usePostMeta,
} from '@alleyinteractive/block-editor-tools';

// Create a new Gutenberg sidebar
registerPlugin('alley-scripts-plugin-sidebar', {
  icon: 'shield',
  render: () => {
    const [meta, setMeta] = usePostMeta(); // eslint-disable-line react-hooks/rules-of-hooks
    const [
      selectedCheckboxes, setSelectedCheckboxes,
    ] = useState<string[]>([]); // eslint-disable-line react-hooks/rules-of-hooks

    const {
      alley_scripts_audio_picker_id: audioPickerId = '',
      alley_scripts_image_picker_id: imageId = '',
      alley_scripts_media_picker_id: mediaId = 0,
      alley_scripts_post_picker_id: postId = 0,
    } = meta;

    return (
      <>
        <PluginSidebar
          icon="admin-media"
          name="alley-scripts-pickers"
          title={__('Alley Scripts: Pickers', 'alley-scripts')}
        >
          <PanelBody
            initialOpen
            title={__('Audio Picker', 'alley-scripts')}
          >
            <AudioPicker
              className="audio-picker"
              onReset={() => setMeta({ alley_scripts_audio_picker_id: '' })}
              onUpdate={({ id }: { id: number }) => setMeta({ alley_scripts_audio_picker_id: id })}
              value={audioPickerId || null}
            />
          </PanelBody>
          <PanelBody
            initialOpen
            title={__('Image Picker', 'alley-scripts')}
          >
            <ImagePicker
              className="image-picker"
              imageSize="thumbnail"
              onReset={() => setMeta({ alley_scripts_image_picker_id: '' })}
              onUpdate={({ id }: { id: number }) => setMeta({ alley_scripts_image_picker_id: id })}
              value={imageId}
            />
          </PanelBody>
          <PanelBody
            initialOpen
            title={__('Media Picker', 'alley-scripts')}
          >
            <p>{__('Configured to only allow PDF files.', 'alley-scripts')}</p>
            <MediaPicker
              allowedTypes={['application/pdf']}
              onReset={() => setMeta({ alley_scripts_media_picker_id: 0 })}
              onUpdate={({ id }: { id: number }) => setMeta({ alley_scripts_media_picker_id: id })}
              value={mediaId}
            />
          </PanelBody>
          <PanelBody initialOpen title={__('Post Selector', 'alley-scripts')}>
            {/*
              // @ts-ignore Handle error with PostSelector not working in Typescript */}
            <PostSelector
              multiple={false}
              onSelect={(value: any) => console.log('PostSelector onSelect', value)} // eslint-disable-line no-console
            />
          </PanelBody>
          <PanelBody initialOpen title={__('Post Picker', 'alley-scripts')}>
            <PostPicker
              onUpdate={(value: any) => console.log('PostSelector onSelect', value)} // eslint-disable-line no-console
              onUpdate={(id: number) => setMeta({ alley_scripts_post_picker_id: id })}
              value={postId}
            />
          </PanelBody>
          <PanelBody initialOpen title={__('Term Selector', 'alley-scripts')}>
            {/*
              // @ts-ignore Handle error with TermSelector not working in Typescript */}
            <TermSelector
              multiple={false}
              onSelect={(value: any) => console.log('TermSelector onSelect', value)} // eslint-disable-line no-console
            />
          </PanelBody>
        </PluginSidebar>
        <PluginSidebar
          icon="admin-page"
          name="alley-scripts-fields"
          title={__('Alley Scripts: Fields', 'alley-scripts')}
        >
          <PanelBody initialOpen title={__('Checkboxes', 'alley-scripts')}>
            <Checkboxes
              label={__('Setting Label', 'alley-scripts')}
              value={selectedCheckboxes}
              onChange={(newValue: string[]) => setSelectedCheckboxes(newValue)}
              options={[
                { value: 'option-1', label: __('Option 1', 'alley-scripts') },
                { value: 'option-2', label: __('Option 2', 'alley-scripts') },
                { value: 'option-3', label: __('Option 3', 'alley-scripts') },
              ]}
            />
          </PanelBody>
          <PanelBody initialOpen title={__('CSV Uploader', 'alley-scripts')}>
            {/*
              // @ts-ignore Allow for use of PureComponent classes in Typescript */}
            <CSVUploader
              attributeName="alley_scripts_csv_uploader"
              callback={(data: any) => console.log('CSVUploader callback', data)} // eslint-disable-line no-console
              setAttributes={(data: any) => console.log('CSVUploader setAttributes', data)} // eslint-disable-line no-console
            />
          </PanelBody>
        </PluginSidebar>
      </>
    );
  },
});
