# Features

The scaffolder supports local features (project-driven features) and global features.
Project-driven features are features that are specific to a project and are
scaffolded from files within. These can include generating new tests, classes,
 features, etc. for a project.

Global features are features that are not specific to or even located in a a
project and can be scaffolded anywhere. These can include new WordPress plugins,
projects, themes, etc.

## Local Features

Local features are features that configured and scaffolded from a project
itself. They require a `.scaffolder` directory in your project to scaffold from.
For example, Alley's
[`create-wordpress-plugin`](https://github.com/alleyinteractive/create-wordpress-plugin/tree/feature/scaffolder/.scaffolder)
project has a `.scaffolder` directory that contains a set of features that can
be scaffolded into the plugin. These can be configured and modified by the
project to fit their specific needs.

One large benefit of keeping the templates within the project is that the
project can independently update the templates to match the project's needs
without having to wait for a new version of the scaffolder to be released.

Let's take a project about a fictional company called "Acme" as an example. The
project has a new feature that is added frequently called "Case Studies". The
feature has a specific set of files that are similar in structure each time. We
can create a new feature called "Case Studies" that scaffolds out the files
needed for the feature instead of needing to copy and paste the files each time.

### Defining a Feature

A feature is defined as a directory within the `.scaffolder` directory on a
project that contains a `config.yml` file:

    .scaffolder/
	  case-studies/
		config.yml
		[...files]

The `config.yml` file will have the following structure
(see [Feature Configuration](#feature-configuration) and
[Expressions](./expressions.md) for more information):

```yaml
name: Case Study

inputs:
  - name: caseStudyName
    description: "Case Study Name"
    type: string
  - name: tests
    description: "Include Tests?"
    type: boolean
    default: true

files:
  - source: case-study.stub
    destination: src/case-study/${{ inputs.caseStudyName | wpClassFilename }}
  - source: case-study-feed.stub
    destination: src/feeds/${{ inputs.caseStudyName | wpClassFilename }}.php
  - source: test.stub
    if: ${{ inputs.tests }}
    destination: tests/Features/${{ inputs.caseStudyName | psrClassFilename('', 'Test.php') }}
```

Run the scaffolder and you will be prompted for the "Case Study" feature. If
selected, the scaffolder will prompt you for the inputs defined in the
`config.yml` file. Once the inputs are provided and valid, the files will be
generated and copied over to the configured destination.

## Remote Features

Remote Features are features that are not specific to or even located in a a
project and can be scaffolded anywhere. Out of the box, the scaffolder comes
with a set of remote features that can be scaffolded. These can include new
WordPress plugins, projects, themes, etc. Additional remote feature can be
sourced from a remote repository or a local directory. See
[Configuration](./5-configuration.md) for more information.

Remote Features follow the same syntax as local features, but are not located
within a project.

## Feature Configuration

The simplest form of a feature is a `config.yml` file located in a directory, be
it local or remote. The `config.yml` file defines the feature and its inputs.
From there, the feature can either scaffold files from the same directory or
scaffold an entire project.

The following is a standard configuration file for a feature:

```yaml
name: Plugin Feature

inputs:
  - name: featureName
    description: "Feature Name"
    type: string
  - name: tests
    description: "Include Tests?"
    type: boolean
    default: true

files:
  - source: feature.stub
    destination: src/features/${{ inputs.featureName | wpClassFilename }}
  - source: test.stub
    if: ${{ inputs.tests }}
    destination: tests/Features/${{ inputs.featureName | psrClassFilename('', 'Test.php') }}
```

Let's break down the configuration file:

- `name`: The name of the feature. This is used to identify the feature in the
  list of features. If not provided, the name of the directory will be used.
- `inputs`: A list of inputs that the feature requires. Optional. See [Input](#input)
  for more information.
- `files`: A list of files to scaffold. The files support an individual file or
  an entire directory. Both the source and destination support expressions for
  reformatting of the user's input. See [Expressions](./expressions.md) for more

  Files support an `if` condition that can be used to conditionally scaffold a
  file. By default, the file will be included unless the `if` condition is
  included and evaluates to `false`.

### Inputs

Inputs are a list of values that the user will be prompted for when the feature
is selected. Inputs are optional, but can be used to customize the feature to
the user's needs. Inputs are defined as a list of objects with the following
properties:

- `name`: Required. The name of the input. This is used to identify the input in the list
  of inputs.
- `description`: Optional. The description of the input. This is used to describe the
  input to the user.
- `type`: Optional. The type of the input. This is used to validate the input. The
  following types are supported:

    - `string`: A string value.
    - `boolean`: A boolean value. The input will be a checkbox.
	- `select`: (Not yet supported!) A select value. The input will be a select
	box. Options are defined in the `options` property.

- `default`: Optional. The default value of the input. If not provided, the
  default value is an empty string.
- `required`: Optional. Whether the input is required. If not provided, the
  input is not required. Note: boolean inputs are always required.

Once the user has submitted the inputs, the inputs will be available in the
`inputs` object when evaluating expressions.

[Next: Expressions](./3-expressions.md) &rarr;
