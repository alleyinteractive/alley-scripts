# Storybook

Every package in this monorepo is documented in [Storybook](https://storybook.js.org/), published at [alley-scripts.alley.dev](https://alley-scripts.alley.dev/). Block Editor Tools components, hooks, and services each get an interactive demo, and every other package gets a page rendered from its README.

## Running Storybook

```sh
npm run storybook        # Dev server at http://localhost:6006
npm run build-storybook  # Static build in storybook-static/
```

The [deploy workflow](../.github/workflows/deploy.yaml) builds Storybook on every pull request and publishes it to GitHub Pages on every push to `main`. A pull request that breaks the Storybook build fails that check.

## READMEs are the source of truth

Storybook renders documentation from the README files that sit next to the code, so the same text shows up on GitHub, on npm, and in Storybook. Don't copy documentation into a story. Edit the README, and Storybook picks up the change.

| What | Documentation | Story |
| --- | --- | --- |
| Component | `packages/block-editor-tools/src/components/<name>/README.md` | `packages/block-editor-tools/src/components/<name>/index.stories.tsx` |
| Hook | `packages/block-editor-tools/src/hooks/<name>/README.md` | An export in `packages/block-editor-tools/src/hooks/index.stories.tsx` |
| Service | The `### <name>` section of `packages/block-editor-tools/README.md` | An export in `packages/block-editor-tools/src/services/index.stories.tsx` |
| Package | `packages/<name>/README.md` | `stories/packages/<name>.mdx` |

## Adding a component

Create `index.stories.tsx` next to the component and load its README as the docs description:

```tsx
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { resolveReadmeLinks } from '../../../../.storybook/components/readme';
import readme from './README.md?raw';

import MyComponent from './index';

const meta: Meta<typeof MyComponent> = {
  title: 'Block Editor Tools/Components/My Component',
  component: MyComponent,
  parameters: {
    docs: {
      description: {
        component: resolveReadmeLinks(readme, 'packages/block-editor-tools/src/components/my-component'),
      },
    },
  },
};

export default meta;

export const Default: StoryObj<typeof MyComponent> = {
  render: function Render(args) {
    const [value, setValue] = useState('');

    return <MyComponent {...args} onChange={setValue} value={value} />;
  },
};
```

`resolveReadmeLinks` points the README's relative links at GitHub, since they don't resolve inside Storybook. Give controlled components a stateful `render` like the one above so the demo responds to input.

## Adding a hook or service

Hooks and services share one stories file each. Add a named export for the new hook to `src/hooks/index.stories.tsx`, or for the new service to `src/services/index.stories.tsx`. The hook's README is found automatically from its directory name. Use the existing `blockHookStory` and `idHookStory` helpers when the hook takes a block client ID or an object ID.

The hooks stories run against a seeded block editor (a group holding a heading, paragraph, and image, followed by a standalone paragraph) and a post editor editing post `100`.

## Adding a package

Add `stories/packages/<name>.mdx` that renders the package README:

```mdx
import { Meta } from '@storybook/blocks';
import { Readme } from '../../.storybook/components/readme';
import readme from '../../packages/<name>/README.md?raw';

<Meta title="Packages/<Title>" />

<Readme source={readme} directory="packages/<name>" />
```

Then link the new page from `stories/Introduction.stories.mdx`.

## The mock REST API

Storybook has no WordPress backend. [`.storybook/mocks/api.ts`](../.storybook/mocks/api.ts) replaces `apiFetch` with an in-memory REST API, so `@wordpress/core-data` selectors and direct `apiFetch` calls both work. It provides:

- Media: images `1`–`3`, audio `10`, video `20`
- Posts: `100`–`114`, where every fourth item is a page
- Terms: `200`–`211`, where even IDs are categories and odd IDs are tags
- Search, post types, taxonomies, site settings, and the active theme

If a new component or hook calls an endpoint the mock doesn't cover, its request returns a 404 and the story shows the component's error or empty state. Add the route to `route()` in `api.ts`. Writes (`POST`, `PUT`, `PATCH`) to posts and settings are kept in memory until the page reloads. Uploading media needs a real WordPress install, so upload buttons don't do anything in Storybook.
