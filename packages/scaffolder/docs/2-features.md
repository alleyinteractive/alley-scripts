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
description: An optional description of the feature.
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
    destination: tests/Features/{{ psr4ClassFilename inputs.caseStudyName prefix="" suffix="Test.php" }}
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
description: An optional description of the feature.
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
description: An optional description of the feature.
config:
  destination-resolver: plugin
```

#### Defining Features Without a Subdirectory

Features can also be defined without a subdirectory on the `features` key in the
project's `.scaffolder/config.yml` file.

```yaml
features:
  - name: Case Study
    description: An optional description of the feature.
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
        destination: tests/Features/{{ psr4ClassFilename inputs.caseStudyName prefix="" suffix="" }}
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
description: An optional description of the feature.
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
    destination: tests/Features/{{ psr4ClassFilename inputs.featureName suffix="Test.php" }}
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

The following is a standard configuration file for a GitHub repository feature:

```yaml
name: create-wordpress-plugin
description: An optional description of the feature.
type: repository

# Inputs, optional.
inputs:
  - name: pluginName
    type: string
    description: "Plugin Name"

# Repository configuration.
repository:
  # The destination to clone the repository to. Supports expressions and required.
  destination: "{{ dasherize inputs.pluginName }}"
  # The command to run after cloning the repository. Supports expressions.
  postCloneCommand: "php configure.php"

  # The repository configuration. Supports GitHub and Git.
  github:
    # The repository to clone. Supports expressions.
    name: alleyinteractive/create-wordpress-plugin
```

You can also use a Git repository feature to clone a repository from a Git
repository. The following is a standard configuration file for a Git repository
feature:

```yaml
name: create-wordpress-plugin
description: An optional description of the feature.
type: repository

# Inputs, optional.
inputs:
  - name: pluginName
    type: string
    description: "Plugin Name"

# Repository configuration.
repository:
  # The destination to clone the repository to. Supports expressions and required.
  destination: "{{ dasherize inputs.pluginName }}"
  # The command to run after cloning the repository. Supports expressions.
  postCloneCommand: "php configure.php"

  # The repository configuration. Supports GitHub and Git.
  git:
    # The URL of the repository to clone. Supports expressions.
    url: git@bitbucket.com:alleyinteractive/scaffolder-features.git

```

### Composer Feature

A Composer feature is used to install a Composer package and optionally run a
command after installing the package.

```yaml
name: create-wordpress-theme
description: An optional description of the feature.
type: composer

# Inputs, optional.
inputs:
  - name: themeName
    type: string
    description: "Theme Name"

# Composer configuration.
composer:
  package: alleyinteractive/create-wordpress-theme
  destination: "{{ dasherize inputs.themeName }}"

  # Optional. Supports a specific version.
  version: "^1.0.0"

  # Optional. Support additional arguments to pass to the composer command.
  args: "--no-dev"

  # Optional. The command to run after installing the package. Supports expressions.
  postCommand: "php configure.php"
```

## JavaScript Feature Packages

Installed packages can register features implemented in JavaScript. This is a
trusted-code extension mechanism: a package's extension module runs in the
scaffolder process with the same filesystem and process permissions as the
person running Scaffolder. Only install and run extension packages you trust.

Add a `scaffolder` entry point to the package manifest:

```json
{
  "name": "@example/project-scaffolder",
  "scaffolder": "./scaffolder.js"
}
```

Scaffolder searches the same local and global `node_modules` locations used for
YAML feature packages. The entry point is resolved relative to this manifest.
It can default-export one feature or an array of features. A feature must have a
`name` and a `generate` function; `description` and `prompts` are optional.

Here is an ES module that exports one feature and supplies prompt definitions:

```js
export default {
  name: 'post-type',
  description: 'Generate a WordPress post type',

  async prompts(context) {
    return [
      {
        name: 'slug',
        type: 'text',
        message: 'Post type slug',
      },
    ];
  },

  async generate(context) {
    const destination = context.resolveDestination(
      `src/post-types/${context.inputs.slug}.js`,
    );

    if (context.dryRun) {
      context.logger.info(`Would generate ${destination}.`);
      return;
    }

    // Generate or modify project files.
  },
};
```

