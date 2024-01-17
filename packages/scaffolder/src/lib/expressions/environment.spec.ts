import getEnvironment from './environment';

/* eslint-disable no-template-curly-in-string */

const render = (string: string, context: object = {}) => getEnvironment()
  .renderString(string, context);

describe('environment', () => {
  test('filter:wpClassFilename', () => {
    expect(
      render('${{ "Example Feature" | wpClassFilename }}'),
    ).toBe('example-feature');

    expect(
      render('${{ "Folder/Example Feature" | wpClassFilename }}'),
    ).toBe('folder/example-feature');
  });

  test('filter:wpClassName', () => {
    expect(
      render('${{ "Example Feature" | wpClassName }}'),
    ).toBe('Example_Feature');

    expect(
      render('${{ "Folder/Example Feature" | wpClassName }}'),
    ).toBe('Example_Feature');
  });

  test('filter:psrClassName', () => {
    expect(
      render('${{ "Example Feature" | psrClassName }}'),
    ).toBe('ExampleFeature');

    expect(
      render('${{ "Folder/Example Feature" | psrClassName }}'),
    ).toBe('ExampleFeature');
  });

  test('filter:wpNamespace', () => {
    expect(
      render('${{ "Example Feature" | wpNamespace("Feature") }}'),
    ).toBe('Feature');

    expect(
      render('${{ "Folder/Example Feature" | wpNamespace("Feature") }}'),
    ).toBe('Feature\\Folder');

    expect(
      render('${{ "Folder/Sub Folder/Example Feature" | wpNamespace("Feature") }}'),
    ).toBe('Feature\\Folder\\Sub_Folder');
  });

  test('filter:psrNamespace', () => {
    expect(
      render('${{ "Example Feature" | psrNamespace("Feature") }}'),
    ).toBe('Feature');

    expect(
      render('${{ "Folder/Example Feature" | psrNamespace("Feature") }}'),
    ).toBe('Feature\\Folder');

    expect(
      render('${{ "Folder/Sub Folder/Example Feature" | psrNamespace("Feature") }}'),
    ).toBe('Feature\\Folder\\SubFolder');
  });
});
