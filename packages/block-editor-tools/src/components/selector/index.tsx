// Dependencies.
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import apiFetch from '@wordpress/api-fetch';
import classNames from 'classnames';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { v4 as uuidv4 } from 'uuid';

// Custom hooks.
import { useDebounce } from '@wordpress/compose';

// Components.
import SearchResults from './components/search-results';

import type { SelectorItem } from './types';

// Styles.
import './styles.scss';

export type { SelectorItem };

export interface SelectorProps {
  /**
   * The search type passed to `/wp/v2/search` (e.g. `post` or `term`).
   */
  type?: string;
  className?: string;
  emptyLabel?: string;
  label?: string;
  maxPages?: number;
  multiple?: boolean;
  onSelect: (items: SelectorItem[]) => void;
  placeholder?: string;
  subTypes?: string[];
  selected?: SelectorItem[];
  threshold?: number;
}

/*
 * Array defaults are defined once so that they are stable references across
 * renders, matching the previous `defaultProps` behavior. `selected` is a
 * dependency of an effect that sets state, so a new array on every render
 * would cause an infinite render loop.
 */
const DEFAULT_SELECTED: SelectorItem[] = [];
const DEFAULT_SUB_TYPES: string[] = [];

/*
 * `isSecondary` and `isSmall` are deprecated and no longer in the Button types,
 * but are kept to preserve rendering on older versions of WordPress, which
 * provide `Button` at runtime.
 */
const legacyButtonProps = { isSecondary: true, isSmall: true } as Record<string, unknown>;

/**
 * Render autocomplete component.
 */