When `prompts()` returns an array, Scaffolder passes those definitions to the
[`prompts`](https://www.npmjs.com/package/prompts) package and supplies the
answers as `context.inputs` to `generate()`. A package can instead collect its
own inputs and return the resolved object directly:

```js
export default {
  name: 'post-type-from-config',

  async prompts(context) {
    return {
      slug: process.env.POST_TYPE_SLUG || 'book',
      directory: context.cwd,
    };
  },

  async generate(context) {
    context.logger.info(`Generating ${context.inputs.slug}.`);
  },
};
```

The object returned from `prompts()` becomes the feature's resolved inputs;
Scaffolder does not invoke the `prompts` package for that form.

To register several features from one ES module, default-export an array:

```js
export default [
  {
    name: 'post-type',
    async generate(context) {
      context.logger.info(`Generating ${context.feature.name}.`);
    },
  },
  {
    name: 'taxonomy',
    async generate(context) {
      context.logger.info(`Generating ${context.feature.name}.`);
    },
  },
];
```

Both ES modules and CommonJS packages are supported. Use `export default` for
an ES module, or assign the feature or feature array to `module.exports` in a
CommonJS entry point:

```js
module.exports = {
  name: 'post-type',
  async generate(context) {
    context.logger.info(`Generating ${context.feature.name}.`);
  },
};
```

Each JavaScript feature and YAML hook receives this shared context:

- `cwd`: the directory from which Scaffolder was invoked.
- `feature`: an object containing the feature's `name` and optional
  `description`.
- `inputs`: the mutable object of resolved feature inputs.
- `dryRun`: `true` when Scaffolder was invoked with `--dry-run`.
- `featureDirectory`: the directory containing the JavaScript package entry
  point or the YAML feature configuration.
- `resolveDestination(relativePath)`: resolves a destination using the active
  feature's destination rules. JavaScript package features resolve from `cwd`;
  YAML features also honor their configured destination resolver.
- `logger`: Scaffolder's initialized Winston logger.

Package discovery failures are isolated. If an opted-in package has a missing
entry point, cannot be imported, or exports an invalid feature, Scaffolder logs
a warning naming that package and continues loading other packages.

## JavaScript Hooks for YAML Features

YAML features can run a JavaScript module before and after their built-in
generator. Set `hooks` to a module path relative to the feature's `config.yml`:

```yaml
name: Post Type
type: file
hooks: ./hooks.js
inputs:
  - name: slug
files:
  - source: post-type.stub
    destination: src/post-types/{{ inputs.slug }}.php
```

The module may export either or both supported hooks. In an ES module, use
named exports:

```js
export async function beforeGenerate(context) {
  // Runs after YAML inputs are collected and before the built-in generator.
  context.inputs.slug = context.inputs.slug.toLowerCase();
}

export async function afterGenerate(context) {
  if (context.dryRun) {
    context.logger.info('Would update the post type registry.');
    return;
  }

  // Update the registry here.
}
```

The lifecycle order is: collect YAML inputs, create the shared context, run
`beforeGenerate(context)` when exported, run the built-in generator, then run
`afterGenerate(context)` when exported. Hooks receive the same mutable context
object. Changes made to `context.inputs` in `beforeGenerate` are synchronized
to the generator, so YAML templates and `afterGenerate` receive those changes.

At least one of `beforeGenerate` or `afterGenerate` must be a function. A hook
module with neither supported export, a non-function hook, or an import failure
stops the selected feature and reports the configured and resolved module path.
If either `beforeGenerate` or the built-in generator throws,
`afterGenerate` does not run. Unknown exports are ignored.

Hooks run during `--dry-run`, including `afterGenerate`. The built-in YAML
generator continues to honor dry-run mode, but extension code is responsible
for avoiding its own mutations by checking `context.dryRun`, as in the example
above. This responsibility cannot be enforced for arbitrary trusted code.

[Next: Expressions](./3-expressions.md) &rarr;
