# Block Editor Tools

Reusable hooks, components, and services for building products on the WordPress block editor.

## Language

### Hooks

**Entity hook**:
A hook that reads or edits a WordPress record held in the editor's data store, such as a post, term, media item, post meta, or site option.
_Avoid_: Data hook, data-fetching hook

**Block-tree hook**:
A hook that answers a question about a block's position relative to other blocks: its parent, inner blocks, index, or count.
_Avoid_: Block hook, inner-blocks hook

**Editor-context hook**:
A hook that reads a fact about the current editing session, such as the current post ID, active theme, block name, or preview link.
_Avoid_: Context hook, editor hook
