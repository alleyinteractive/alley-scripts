// Dependencies.
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import apiFetch from '@wordpress/api-fetch';
import { FormTokenField } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

type BaseSelectedTerm = {
  id: number;
  title: string;
};

type SelectedTerm<T extends Record<string, unknown> = {}> = BaseSelectedTerm & T;

type TermSelectorProps<T extends Record<string, unknown> = {}> = {
  className?: string;
  label?: string;
  maxPages?: number;
  multiple?: boolean;
  onSelect: (terms: SelectedTerm<T>[]) => void;
  placeholder?: string;
  selected?: SelectedTerm<T>[];
  subTypes?: string[];
};

const TermSelector = <T extends Record<string, unknown>>({
  className = '',
  label = __('Search for terms', 'alley-scripts'),
  maxPages = 5,
  multiple = false,
  onSelect,
  placeholder,
  selected = [],
  subTypes = [],
}: TermSelectorProps<T>) => {
  // Create array of titles from selected value.
  const selectedTitles = Array.from(selected.map((item) => item.title));

  // Setup state.
  const [foundItems, setFoundItems] = useState<BaseSelectedTerm[]>([]);
  const [selectedItems, setSelectedItems] = useState(selectedTitles);

  // Memoize subType string.
  const selectedSubTypes = useMemo(() => (subTypes.length > 0 ? subTypes.join(',') : 'any'), [subTypes]);

  /**
   * Make API request for items by search string.
   *
   * @param {int} page current page number.
   */
  const fetchItems = useCallback(async (page = 1) => {
    // Page count.
    let totalPages = 0;

    if (page === 1) {
      // Reset state before we start the fetch.
      setFoundItems([]);
    }

    // Get search results from the API and store them.
    const path = addQueryArgs(
      '/wp/v2/search',
      {
        page,
        per_page: 100,
        subtype: selectedSubTypes,
        type: 'term',
      },
    );

    // Fetch items by page.
    await apiFetch({ path, parse: false })
      .then((response) => {
        const totalPagesFromResponse = parseInt(
          // @ts-ignore
          response.headers.get('X-WP-TotalPages'),
          10,
        );
        // Set totalPage count to received page count unless larger than maxPages prop.
        totalPages = totalPagesFromResponse > maxPages
          ? maxPages : totalPagesFromResponse;
        // @ts-ignore
        return response.json();
      })
      .then((items) => {
        // @ts-ignore
        setFoundItems((prevState) => [...prevState, ...items]);

        // Continue to fetch additional page results.
        if (
          (totalPages && totalPages > page)
        ) {
          fetchItems(page + 1);
        }
      })
      .catch((err) => console.error(err.message)); // eslint-disable-line no-console
  }, [maxPages, selectedSubTypes]);

  /**
   * Kick off initial fetch.
   */
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onChange = (tokens: string[]) => {
    if (!multiple && tokens.length > 1) return;
    const tokensWithIds = tokens.map((token) => ({
      id: foundItems.find((item) => item.title === token)?.id ?? 0,
      title: token,
    }));
    setSelectedItems(tokens);
    // @ts-ignore
    onSelect(tokensWithIds);
  };
  const tokenIsValid = (title: string) => foundItems.some((item) => item.title === title);

  return (
    <FormTokenField
      className={className}
      __experimentalExpandOnFocus
      __experimentalValidateInput={tokenIsValid}
      __next40pxDefaultSize
      __nextHasNoMarginBottom
      label={label}
      // @ts-ignore
      onChange={onChange}
      placeholder={placeholder}
      suggestions={foundItems.map((item) => item.title)}
      value={selectedItems}
      maxLength={multiple ? undefined : 1}
      maxSuggestions={999}
    />
  );
};

export default TermSelector;
