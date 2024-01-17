# Getting Started

The scaffolder is a command line tool that helps you create new projects based
on Alley's best practices. It can scaffold out a new project from scratch, or
add new features to an existing project from a template.

## Usage

Requires Node 16 though 20 and NPM >= 8.0.0.

```bash
npx @alleyinteractive/scaffolder
```

Out of the box, the scaffolder will prompt you for a feature you wish to
scaffold. You can also pass a feature name as an argument to skip the prompt.

```bash
npx @alleyinteractive/scaffolder <feature>
```

The scaffolder also supports a dry run mode that will output the files that
would be created without actually creating them.

```bash
npx @alleyinteractive/scaffolder --dry-run
```

## Features

The scaffolder will attempt to locate any configured project features as well as
global features that are included with Alley Scaffolder. See [Features](./1-features.md)
for more information.
