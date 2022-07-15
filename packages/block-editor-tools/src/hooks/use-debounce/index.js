import { useState, useEffect } from '@wordpress/element';

/**
 * Set value on a delay.
 *
 * @param {string} value value to set at a delay
 * @param {int} delay delay in ms
 */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  /**
   * Update value at a delay.
   */
  useEffect(() => {
    const timeoutHandler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutHandler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
