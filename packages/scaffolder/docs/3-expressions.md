# Expressions

Expressions are used to reformat the user's input. Alley Scaffolder uses
[Handlebars](https://handlebarsjs.com/) for expression parsing which is a
full featured templating language. Scaffolder also includes a
[helper package](https://github.com/helpers/handlebars-helpers) to make it
easier to work with expressions.

For the purposes of Alley Scaffolder, variables and other expressions are
surrounded by `{{ }}`. This syntax is similar to GitHub Actions, but is not
compatible with GitHub Actions expressions.

You can see expressions in use in the [Feature Configuration](./2-features.md).
Let's use an `if` conditional file as an example:

```yaml
files:
  - source: test.stub
    if: "{{ inputs.tests }}"
    destination: tests/Features/{{ psr4ClassFilename inputs.caseStudyName prefix="" suffix="Test.php" }}
```

In this example, the `if` conditional is used to conditionally scaffold a file
based on the user's input. If the user selects to scaffold tests, the file will
be scaffolded. If not, the file will be skipped.

## Helpers

Helpers are the most powerful part of expressions. Helpers are used to modify
the user's input. For example, if you want to convert a user's input to a valid
WordPress file name, you can use the `wpClassFilename` helper.

### `wpClassFilename`

Converts a string to a valid WordPress file name. By default, the file name will
be prefixed with `class-` and suffixed with `.php` but can be overridden with
the `prefix` and `suffix` arguments.

```
{{ wpClassFilename "User Input" }} => "class-user-input.php"
{{ wpClassFilename "Folder/User Input" }} => "folder/class-user-input.php"
{{ wpClassFilename "Folder/Subfolder/User Input" }} => "folder/subfolder/class-user-input.php"
{{ wpClassFilename "User Input" prefix="prefix-" }} => "prefix-user-input.php"
{{ wpClassFilename "User Input" prefix="prefix-" suffix=".suffix" }} => "prefix-user-input.suffix"
```

### `wpClassName`

Converts a string to a valid WordPress class name. This filter will strip any
preceding folder (which becomes a namespace) along with any invalid characters
and converts the string to Pascal_Case.

```
{{ wpClassName "User Input" }} => "User_Input"
{{ wpClassName "Folder/User Input" }} => "User_Input"
{{ wpClassName "Folder/Subfolder/User Input" }} => "User_Input"
```

The filter also supports a `prefix` and `suffix` argument to add a prefix or
suffix to the string.

```
{{ wpClassName "User Input" prefix="Prefix_" suffix="_Suffix" }} => "Prefix_User_Input_Suffix"
```

### `wpNamespace`

Converts a string to a valid WordPress namespace. This filter will strip any
invalid characters and convert the string to Pascal_Case. The last part of the input will be stripped and used as the class name.

```
{{ wpNamespace "User Input" }} => ""
{{ wpNamespace "Folder/User Input" }} => "Folder"
```

The filter also supports a base namespace argument to add a prefix to the
namespace.

```
{{ wpNamespace "User Input" prefix="Feature\" }} => "Feature\\"
{{ wpNamespace "Folder/User Input" prefix="Feature\" }} => "Feature\\Folder"
```

### `psr4ClassFilename`

Converts a string to a valid PSR-4 file name. By default, the file name will be
suffixed with `.php` but can be overridden with the `suffix` argument.

```
{{ psr4ClassFilename "User Input" }} => "UserInput.php"
{{ psr4ClassFilename "Folder/User Input" }} => "Folder/UserInput.php"
{{ psr4ClassFilename "Folder/Subfolder/User Input" }} => "Folder/Subfolder/UserInput.php"
```

The filter also supports a `prefix` and `suffix` argument to add a prefix or
suffix to the string.

```
{{ psr4ClassFilename "User Input" prefix="Prefix" }} => "PrefixUserInput.php"
{{ psr4ClassFilename "User Input" prefix="Prefix" suffix="Test.php" }} => "PrefixUserInputTest.php"
```

### `psr4ClassName`

Converts a string to a valid PSR-4 class name. This filter will strip any
preceding folder (which becomes a namespace) along with any invalid characters
and converts the string to PascalCase.

```
{{ psr4ClassName "User Input" }} => "UserInput"
{{ psr4ClassName "Folder/User Input" }} => "UserInput"
{{ psr4ClassName "Folder/Subfolder/User Input" }} => "UserInput"
```

The filter also supports a `prefix` and `suffix` argument to add a prefix or
suffix to the string.

```
{{ psr4ClassName "User Input" prefix="Prefix" suffix="Suffix" }} => "PrefixUserInputSuffix"
```

### `psrNamespace`

Converts a string to a valid PSR-4 namespace. This filter will strip any
invalid characters and convert the string to PascalCase.

```
{{ psrNamespace "User Input" }} => ""
{{ psrNamespace "Folder/User Input" }} => "Folder"
```

The filter also supports a base namespace argument to add a prefix to the
namespace.

```
{{ psrNamespace "User Input" prefix="Feature\" }} => "Feature"
{{ psrNamespace "Folder/User Input" prefix="Feature\" }} => "Feature\\Folder"
```

### `dasherize`

Converts a string to a dasherized string.

```
{{ dasherize "User Input" }} => "user-input"
{{ dasherize "Folder/User Input" }} => "folder-user-input"
{{ dasherize "Folder/Subfolder/User Input" }} => "folder-subfolder-user-input"
```

[Next: Writing Stub Files](./4-writing-stub-files.md) &rarr;
