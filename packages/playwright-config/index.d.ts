import type { Page, PlaywrightTestConfig } from '@playwright/test';

export { expect, test } from '@playwright/test';

export interface Viewport {
  width: number;
  height: number;
}

export interface UrlEntry {
  path: string;
  name?: string;
  fullPage?: boolean;
  /** Selectors to mask in the screenshot. */
  mask?: string[];
  /** Extra waiting before the screenshot is taken. */
  waitFor?: (page: Page) => Promise<void>;
}

export interface CreateConfigOptions extends PlaywrightTestConfig {
  baseURL?: string;
  urls?: Array<string | UrlEntry>;
  viewports?: Record<string, Viewport>;
  wordpress?: boolean;
  maxDiffPixelRatio?: number;
  stylePath?: string[];
}

export const defaultViewports: Record<string, Viewport>;
export function createConfig(options?: CreateConfigOptions): PlaywrightTestConfig;
export function waitForPageReady(
  page: Page,
  options?: { timeout?: number; scroll?: boolean },
): Promise<void>;
export function screenshotUrls(
  urls: Array<string | UrlEntry>,
  defaults?: { fullPage?: boolean },
): void;
export function slugify(value: string): string;
