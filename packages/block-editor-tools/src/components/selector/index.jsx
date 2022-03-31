// Dependencies.
import PropTypes from 'prop-types';
import apiFetch from '@wordpress/api-fetch';
import classNames from 'classnames';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from '@wordpress/element';
import { Button, SearchControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { v4 as uuidv4 } from 'uuid';

// Custom hooks.
import useDebounce from 'hooks/use-debounce';

// Components.
import SearchResults from './components/search-results';

// Styles.
import './styles.scss';

/**
 * Render autocomplete component.
 */
const Selector = ({
  type,
  className,
  emptyLabel,
  handleSearch,
  renderResult,
  label,
  maxPages,
  maxSelections,
  multiple,
  onSelect,
  placeholder,
  renderSelection,
  subTypes,
  selected,
  threshold,
}) => {
  // Unique ID.
  const uniqueKey = uuidv4();

  // Setup state.
  const [error, setError] = useState('');
  const [foundItems, setFoundItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Create ref.
  const ref = useRef();

  // Debounce search string from input.
  const debouncedSearchString = useDebounce(searchString, 750);

  /**
   * Make API request for items by search string.
   *
   * @param {int} page current page number.
   */
  const defaultSearchHandler = useCallback(async (page) => {
    // Get search results from the API and store them.
    const path = addQueryArgs(
      '/wp/v2/search',
      {
        page,
        search: debouncedSearchString,
        subtype: subTypes.length > 0 ? subTypes.join(',') : 'any',
        type,
      },
    );

    // Fetch items by page.
    return apiFetch({ path, parse: false })
      .then(async (response) => {
        const totalResults = parseInt(response.headers.get('X-WP-Total'), 10);
        const results = await response.json();

        return {
          results,
          totalResults,
        };
      })
      .catch((err) => setError(err.message));
  }, [
    debouncedSearchString,
    subTypes,
    type,
  ]);

  // Perform a search based on the search handler.
  const doSearch = useCallback(async (page) => {
    if (handleSearch) {
      return handleSearch(debouncedSearchString, { page });
    }

    return defaultSearchHandler(page);
  }, [
    debouncedSearchString,
    defaultSearchHandler,
    handleSearch,
  ]);

  const updateSearchResults = useCallback((page = 1, items = []) => {
    // Set the loading state to true while getting results.
    setIsLoading(true);

    doSearch(page).then(({ results, totalResults }) => {
      const allResults = [...items, ...results];
      setFoundItems(allResults);
      setIsLoading(false);

      // Recursively update search results if we can.
      if (totalResults > allResults.length && page < maxPages) {
        updateSearchResults(page + 1, allResults);
      }
    });
  }, [
    maxPages,
    doSearch,
  ]);

  /**
   * On Mount, pre-fill selected buttons, if they exist.
   */
  useEffect(() => {
    setSelectedItems(selected);
  }, [selected]);

  /**
   * Handles fetching search results when the input value changes.
   */
  useEffect(() => {
    if (debouncedSearchString && threshold <= debouncedSearchString.length) {
      updateSearchResults();
    }
  }, [
    debouncedSearchString,
    threshold,
    updateSearchResults,
  ]);

  /**
   * Mousedown event callback.
   *
   * @param {MouseEvent} event mouse event.
   */
  const handleClick = (event) => {
    setIsOpen(ref.current.contains(event.target));
  };

  /**
   * Keydown event callback.
   *
   * @param {KeyboardEvent} event keyboard event.
   */
  const handleKeyboard = (event) => {
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
   * @param {object} item selected item object.
   */
  const handleItemSelection = (item) => {
    let newSelectedItems = [];

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

  const hasMaxSelections = (
    (maxSelections && selectedItems.length === maxSelections)
    || (!multiple && selectedItems.length === 1)
  );

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
                    isSecondary
                    isSmall
                    onClick={() => handleItemSelection(item)}
                    type="button"
                  >
                    {renderSelection ? renderSelection(item) : item.title}
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
          {hasMaxSelections ? null : (
            <SearchControl
              onChange={(newValue) => setSearchString(newValue)}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              value={searchString}
              label={__('Search')} // Label will be visually hidden.
              help={label}
            />
          )}
        </div>
        <SearchResults
          emptyLabel={emptyLabel}
          error={error}
          renderResult={renderResult}
          labelledById={`autocomplete-${uniqueKey}`}
          id={`listbox-${uniqueKey}`}
          isOpen={isOpen && !hasMaxSelections}
          loading={isLoading && debouncedSearchString}
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

/**
 * Set initial props.
 * @type {object}
 */
Selector.defaultProps = {
  type: 'post',
  className: '',
  emptyLabel: __('No items found', 'prhuk-core'),
  handleSearch: null,
  label: __('Search for items', 'prhuk-core'),
  maxPages: 5,
  maxSelections: 0,
  multiple: false,
  placeholder: __('Search for items', 'prhuk-core'),
  renderResult: null,
  renderSelection: null,
  subTypes: [],
  selected: [],
  threshold: 3,
};

/**
 * Set PropTypes for this component.
 * @type {object}
 */
Selector.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  emptyLabel: PropTypes.string,
  handleSearch: PropTypes.func,
  label: PropTypes.string,
  maxPages: PropTypes.number,
  maxSelections: PropTypes.number,
  multiple: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  renderResult: PropTypes.func,
  renderSelection: PropTypes.func,
  subTypes: PropTypes.arrayOf(PropTypes.string),
  selected: PropTypes.arrayOf([
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    }),
  ]),
  threshold: PropTypes.number,
};

export default Selector;
