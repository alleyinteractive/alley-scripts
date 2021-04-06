
const { Command } = require('commander');
const scaffoldBlock = require('./block');

const program = new Command();

/**
 * Block scaffolding sub-command.
 */
program.command('block')
  .arguments('<slug>')
  .description('Create a block.')
  .option( '--category <value>', 'category name for the block', 'layout' )
  .option( '--dynamic <value>', 'is the block dynamic', true )
  .option( '--namespace <value>', 'internal namespace for the block name', 'alley-blocks'  )
  .option( '--short-description <value>', 'short description for the block', '' )
  .option( '--text-domain <value>', 'text domain for the block', 'alley-blocks' )
  .option( '--title <value>', 'display title for the block', 'Block Title' )
  .action( (slug, options) => {
    // Combine args and options into a single object.
    const args = {
      slug,
      description: options.shortDescription,
      isDynamic: options.dynamic,
      ...options
    }

    scaffoldBlock(args);
  })

// Parse all arguments.
program.parse();
