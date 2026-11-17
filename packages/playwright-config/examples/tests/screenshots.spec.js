import { screenshotUrls } from '@alleyinteractive/playwright-config';
import config from '../playwright.config.js';

// One screenshot test per URL, repeated for every configured viewport.
screenshotUrls(config.metadata.urls);
