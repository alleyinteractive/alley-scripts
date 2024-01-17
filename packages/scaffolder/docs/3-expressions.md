# Expressions

Expressions are used to reformat the user's input. Alley Scaffolder uses
[Nunjucks](https://mozilla.github.io/nunjucks/) for expression parsing which is a
full featured templating language.

For the purposes of Alley Scaffolder, variables and other expressions are
surrended by `${{ }}`. This syntax is similar to GitHub Actions, but is not
compatible with GitHub Actions expressions.

You can see expressions in use in the [Feature Configuration](./2-features.md).
Let's use an `if` conditional file as an example:

```yaml
files:
  - source: test.stub
	if: ${{ inputs.tests }}
	destination: tests/Features/${{ inputs.caseStudyName | psrClassFilename('', 'Test.php') }}
```

In this example, the `if` conditional is used to conditionally scaffold a file
based on the user's input. If the user selects to scaffold tests, the file will
be scaffolded. If not, the file will be skipped.

## Filters

Filters are the most powerful part of expressions. Filters are used to modify
the user's input. For example, if you want to convert a user's input to a
valid WordPress file name, you can use the `wpClassFilename` filter.

See
[Nunjucks's Builtin Filters](https://mozilla.github.io/nunjucks/templating.html#builtin-filters)
as well as the custom filters below.

### `wpClassFilename`

Converts a string to a valid WordPress file name. By default, the file name will
be prefixed with `class-` and suffixed with `.php` but can be overridden with
the `prefix` and `suffix` arguments.

```
${{ "User Input" | wpClassFilename }} => "class-user-input.php"
${{ "Folder/User Input" | wpClassFilename }} => "folder/class-user-input.php"
${{ "Folder/Subfolder/User Input" | wpClassFilename }} => "folder/subfolder/class-user-input.php"
${{ "User Input" | wpClassFilename('prefix-') }} => "prefix-user-input.php"
${{ "User Input" | wpClassFilename('prefix-', '.suffix') }} => "prefix-user-input.suffix"
```

### `wpClassName`

Converts a string to a valid WordPress class name. This filter will strip any
preceding folder (which becomes a namespace) along with any invalid characters
and converts the string to Pascal_Case.

```
${{ "User Input" | wpClassName }} => "User_Input"
${{ "Folder/User Input" | wpClassName }} => "User_Input"
${{ "Folder/Subfolder/User Input" | wpClassName }} => "User_Input"
```

The filter also supports a `prefix` and `suffix` argument to add a prefix or
suffix to the string.

```
${{ "User Input" | wpClassName('Prefix_', '_Suffix') }} => "Prefix_User_Input_Suffix"
```

### `wpNamespace`

Converts a string to a valid WordPress namespace. This filter will strip any
invalid characters and convert the string to Pascal_Case. The last part of the input will be stripped and used as the class name.

```
${{ "User Input" | wpNamespace }} => ""
${{ "Folder/User Input" | wpNamespace }} => "Folder"
```

The filter also supports a base namespace argument to add a prefix to the
namespace.

```
${{ "User Input" | wpNamespace('Feature\\') }} => "Feature\\"
${{ "Folder/User Input" | wpNamespace('Feature\\') }} => "Feature\\Folder"
```

### `psrClassFilename`

Converts a string to a valid PSR-4 file name. By default, the file name will be
suffixed with `.php` but can be overridden with the `suffix` argument.

```
${{ "User Input" | psrClassFilename }} => "UserInput.php"
${{ "Folder/User Input" | psrClassFilename }} => "Folder/UserInput.php"
${{ "Folder/Subfolder/User Input" | psrClassFilename }} => "Folder/Subfolder/UserInput.php"
```

The filter also supports a `prefix` and `suffix` argument to add a prefix or
suffix to the string.

```
${{ "User Input" | psrClassFilename('Prefix') }} => "PrefixUserInput.php"
${{ "User Input" | psrClassFilename('Prefix', 'Test.php') }} => "PrefixUserInputTest.php"
```

### `psrClassName`

Converts a string to a valid PSR-4 class name. This filter will strip any
preceding folder (which becomes a namespace) along with any invalid characters
and converts the string to PascalCase.

```
${{ "User Input" | psrClassName }} => "UserInput"
${{ "Folder/User Input" | psrClassName }} => "UserInput"
${{ "Folder/Subfolder/User Input" | psrClassName }} => "UserInput"
```

The filter also supports a `prefix` and `suffix` argument to add a prefix or
suffix to the string.

```
${{ "User Input" | psrClassName('Prefix', 'Suffix') }} => "PrefixUserInputSuffix"
```

### `psrNamespace`

Converts a string to a valid PSR-4 namespace. This filter will strip any
invalid characters and convert the string to PascalCase.

```
${{ "User Input" | psrNamespace }} => ""
${{ "Folder/User Input" | psrNamespace }} => "Folder"
```

The filter also supports a base namespace argument to add a prefix to the
namespace.

```
${{ "User Input" | psrNamespace('Feature\\') }} => "Feature"
${{ "Folder/User Input" | psrNamespace('Feature\\') }} => "Feature\\Folder"
```
