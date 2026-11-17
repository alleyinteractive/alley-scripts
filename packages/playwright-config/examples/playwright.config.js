import { createConfig } from '@alleyinteractive/playwright-config';

export default createConfig({
  // Overridden by PW_BASE_URL (local site, preprod, etc.).
  baseURL: 'https://preprod.example.com',
  // Set to true for WordPress sites to also hide the admin bar and similar chrome.
  wordpress: true,
  // Pages to screenshot. Add paths, or { path, name, mask, fullPage, waitFor }:
  //   '/about/',
  //   { path: '/news/', name: 'news', mask: ['.latest-posts'] },
  urls: ['/'],
});
