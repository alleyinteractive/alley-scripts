
const { Command } = require('commander');
const scaffoldBlock = require('./block');

const program = new Command();

/**
 * Block scaffolding sub-command.
 */
program.command('block')
  .arguments('<slug>')
  .description('Create a block.')
  .option( '--category <value>', 'Category name for the block.', 'layout' )
  .option( '--has-inner-blocks', 'Does the block use innerBlocks? Overrides is-dynamic.', false )
  .option( '--is-dynamic', 'Is the block dynamic?', false )
  .option( '--namespace <value>', 'Internal namespace for the block name.', 'alley-blocks'  )
  .option( '--short-description <value>', 'Short description for the block.', '' )
  .option( '--text-domain <value>', 'Text domain for the block.', 'alley-blocks' )
  .option( '--title <value>', 'Display title for the block.', 'Block Title' )
  .action( (slug, options) => {
    // Combine args and options into a single object.
    const args = {
      ...options,
      slug,
      description: options.shortDescription,
      // By definition, a block with innerBlocks is not dynamic.
      isDynamic: options.hasInnerBlocks ? false : options.isDynamic,
    }

    scaffoldBlock(args);
  })

// Parse all arguments.
program.parse();
