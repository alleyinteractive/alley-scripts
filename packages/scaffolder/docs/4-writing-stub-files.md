# Writing Stub Files

Stub files are the templates that are used to scaffold files in file features.
They are written in [Handlebars](https://handlebarsjs.com/) and can contain any
valid Handlebar syntax. You also don't _have_ to use Handlebars syntax and can
simplify scaffold the file over one to one.

The [expression helpers](./3-expressions.md) are also available in stub files.

## Variables

The [feature's input](./2-features.md#input) is available as a variable in the
stub file. For example, if you have a feature with an input named `name`, you
can use that input in the stub file:

    <?php
    /**
     * {{ replace (psrClassName inputs.featureName) "_" " " }} Feature
     */
    class {{ wpClassName inputs.name }} {
        // ...
    }

With the filters included with Alley Scaffolder and the [built-in ones from
handlebar-helpers](https://github.com/helpers/handlebars-helpers) and
[Handlebars](https://handlebarsjs.com/guide/builtin-helpers.html). (especially
`replace` and `trim`), you can do almost anything to customize the generated
files to your needs. The end user will be able to quickly scaffold out new files
and features with minimal effort.

[Next: Configuration](./5-configuration.md) &rarr;
