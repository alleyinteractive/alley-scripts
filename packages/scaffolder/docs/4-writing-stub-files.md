# Writing Stub Files

Stub files are the templates that are used to scaffold files. Stub files are
written in [Nunjucks](https://mozilla.github.io/nunjucks/templating.html) and
can contain any valid Nunjucks syntax. You also don't _have_ to use Nunjucks
syntax and can simplify scaffold the file over one to one.

The [expression filters](./3-expressions.md) are also available in stub files.

## Variables

The [feature's input](./2-features.md#input) is available as a variable in the
stub file. For example, if you have a feature with an input named `name`, you
can use that input in the stub file:

	<?php
	/**
	 * ${{ inputs.featureName | wpClassName | replace('_', ' ') }} Feature
	 */
	class {{ inputs.name | wpClassName }} {
		// ...
	}

Additional, information about the current feature is also available as an object:

	${{ feature.name }}: The name of the feature.
	${{ feature.path }}: The path to the feature configuration file.

With the filters included with Alley Scaffolder and the [built-in ones from
Nunjucks](https://mozilla.github.io/nunjucks/templating.html#builtin-filters)
(especially `replace` and `trim`), you can do almost anything to customize the
generated files to your needs. The end user will be able to quickly scaffold out
new files and features with minimal effort.

[Next: Configuration](./5-configuration.md) &rarr;
