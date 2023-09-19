# Create Release

This action facilitates the release process of a
[Create WordPress Plugin](https://github.com/alleyinteractive/create-wordpress-plugin) plugin.

When run, it will trigger a new version to be set in the plugin's header and
optionally in the plugin's `composer.json`/`package.json` files. This sets up
the [GitHub Action workflow](https://github.com/alleyinteractive/create-wordpress-plugin/blob/HEAD/.github/workflows/built-release.yml)
which listens for a new version to automatically build and publish to Git.
Running this package's command is optional and the work can still be done
manually by the user but does aim to make it easier to develop and release
new versions of a plugin.

## Usage

Run the package with npx:

```sh
npx @alleyinteractive/release@latest
```

The command will prompt the user for a release type and version number. The
following arguments are available:

```
  -v, --version string The version number to set for the release.
  --major              Bump the major version number.
  --minor              Bump the minor version number.
  --patch              Bump the patch version number.
  -p, --path string    The path to the plugin. Supports relative and absolute paths.
  --composer           Update the version in the plugin's composer.json file.
  --npm                Update the version in the plugin's package.json file.
  --dry-run            Run the command without making any changes.
  -h, --help           Prints help information.
```

If the command is not run from the root of a plugin, you can either pass the
`--path` argument or the command will prompt you for the path to the plugin to
release.

## Changelog

This project keeps a [changelog](CHANGELOG.md).

## Contributors

Thanks to all of the [contributors](../../CONTRIBUTORS.md) to this project.


## License

This project is licensed under the
[GNU Public License (GPL) version 2](LICENSE) or later.
