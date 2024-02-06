# Features

The scaffolder supports local features (project-driven features) and global
features. Project-driven features are features that are specific to a project
and are scaffolded from files within. These can include generating new tests,
 classes, features, etc. for a project.

Global features are features that are not specific to or even located in a a
project and can be scaffolded anywhere. These can include new WordPress plugins,
projects, themes, etc.

## Feature Source Types

### Local Features

Local features are features that configured and scaffolded from a project
itself. They are sourced from a `.scaffolder` directory in your project. For
example, Alley's
[`create-wordpress-plugin`](https://github.com/alleyinteractive/create-wordpress-plugin/tree/feature/scaffolder/.scaffolder)
project has a `.scaffolder` directory that contains a set of features that can
be scaffolded into the plugin. These can be configured and modified by the
project to fit their specific needs.

A large benefit of keeping the templates within the project is that the project
can independently update the templates to match the project's needs without
having to wait for a new version of the scaffolder to be released.

Let's take a project about a fictional company called "Acme" as an example. The
project has a new feature that is added frequently called "Case Studies". The
feature has a specific set of files that are similar in structure each time. We
can create a new feature called "Case Studies" that scaffolds out the files
needed for the feature instead of needing to copy and paste the files each time.

#### Defining a Feature

A feature is defined as a directory within the `.scaffolder` directory on a
project that contains a `config.yml` file:

    .scaffolder/
      case-studies/
        config.yml
        [...files]

The `config.yml` file will have the following structure
(see [Feature Configuration](#feature-configuration) and
[Expressions](./2-expressions.md) for more information):

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
    destination: src/case-study/{{ wpClassFilename inputs.caseStudyName }}
  - source: case-study-feed.stub
    destination: src/feeds/{{ wpClassFilename inputs.caseStudyName }}.php
  - source: test.stub
    if: "{{ inputs.tests }}"
    destination: tests/Features/{{ psrClassFilename inputs.caseStudyName prefix="" suffix="Test.php" }}
```

Run the scaffolder and you will be prompted for the "Case Study" feature. If
selected, the scaffolder will prompt you for the inputs defined in the
`config.yml` file. Once the inputs are provided and valid, the files will be
generated and copied over to the configured destination.

#### Resolving Source and Destination Paths

By default, the scaffolder will use relative paths from the `config.yml` file to
source files. The destination will default to the current working directory of
the scaffolder. Given a `config.yml` file in the `case-studies` directory:

```yaml
name: Case Study

files:
  - source: case-study.stub
    destination: src/case-study/{{ wpClassFilename inputs.caseStudyName }}
```

The `case-study.stub` file will always be sourced from within the `case-studies`
directory. The generated file will be copied to the `${CWD}/src/case-study`
directory. This works well for most cases to allow the scaffolder to be used
wherever you'd like in the project. However, there are some use cases where
features should be more prescriptive about where their generated files are
placed.

The scaffolder supports a `destination-resolver` configuration option that can
be used to resolve the destination of the files. The `destination-resolver` can
be set to the following values:

- `cwd`: (default) The destination will be resolved to the current working
  directory of the scaffolder.

  If the user is running the scaffolder from the `/example/project` directory,
  the destination will be resolved to `/example/project/:destination`.
- `relative`: The destination will be resolved to the relative path of the
  `config.yml` file.

  If the `config.yml` file is located in the
  `/example/project/.scaffolder/case-studies` directory and the file's
  `destination` is `../../src/case-study`, the destination will be resolved to
  `/example/project/src/case-study`.
- `relative-parent`: The destination will be resolved to the parent directory of
  the `.scaffolder` directory. If the `config.yml` file is located in the
  `/example/project/.scaffolder/case-studies` directory and the file's
  `destination` is `src/case-study`, the destination will be resolved to
  `/example/project/src/case-study`.

- `plugin`: The destination will be resolved to the WordPress plugin directory.
  This is used for WordPress plugins that want to automatically place
  themselves at `wp-content/plugins/<plugin-name>`.
- `theme`: The destination will be resolved to the WordPress theme directory.
  This is used for WordPress themes that want to automatically place
  themselves at `wp-content/themes/<theme-name>`.

The `destination-resolver` can be set in the `config.yml` file of the feature:

```yaml
name: Case Study

config:
  destination-resolver: plugin
```

#### Defining Features Without a Subdirectory

Features can also be defined without a subdirectory on the `features` key in the
project's `.scaffolder/config.yml` file.

```yaml
features:
  - name: Case Study
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
        destination: src/case-study/{{ wpClassFilename inputs.caseStudyName }}
      - source: case-study-feed.stub
        destination: src/feeds/{{ wpClassFilename inputs.caseStudyName }}.php
      - source: test.stub
        if: "{{ inputs.tests }}"
        destination: tests/Features/{{ psrClassFilename inputs.caseStudyName prefix="" suffix="" }}
```

Subdirectories are **strongly recommended** to keep the project organized, but
features can be defined in the `.scaffolder/config.yml` file if desired.

### Remote Features

Remote Features are features that are not specific to or located within a
project and can be scaffolded anywhere. Out of the box, the scaffolder comes
with a set of remote features that can be scaffolded. These can include new
WordPress plugins, projects, themes, etc. Additional remote feature can be
sourced from a remote repository or a local directory. In the future, we'll be
using NPM to manage remote features, too. See
[Configuration](./5-configuration.md) for more information.

Remote Features follow the same syntax as local features, but are not located
within a project.

## Feature Inputs

Inputs are a list of values that the user will be prompted before generation.
Inputs are optional but can be used to customize the feature to the user's
needs. Inputs are defined as a list of objects with the following properties:

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

## Feature Types

The scaffolder supports different feature types that can be used to scaffold
different types of features. For example, a file feature feature is used to copy
a file from A to B. A repository feature is used to clone a repository and optionally run a
command after cloning.

### File Features

The simplest form of a feature is a `config.yml` file located in a directory, be
it local or remote. The `config.yml` file defines the feature and its inputs.
From there, the feature can either scaffold files from the same directory or
scaffold an entire project.

If a feature type is not defined, the feature will default to a file feature.
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
    destination: src/features/{{ wpClassFilename inputs.featureName }}
  - source: test.stub
    if: {{ inputs.tests }}
    destination: tests/Features/{{ psrClassFilename inputs.featureName suffix="Test.php" }}
```

Let's break down the configuration file:

- `name`: The name of the feature. This is used to identify the feature in the
  list of features. If not provided, the name of the directory will be used.
- `inputs`: A list of inputs that the feature requires. Optional. See [Input](#input)
  for more information.
- `files`: A list of files to scaffold. The files support an individual file or
  an entire directory with a `glob` pattern. Both the source and destination
  support expressions for reformatting of the user's input. See
  [Expressions](./3-expressions.md) for more

  Files support an `if` condition that can be used to conditionally scaffold a
  file. By default, the file will be included unless the `if` condition is
  included and evaluates to `false`.

### Repository Feature

A repository feature is used to clone a repository and optionally run a command
after cloning. Out of the box, the scaffolder includes a feature out of the box
that will clone the `create-wordpress-plugin` repository and run the
configuration script after cloning.

The following is a standard configuration file for a repository feature:

```yaml
name: create-wordpress-plugin
type: repository

# Inputs, optional.
inputs:
- name: pluginName
    type: string
    description: "Plugin Name"

# Repository configuration.
repository:
    github: alleyinteractive/create-wordpress-plugin

    # Supports a specific revision with a `#` divider.
    # github: alleyinteractive/create-wordpress-plugin#main

    # Supports git repositories as well.
    # git: https://github.com/

    # The destination of the repository after cloning. Supports expressions.
    destination: "{{ dasherize inputs.pluginName }}"

    # The command to run after cloning the repository. Supports expressions.
    postCloneCommand: "php configure.php"
```

[Next: Expressions](./3-expressions.md) &rarr;
