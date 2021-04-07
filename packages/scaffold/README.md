# Block Editor Scaffold

The Block Editor tools scaffold package is a CLI tool for quickly scaffolding out the code required to build block editor tools.

## Quick start

You just need to provide the `slug` which is the target location for scaffolded files and the internal block name.

**Run using npx:**

```bash
$ npx @alleyco/scaffold block my-block
$ cd my-block
```

**Run locally**

```bash
# Link the package locally (only needed once)
$ cd block-editor-tools/packages/scaffold
$ npm link

# cd to the location of your blocks folder and
# scaffold a folder for a custom block.
$ scaffold block my-block --namespace my-project
```

## Commands

### scaffold block

`scaffold block` will scaffold out a block folder in the directory where the command is run.

**Usage:**

`scaffold block {slug} [options]` will create a new folder named using the slug of the block containing all of the files needed for a custom block. The block will need to be imported and registered in a blocks file in your application.

**Options:**

--category <value>           Category name for the block. (default: "layout")
--has-inner-blocks           Does the block use innerBlocks? Overrides is-dynamic. (default: false)
--is-dynamic                 Is the block dynamic? (default: false)
--namespace <value>          Internal namespace for the block name. (default: "alley-blocks")
--short-description <value>  Short description for the block. (default: "")
--text-domain <value>        Text domain for the block. (default: "alley-blocks")
--title <value>              Display title for the block. (default: "Block Title")
