/**
 * External dependencies.
 */
const glob = require( 'fast-glob' );
const makeDir = require( 'make-dir' );
const { fromPairs, pickBy } = require( 'lodash' );
const { dirname, join } = require( 'path' );
const { readFile } = require( 'fs' ).promises;
const { render } = require( 'mustache' );
const { writeFile } = require( 'fs' ).promises;

/**
 * Internal dependencies.
 */
const { success } = require( './log' );

const getTemplates = async () => {
  const path = join( __dirname, 'templates', 'block' );
  const outputTemplatesFiles = await glob('**/*.mustache', {
    cwd: path,
    dot: true,
  })
  return fromPairs(
		await Promise.all(
			outputTemplatesFiles.map( async ( outputTemplateFile ) => {
				const outputFile = outputTemplateFile.replace(
					/\.mustache$/,
					''
				);
				const outputTemplate = await readFile(
					join( path, outputTemplateFile ),
					'utf8'
				);
				return [ outputFile, outputTemplate ];
			} )
		)
	);
}

const renderTemplates = async ( args ) => {
  const { slug } = args;
  const templates = await getTemplates();

  await Promise.all(
    Object.keys(templates).map( async outputFile => {
      const outputFilePath = join(
        slug,
        outputFile
      );
      await makeDir( dirname( outputFilePath ) );
      writeFile(
        outputFilePath,
        render( templates[ outputFile ], args )
      );
    })
  );
}

module.exports = args => {
  // Make sure all values are defined.
  const optionsValues = pickBy(
    {
      ...args
    },
    ( value ) => value !== undefined
  );

  const parsedArgs = {
    ...optionsValues
    // ...getFromConfig() @todo
  };

  renderTemplates( parsedArgs );

  const {
    slug,
    namespace
  } = parsedArgs;

  success(
    `Your block, "${namespace}/${slug}" was successfully created.`
  );
};
