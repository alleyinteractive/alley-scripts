# Configuration

The scaffolder will recursively search for scaffolder directories in the current
and all parent directories. These are defined as a `.scaffolder` directory
optionally containing a `config.yml` file. All configuration files are loaded by
default. Scaffolder will discover all features within all `.scaffolder`
directories. If you wish to define any additional sources to search for
features, you can do so in the `config.yml` file.

## Source Definitions

The `.scaffolder/config.yml` file can define additional sources to search for
features. This is useful for including features from other projects or
repositories. Here's an example of how to define sources:

```yaml
sources:
  # Check another directory in the project for features. Supports both formats.
  - directory: ../project-features
  - ../another-project-features

  # Check a remote repository for features. Any .scaffolder/**/config.yml files
  # will be resolved from within the repository.
  - github: alleyinteractive/scaffolder-features

  # Also supports object format to specify a ref and/or directory:
  - github: alleyinteractive/scaffolder-features
    ref: main
    directory: project-features

  - github:
    url: https://github.com/alleyinteractive/scaffolder-features

  # Check a git repository for features. Any .scaffolder/**/config.yml files
  # will be resolved from within the repository.
  - git: git@bitbucket.com:alleyinteractive/scaffolder-features.git

  # Also supports object format to specify a ref and/or directory:
  - git: git@bitbucket.com:alleyinteractive/scaffolder-features.git
    ref: main
    directory: project-features
```

### Loading Features from NPM Packages

Any installed NPM package that is installed globally will be checked for any
available scaffolder features. This is useful for sharing features across
projects. The scaffolder uses this internally to define built-in features that
are included with the scaffolder package when installed globally.

### Global Configuration

The above configuration file can also be placed in the
`~/.scaffolder/config.yml` file to apply to all projects. This is useful for
defining global sources that can be used in any project.

This directory can be set using the `SCAFFOLDER_HOME` environment variable.

### Defining Features in `.scaffolder/config.yml`

Features can be defined in the `.scaffolder/config.yml` file. This is useful for
lightweight features that clone a remote repository or don't have any stub files.

```yaml
features:
  - name: create-wordpress-plugin
    type: repository
    config:
      destination-resolver: plugin
    inputs:
      - name: name
        description: "Name of the Plugin"
        type: "string"
    repository:
      destination: "{{ folderName inputs.name }}"
      github: alleyinteractive/create-wordpress-plugin
      postCloneCommand: "php configure.php"
```

It is still recommended to define features in their own
`.scaffolder/<feature>config.yml` file for better organization.

----

That's it! You're ready to start scaffolding out your project. If you have any
questions, please start a
[GitHub discussion](https://github.com/alleyinteractive/alley-scripts/discussions/new?category=q-a&title=[scaffodler]:%20)
or ask in the `#opensource` Slack channel if you are an Alleyinz. Happy coding!
