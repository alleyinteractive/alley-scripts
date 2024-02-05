# Scaffolder

This action aids to quickly scaffold templates for a project. Any project can
define templates that can be used to quickly scaffold a set of files with
pre-defined values.

## Usage

Run the package with `npx`:

```sh
npx @alleyinteractive/scaffolder@latest

# Run a specific feature template.
npx @alleyinteractive/scaffolder@latest <feature>
```

The following arguments are available:

```
  --root               The root directory of the project. Defaults to the current
                       working directory.
  --debug              Print debug information.
  --dry-run            Run the command without making any changes.
  -h, --help           Prints help information.
```

If the command is not run from the root of a project with a `.scaffolder`
directory, Scaffolder will attempt to find a `.scaffolder` configuration in a
parent directory. You can also pass the `--root` argument to specify the root
directory of the project.

## Documentation

1. [Getting Started](./docs/1-getting-started.md)
2. [Features](./docs/2-features.md)
3. [Expressions](./docs/3-expressions.md)
4. [Writing Stub Files](./docs/4-writing-stub-files.md)
5. [Configuration](./docs/5-configuration.md)

## Changelog

This project keeps a [changelog](CHANGELOG.md).

## Contributors

Thanks to all of the [contributors](../../CONTRIBUTORS.md) to this project.


## License

This project is licensed under the
[GNU Public License (GPL) version 2](LICENSE) or later.
