import React from 'react';
import { Markdown } from '@storybook/blocks';

const REPOSITORY = 'https://github.com/alleyinteractive/alley-scripts/blob/main/';

/**
 * Point relative links in a README at GitHub, since they don't resolve inside Storybook.
 */
export const resolveReadmeLinks = (source: string, directory: string) => source.replace(
  /(\]\()(?!https?:|#|mailto:)([^)\s]+)/g,
  (_match, prefix: string, link: string) => `${prefix}${new URL(link, `${REPOSITORY}${directory}/`).href}`,
);

type ReadmeProps = {
  directory: string;
  source: string;
};

export const Readme = ({ directory, source }: ReadmeProps) => (
  <Markdown>{resolveReadmeLinks(source, directory)}</Markdown>
);
