# Alley Build Tool

To get started working on the Alley Build Tool, follow the instructions below.

* In broadway run  `apm install alley-scripts`.
* navigate to the `alley-scripts` directory in your terminal.
  * The `create-wordpress-plugin` and `alley-scripts` projects will be located in the `wp-content/plugins/` directory.
* Navigate to the `create-wordpress-plugin` directory in your terminal.
* Run `git checkout feature/alley-build` and `npm install`.
* Navigate to the `alley-scripts` directory in your terminal.
* Run `git checkout feature/alley-build` and `npm install`.

You will now be able to run the build in the `create-wordpress-plugin` directory by running `npm run build` and the build in the `alley-scripts/packages/built-tool` will run the base configuration in the build-tool package.

Branch your changes off of the `feature/alley-build` feature branch from the `alley-scripts` repo.

Happy Hacking!