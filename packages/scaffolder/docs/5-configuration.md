# Configuration

The `.scaffolder` directory contains the configuration for the project. This
directory is optional if you only want to use global features. If you want to
define project specific features or any additional sources, you will need to
create a `.scaffolder` directory in the root of your project.

## Project Configuration

The project configuration is defined in the `.scaffolder/config.yml` file. This
file defines the project's name, description, and any additional sources (local
or remote).

```yaml
apiVersion: 1

sources:
  # Check another directory in the project for features. Supports both formats.
  - directory: ../project-features
  - ../another-project-features

  # Check a remote repository for features.
  - github: alleyinteractive/scaffolder-features
```

## Global Configuration

The above configuration file can also be placed in the
`~/.scaffolder/config.yml` file to apply to all projects. This is useful for
defining global sources that can be used in any project.

This directory can be set using the `SCAFFOLDER_HOME` environment variable.

----

That's it! You're ready to start scaffolding out your project. If you have any
questions, please start a
[GitHub discussion](https://github.com/alleyinteractive/alley-scripts/discussions/new?category=q-a&title=[scaffodler]:%20)
or ask in the `#opensource` Slack channel if you are an Alleyinz. Happy coding!
