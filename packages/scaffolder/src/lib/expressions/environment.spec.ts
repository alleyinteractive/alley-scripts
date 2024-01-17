import getEnvironment from './environment';

/* eslint-disable no-template-curly-in-string */

const render = (string: string, context: object = {}) => getEnvironment()
  .renderString(string, context);

describe('environment', () => {
  test('filter:wpClassFilename', () => {
    expect(
      render('${{ "Example Feature" | wpClassFilename }}'),
    ).toEqual('class-example-feature.php');

    expect(
      render('${{ "Folder/Example Feature" | wpClassFilename }}'),
    ).toEqual('folder/class-example-feature.php');

    expect(
      render('${{ "Example Feature" | wpClassFilename("test-") }}'),
    ).toEqual('test-example-feature.php');
  });

  test('filter:psrClassFilename', () => {
    expect(
      render('${{ "Example Feature" | psrClassFilename }}'),
    ).toEqual('ExampleFeature.php');

    expect(
      render('${{ "Folder/Example Feature" | psrClassFilename }}'),
    ).toEqual('Folder/ExampleFeature.php');

    expect(
      render('${{ "Example Feature" | psrClassFilename("Test") }}'),
    ).toEqual('TestExampleFeature.php');

    expect(
      render('${{ "Example Feature" | psrClassFilename("", "Test.php") }}'),
    ).toEqual('ExampleFeatureTest.php');
  });

  test('filter:wpClassName', () => {
    expect(
      render('${{ "Example Feature" | wpClassName }}'),
    ).toBe('Example_Feature');

    expect(
      render('${{ "Folder/Example Feature" | wpClassName }}'),
    ).toBe('Example_Feature');

    expect(
      render('${{ "Example Feature" | wpClassName("Test_") }}'),
    ).toBe('Test_Example_Feature');
  });

  test('filter:psrClassName', () => {
    expect(
      render('${{ "Example Feature" | psrClassName }}'),
    ).toBe('ExampleFeature');

    expect(
      render('${{ "Folder/Example Feature" | psrClassName }}'),
    ).toBe('ExampleFeature');

    expect(
      render('${{ "Example Feature" | psrClassName("Test") }}'),
    ).toBe('TestExampleFeature');

    expect(
      render('${{ "Example Feature" | psrClassName("", "Test") }}'),
    ).toBe('ExampleFeatureTest');
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
