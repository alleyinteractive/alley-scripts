import getEnvironment from './environment';

/* eslint-disable no-template-curly-in-string */

const render = (string: string, context: object = {}) => getEnvironment()
  .compile(string)(context);

describe('environment', () => {
  test('filter:wpClassFilename', () => {
    expect(
      render('{{ wpClassFilename "Example Feature" }}'),
    ).toEqual('class-example-feature.php');

    expect(
      render('{{ wpClassFilename "Folder/Example Feature" }}'),
    ).toEqual('folder/class-example-feature.php');

    expect(
      render('{{ wpClassFilename "Example Feature" prefix="test-" }}'),
    ).toEqual('test-example-feature.php');

    expect(
      render('{{ wpClassFilename "Example Feature" suffix=".bak" }}'),
    ).toEqual('class-example-feature.bak');
  });

  test('filter:psr4ClassFilename', () => {
    expect(
      render('{{ psr4ClassFilename "Example Feature" }}'),
    ).toEqual('ExampleFeature.php');

    expect(
      render('{{ psr4ClassFilename "Folder/Example Feature" }}'),
    ).toEqual('Folder/ExampleFeature.php');

    expect(
      render('{{ psr4ClassFilename "Example Feature" prefix="Test" }}'),
    ).toEqual('TestExampleFeature.php');

    expect(
      render('{{ psr4ClassFilename "Example Feature" prefix="" suffix="Test.php" }}'),
    ).toEqual('ExampleFeatureTest.php');
  });

  test('filter:wpClassName', () => {
    expect(
      render('{{ wpClassName "Example Feature" }}'),
    ).toBe('Example_Feature');

    expect(
      render('{{ wpClassName "Folder/Example Feature" }}'),
    ).toBe('Example_Feature');

    expect(
      render('{{ wpClassName "Example Feature" prefix="Test_" }}'),
    ).toBe('Test_Example_Feature');

    expect(
      render('{{ wpClassName "Example Feature" prefix="Test_" suffix="_Test" }}'),
    ).toBe('Test_Example_Feature_Test');
  });

  test('filter:psr4ClassName', () => {
    expect(
      render('{{ psr4ClassName "Example Feature" }}'),
    ).toBe('ExampleFeature');

    expect(
      render('{{ psr4ClassName "Folder/Example Feature" }}'),
    ).toBe('ExampleFeature');

    expect(
      render('{{ psr4ClassName "Example Feature" prefix="Test" }}'),
    ).toBe('TestExampleFeature');

    expect(
      render('{{ psr4ClassName "Example Feature" prefix="" suffix="Test" }}'),
    ).toBe('ExampleFeatureTest');
  });

  test('filter:wpNamespace', () => {
    expect(
      render('{{ wpNamespace "Example Feature" prefix="Feature" }}'),
    ).toBe('Feature');

    expect(
      render('{{ wpNamespace "Folder/Example Feature" prefix="Feature" }}'),
    ).toBe('Feature\\Folder');

    expect(
      render('{{ wpNamespace "Folder/Sub Folder/Example Feature" prefix="Feature" }}'),
    ).toBe('Feature\\Folder\\Sub_Folder');
  });

  test('filter:psrNamespace', () => {
    expect(
      render('{{ psrNamespace "Example Feature" }}'),
    ).toBe('');

    expect(
      render('{{ psrNamespace "Example Feature" prefix="Feature" }}'),
    ).toBe('Feature');

    expect(
      render('{{ psrNamespace "Folder/Example Feature" prefix="Feature" }}'),
    ).toBe('Feature\\Folder');

    expect(
      render('{{ psrNamespace "Folder/Sub Folder/Example Feature" prefix="Feature" }}'),
    ).toBe('Feature\\Folder\\SubFolder');
  });
});
