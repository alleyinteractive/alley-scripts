import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SelectControl, TextareaControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { media } from '../../../../.storybook/mocks/api';
import readme from '../../README.md?raw';

import { getMediaUrl, parseCSVFile } from './index';

// The services are documented in the package README rather than per-service READMEs.
const section = (heading: string) => {
  const start = readme.indexOf(`### ${heading}`);
  const end = readme.slice(start + 1).search(/\n(### |---)/);

  return readme.slice(start, end === -1 ? undefined : start + 1 + end).replace(/^### .*\n/, '');
};

const describe = (heading: string) => ({
  docs: {
    description: {
      story: section(heading),
    },
  },
});

const Output = ({ call, value }: { call: string; value: unknown }) => (
  <>
    <p><code>{call}</code></p>
    <pre
      style={{
        background: '#f0f0f0',
        maxHeight: 400,
        overflow: 'auto',
        padding: '1em',
      }}
    >
      {value === undefined ? 'undefined' : JSON.stringify(value, null, 2)}
    </pre>
  </>
);

const meta: Meta = {
  title: 'Block Editor Tools/Services',
};

export default meta;

export const ParseCSVFile: StoryObj = {
  name: 'parseCSVFile',
  parameters: describe('parseCSVFile'),
  render: function Render() {
    const [csv, setCsv] = useState('name,role,years\nAda,Engineer,4\nGrace,Designer,7\n\nLinus,Editor,2');
    const [rows, setRows] = useState<unknown>();

    useEffect(() => {
      parseCSVFile(new File([csv], 'data.csv', { type: 'text/csv' }))
        .then(setRows)
        .catch((error: Error) => setRows({ error: error.message }));
    }, [csv]);

    return (
      <>
        <TextareaControl
          help="Edited text is wrapped in a File and parsed. The first row is used as column names."
          label="CSV"
          onChange={setCsv}
          rows={6}
          value={csv}
        />
        <Output call="await parseCSVFile(file)" value={rows} />
      </>
    );
  },
};

export const GetMediaUrl: StoryObj = {
  name: 'getMediaUrl',
  parameters: describe('getMediaUrl'),
  render: function Render() {
    const [id, setId] = useState(1);
    const [size, setSize] = useState('thumbnail');
    const item = useSelect((select) => select('core').getMedia(id), [id]);
    const url = item ? getMediaUrl(item, size) : undefined;

    return (
      <>
        <SelectControl
          label="Media"
          onChange={(next) => setId(Number(next))}
          options={media.map(({ id: value, mime_type: mimeType }) => ({
            label: `${value} (${mimeType})`,
            value: String(value),
          }))}
          value={String(id)}
        />
        <SelectControl
          help="Sizes the media item doesn't have fall back to the full size."
          label="Size"
          onChange={setSize}
          options={['thumbnail', 'medium', 'full'].map((value) => ({ label: value, value }))}
          value={size}
        />
        <Output call={`getMediaUrl(media, '${size}')`} value={url} />
        {url && item?.media_type === 'image' ? <img alt="" src={url} /> : null}
      </>
    );
  },
};
