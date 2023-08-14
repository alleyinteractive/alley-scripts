# Custom Hooks: useDebounce

A custom React hook that creates and returns a new debounced version of the passed value that will postpone its execution until after wait milliseconds have elapsed since the last time it was invoked

@see <https://github.com/alleyinteractive/alley-scripts/issues/250>

## Usage

```jsx
const MyComponent = () => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 500);

  // This value will display after 500 miliseconds
  useEffect(() => {
    // Kickoff Function on a delay.
  }, [debouncedValue]);

  return (
    <>
      <TextControl
        label={__('Set Value')}
        onChange={(next) => setValue(next)}
        value={value}
      />
    </>
  );
};
```
