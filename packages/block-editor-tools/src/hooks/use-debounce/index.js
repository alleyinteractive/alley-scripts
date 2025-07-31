import { useState, useEffect } from 'react';

/**
 * Set value on a delay.
 *
 * @param {string} value value to set at a delay
 * @param {int} delay delay in ms
 *
 * @deprecated Use the version from `@uidotdev/usehooks`.
 */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  console.warn('This custom useBounce hook has been deprecated. Please use the version from @wordpress/compose instead.');

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
