# Getting Started

The scaffolder is a command line tool that helps you create new projects based
on Alley's best practices. It can scaffold out a new project from scratch or
add new features to an existing project from a template.

## Usage

Supports Node 16 though 20 and NPM >= 8.0.0.

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

## Non-Interactive Use (Scripts, CI, and AI Agents)

Every input a feature asks for can be passed on the command line instead, so
the scaffolder can run without prompts. Flags can go before or after the
feature name.

```bash
# See a feature's inputs as JSON.
npx @alleyinteractive/scaffolder <feature> --describe

# Pass inputs one at a time or as a JSON object.
npx @alleyinteractive/scaffolder <feature> --non-interactive --input name=value --input other=value
npx @alleyinteractive/scaffolder <feature> --non-interactive --inputs '{"name":"value"}'

# List features as JSON.
npx @alleyinteractive/scaffolder --list --json
```

- In a terminal, the scaffolder only prompts for inputs you didn't pass.
- With `--non-interactive`, or whenever stdin is not a TTY, it never prompts.
  Inputs you didn't pass use their defaults. If a required input is missing,
  it exits with a non-zero code and lists what's missing along with an example
  command.
- Boolean inputs accept `true`/`false`, `yes`/`no`, or `1`/`0`.
- An exact feature name always wins over partial matches. A partial name that
  matches more than one feature is an error in non-interactive mode.
- `--json` sends logs to stderr and prints a summary to stdout once the
  feature finishes: the feature name, its resolved inputs, and the files it
  created or modified.

## Features

The scaffolder will attempt to locate any configured project features as well as
global features that are included with Alley Scaffolder. See [Features](./1-features.md)
for more information.

[Next: Features](./2-features.md) &rarr;
