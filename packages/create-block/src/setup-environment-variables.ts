/* eslint-disable no-console */
import prompts from 'prompts';

type LanguageType = 'typescript' | 'javascript';

type PromptInput = {
  blockLanguage: any;
  hasViewScript: any;
  shouldRegisterBlock: any;
};

/**
 * Validate the block language.
 *
 * @param value - The block language.
 * @return      - The block language if it is valid.
 *
 * @throws {Error} If the block language is not one of the accepted values.
 */
function validateBlockLanguage(value: string): LanguageType {
  if (value !== 'typescript' && value !== 'javascript') {
    throw new Error('The block language must be one of \'typescript\' or \'javascript\'\n');
  }
  return value;
}

/**
 * Process and validate prompt inputs.
 *
 * Ensures that all necessary environment variables are set based on user input
 * or defaults.
 */
export default async function setupEnvironmentVariables(input: PromptInput): Promise<void> {
  const questions: prompts.PromptObject<any>[] = [];

  // Process the arguments passed to the script and prompt for any missing values.
  if (!input.blockLanguage) {
    questions.push({
      type: 'select',
      name: 'blockLanguage',
      message: 'Create a block in TypeScript or JavaScript?',
      choices: [
        { title: 'TypeScript', value: 'typescript' },
        { title: 'JavaScript', value: 'javascript' },
      ],
      initial: 0,
    });
  } else {
    validateBlockLanguage(input.blockLanguage);

    process.env.blockLanguage = input.blockLanguage;
  }

  if (typeof input.hasViewScript === 'undefined') {
    questions.push({
      type: 'confirm',
      name: 'hasViewScript',
      message: 'Will this block have a front end view script?',
      initial: false,
    });
  } else {
    process.env.hasViewScript = String(input.hasViewScript);
  }

  if (typeof input.shouldRegisterBlock === 'undefined') {
    questions.push({
      type: 'confirm',
      name: 'shouldRegisterBlock',
      message: 'Does this block need to register itself with a call to register_block_type()?\n\nIf you are using a recent version of create-wordpress-plugin that includes wp_register_block_metadata_collection(), you can skip the block registration file.',
      initial: false,
    });
  } else {
    process.env.shouldRegisterBlock = String(input.shouldRegisterBlock);
  }

  if (questions.length) {
    const answers = await prompts(questions, {
      onCancel: () => {
        console.log('\nPrompt cancelled. Exiting...\n');
        process.exit(1);
      },
    });

    // Ensure all prompts were answered.
    if (Object.keys(answers).length !== questions.length) {
      console.error('\nError: Prompt cancelled. Exiting...\n');
      process.exit(1);
    }

    // Store the answers in environment variables for use in the select-templates.ts file.
    Object.entries(answers).forEach(([key, value]) => {
      if (['blockLanguage', 'hasViewScript', 'shouldRegisterBlock'].includes(key)) {
        process.env[key] = String(value);
      }
    });
  }
}
