import React from 'react';
import classnames from 'classnames';
import { Decorator } from '@storybook/react';

import '@wordpress/components/build-style/style.css';
import '@wordpress/block-editor/build-style/style.css';
import '@wordpress/block-library/build-style/style.css';
import '../styles/global.css';

/**
 * Global Styles Decorator
 */
export const WithStyles: Decorator = (Story: any, context: any) => {
  const externalStyles = [
    // WordPress global admin styles.
    'https://wordpress.org/gutenberg/wp-includes/css/dashicons.min.css',
    'https://wordpress.org/gutenberg/wp-admin/css/common.min.css',
    'https://wordpress.org/gutenberg/wp-admin/css/forms.min.css',
  ];

  // In wp-admin, these classes are added to the body element,
  // which is used as a class scope for some relevant styles in the external
  // stylesheets listed above. We simulate that here by adding the classes to a wrapper element.
  const classes = ['wp-admin', 'wp-core-ui'];

  return (
    <div className={classnames(classes)}>
      {externalStyles.map((stylesheet) => (
        <link key={stylesheet} rel="stylesheet" href={stylesheet} />
      ))}

      <Story {...context} />
    </div>
  );
};
