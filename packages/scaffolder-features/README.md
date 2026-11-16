# Scaffolder Features

This package provides a set of features for the
[Alley Scaffolder](../scaffolder/README.md) package.

## Features

- `create-wordpress-plugin`: Scaffold a
  [create-wordpress-plugin](https://github.com/alleyinteractive/create-wordpress-plugin)
  project.
- `create-wordpress-project`: Scaffold a
  [create-wordpress-project](https://github.com/alleyinteractive/create-wordpress-project).
- `convert-plugin-to-pest`: Convert an existing create-wordpress-plugin project's
  PHPUnit tests to [Pest](https://pestphp.com/) using
  [pest-plugin-wordpress](https://github.com/alleyinteractive/pest-plugin-wordpress).
  Run it from the plugin's root. Raises the plugin's minimum PHP version to 8.3.
- `create-wordpress-plugin@post-type`: Add a custom post type to a
  create-wordpress-plugin plugin as a `Feature` class in `src/features` and
  register it in `src/main.php`. Run it from the plugin's root.
- `create-wordpress-plugin@taxonomy`: Add a custom taxonomy the same way.

Both can run without prompts, which is how AI agents should call them:

```sh
npx @alleyinteractive/scaffolder@latest create-wordpress-plugin@post-type --non-interactive \
  --input slug=book --input singular=Book
npx @alleyinteractive/scaffolder@latest create-wordpress-plugin@taxonomy --non-interactive \
  --input slug=genre --input singular=Genre --input objectTypes=book
```

Run either with `--describe` to see every input and its default.

## Changelog

This project keeps a [changelog](CHANGELOG.md).

## Contributors

Thanks to all of the [contributors](../../CONTRIBUTORS.md) to this project.


## License

This project is licensed under the
[GNU Public License (GPL) version 2](LICENSE) or later.