const Selector = ({
  type = 'post',
  className = '',
  emptyLabel = __('No items found', 'alley-scripts'),
  label = __('Search for items', 'alley-scripts'),
  maxPages = 5,
  multiple = false,
  onSelect,
  placeholder = __('Search for items', 'alley-scripts'),
  subTypes = DEFAULT_SUB_TYPES,
  selected = DEFAULT_SELECTED,
  threshold = 3,
}: SelectorProps) => {
  // Unique ID.
  const uniqueKey = uuidv4();

  // Setup state.
  const [error, setError] = useState('');
  const [foundItems, setFoundItems] = useState<SelectorItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoadState] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [debouncedSearchString, setDebouncedSearchString] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectorItem[]>([]);

  // Create ref.
  const ref = useRef<HTMLDivElement>(null);

  // Memoize subType string.
  const selectedSubTypes = useMemo(() => (subTypes.length > 0 ? subTypes.join(',') : 'any'), [subTypes]);

  const debouncedSetSearchString = useDebounce((value: string) => {
    setDebouncedSearchString(value);
  }, 750);

  // Debounce search string from input.
  useEffect(() => {
    debouncedSetSearchString(searchString);
  }, [searchString, debouncedSetSearchString]);

  /**
   * Make API request for items by search string.
   *
   * @param {number} page current page number.
   */
  const fetchItems = useCallback(async (page: number = 1): Promise<void> => {
    // Prevent fetch if we haven't
    // met our search string threshold.
    if (debouncedSearchString.length < threshold) {
      setFoundItems([]);
      return;
    }

    // Page count.
    let totalPages = 0;

    if (page === 1) {
      // Reset state before we start the fetch.
      setFoundItems([]);

      // Set the loading flag.
      setLoadState(true);
    }

    // Get search results from the API and store them.
    const path = addQueryArgs(
      '/wp/v2/search',
      {
        page,
        search: debouncedSearchString,
        subtype: selectedSubTypes,
        type,
      },
    );

    // Fetch items by page.
    await apiFetch<Response>({ path, parse: false })
      .then((response) => {
        const totalPagesFromResponse = parseInt(
          response.headers.get('X-WP-TotalPages') as string,
          10,
        );
        // Set totalPage count to received page count unless larger than maxPages prop.
        totalPages = totalPagesFromResponse > maxPages
          ? maxPages : totalPagesFromResponse;
        return response.json();
      })
      .then((items: SelectorItem[]) => {
        setFoundItems((prevState) => [...prevState, ...items]);
        setLoadState(false);

        // Continue to fetch additional page results.
        if (
          (totalPages && totalPages > page)
          || (page >= 1 && multiple && selectedItems.length > 0)
        ) {
          fetchItems(page + 1);
        }
      })
      .catch((err) => setError(err.message));
  }, [
    debouncedSearchString,
    maxPages,
    multiple,
    selectedItems.length,
    selectedSubTypes,
    threshold,
    type,
  ]);

  /**
   * On Mount, pre-fill selected buttons, if they exist.
   */
  useEffect(() => {
    setSelectedItems(selected);
  }, [selected]);

  /**
   * Handles submitting the input value on debounce.
   */
  useEffect(() => {
    if (debouncedSearchString && threshold <= debouncedSearchString.length) {
      fetchItems();
    } else { setFoundItems([]); }
  }, [debouncedSearchString, fetchItems, threshold]);

  /**
   * Mousedown event callback.
   *
   * @param {MouseEvent} event mouse event.
   */
  const handleClick = (event: MouseEvent) => {
    setIsOpen(!!ref.current?.contains(event.target as Node));
  };

  /**
   * Keydown event callback.
   *
   * @param {KeyboardEvent} event keyboard event.
   */
  const handleKeyboard = (event: KeyboardEvent) => {
    if (event.key === 'Escape') { setIsOpen(false); }
  };

  /**
   * Handle keydown.
   */
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  });

  /**
   * Handles mouse down.
   */
  useEffect(() => {
    if (ref) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  });

  /**
   * Handle item selection from search results
   * and return value to parent.
   *
   * @param {SelectorItem} item selected item object.
   */
  const handleItemSelection = (item: SelectorItem) => {
    let newSelectedItems: SelectorItem[] = [];

    // If multiple item selection is available.
    // Add selection to foundItems array.
    if (selectedItems.some((arrayItem) => arrayItem.id === item.id)) {
      const index = selectedItems.findIndex((arrayItem) => arrayItem.id === item.id);
      newSelectedItems = [
        ...selectedItems.slice(0, index),
        ...selectedItems.slice(index + 1, selectedItems.length),
      ];
    } else if (multiple) {
      newSelectedItems = [
        ...selectedItems,
        item,
      ];
    } else {
      // Set single item to state.
      newSelectedItems = [item];
      // Reset state and close dropdown.
      setIsOpen(false);
    }

    setSelectedItems(newSelectedItems);
    onSelect(newSelectedItems);
  };

  return (
    <form
      className="autocomplete__component"
      onSubmit={(event) => event.preventDefault()}
    >
      <div
        className={
          classNames(
            'components-base-control',
            'autocomplete-base-control',
            className,
          )
        }
        ref={ref}
      >
        <div
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-owns={`listbox-${uniqueKey}`}
          className={
            classNames(
              'components-base-control__field',
              'autocomplete-base-control__field',
            )
          }
          role="combobox" // eslint-disable-line jsx-a11y/role-has-required-aria-props
        >
          <label
            className={
              classNames(
                'components-base-control__label',
                'autocomplete-base-control__label',
              )
            }
            htmlFor={`autocomplete-${uniqueKey}`}
          >
            <div>{label}</div>
          </label>
          {selectedItems.length > 0 ? (
            <ul
              role="listbox"
              aria-labelledby={`autocomplete-${uniqueKey}`}
              id={`selected-items-${uniqueKey}`}
              className={
                classNames(
                  'autocomplete__selection--results',
                  'autocomplete__selection-list',
                )
              }
            >
              {selectedItems.map((item) => (
                <li
                  className="autocomplete__selection-list--item"
                  key={item.title}
                >
                  <Button
                    className="autocomplete__selection-list--item--button"
                    {...legacyButtonProps}
                    onClick={() => handleItemSelection(item)}
                    type="button"
                  >
                    {item.title}
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
          <input
            aria-autocomplete="list"
            autoComplete="off"
            className={
              classNames(
                'components-text-control__input',
                'autocomplete-text-control__input',
                {
                  'autocomplete-text-control__input--working': isOpen,
                },
              )
            }
            id={`autocomplete-${uniqueKey}`}
            onChange={(e) => setSearchString(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            type="text"
            value={searchString}
          />
        </div>
        <SearchResults
          emptyLabel={emptyLabel}
          error={error}
          labelledbyId={`autocomplete-${uniqueKey}`}
          id={`listbox-${uniqueKey}`}
          isOpen={isOpen}
          loading={loading && !!debouncedSearchString}
          onSelect={handleItemSelection}
          options={foundItems}
          selectedItems={selectedItems}
          threshold={threshold}
          value={debouncedSearchString}
        />
      </div>
    </form>
  );
};

export default Selector;
