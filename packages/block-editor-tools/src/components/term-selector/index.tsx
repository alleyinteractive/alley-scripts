// Dependencies.
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import apiFetch from '@wordpress/api-fetch';
import { FormTokenField, Spinner } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

type BaseSelectedTerm = {
  id: number;
  title: string;
};

type SelectedTerm<T extends Record<string, unknown> = {}> = BaseSelectedTerm & T;

// Rendered in place of the suggestion list while a search is pending. Defined
// at module scope so it is a stable reference and not recreated each render.
const renderSearchingItem = () => (
  <span className="alley-scripts-term-selector__searching">
    <Spinner />
    {__('Searching…', 'alley-scripts')}
  </span>
);

type TermSelectorProps<T extends Record<string, unknown> = {}> = {
  className?: string;
  label?: string;
  multiple?: boolean;
  onSelect: (terms: SelectedTerm<T>[]) => void;
  placeholder?: string;
  selected?: SelectedTerm<T>[];
  subTypes?: string[];
};

const TermSelector = <T extends Record<string, unknown>>({
  className = '',
  label = __('Search for terms', 'alley-scripts'),
  multiple = false,
  onSelect,
  placeholder,
  selected = [],
  subTypes = [],
}: TermSelectorProps<T>) => {
  const [foundItems, setFoundItems] = useState<BaseSelectedTerm[]>([]);
  const [selectedItems, setSelectedItems] = useState(() => selected.map((item) => item.title));

  // Loading state shown while a search request is debouncing or in flight.
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Persistent map of title → id, seeded from initially selected terms.
  const knownTerms = useRef<Map<string, number>>(
    new Map(selected.map(({ title, id }) => [title, id])),
  );

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const selectedSubTypes = useMemo(
    () => (subTypes.length > 0 ? subTypes.join(',') : 'any'),
    [subTypes],
  );

  const fetchItems = useCallback(async (search: string) => {
    // Any in-flight request is now superseded.
    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();

    const queryArgs: Record<string, unknown> = {
      per_page: 100,
      subtype: selectedSubTypes,
      type: 'term',
    };

    if (search) {
      queryArgs.search = search;
    }

    const path = addQueryArgs('/wp/v2/search', queryArgs);

    await apiFetch({ path, signal: abortController.current.signal })
      .then((items) => {
        const results = items as BaseSelectedTerm[];
        results.forEach((item) => knownTerms.current.set(item.title, item.id));
        setFoundItems(results);
        setIsSearching(false);
      })
      .catch((err) => {
        // Ignore aborts: a newer request is in flight and will clear the
        // loading state when it settles.
        if (err.name !== 'AbortError') {
          console.error(err.message); // eslint-disable-line no-console
          setFoundItems([]);
          setIsSearching(false);
        }
      });
  }, [selectedSubTypes]);

  // Fetch initial results on mount, and re-fetch if subTypes changes.
  useEffect(() => {
    fetchItems('');
  }, [fetchItems]);

  const onInputChange = useCallback((search: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setSearchValue(search);

    if (!search) {
      setIsSearching(false);
      fetchItems('');
      return;
    }

    // Show the loading state right away, before the debounce and network
    // round-trip, so the user never sees a premature "no results" message.
    setIsSearching(true);
    debounceTimer.current = setTimeout(() => fetchItems(search), 300);
  }, [fetchItems]);

  // Cleanup timers and in-flight requests on unmount.
  useEffect(() => () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  const onChange = (tokens: string[]) => {
    if (!multiple && tokens.length > 1) return;
    const tokensWithIds = tokens.map((token) => ({
      id: knownTerms.current.get(token) ?? 0,
      title: token,
    }));
    setSelectedItems(tokens);
    // @ts-ignore
    onSelect(tokensWithIds);

    // Cancel any pending search and clear the loading state. The existing
    // results are left in place — the field clears its input on selection, so
    // they simply become the (unfiltered) list again without a network
    // round-trip or a jarring swap back to the default first page.
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setIsSearching(false);
    setSearchValue('');
  };

  const tokenIsValid = (title: string) => knownTerms.current.has(title)
    || foundItems.some((item) => item.title === title);

  // While searching, surface a single "Searching…" row instead of an empty
  // "no results" dropdown. The sentinel equals the current input so it survives
  // FormTokenField's substring filter, and it is intentionally absent from
  // knownTerms/foundItems so tokenIsValid rejects it — it can never be selected.
  const showSearching = isSearching && !!searchValue;
  const suggestions = showSearching
    ? [searchValue]
    : foundItems.map((item) => item.title);

  return (
    <FormTokenField
      className={className}
      __experimentalExpandOnFocus
      __experimentalValidateInput={tokenIsValid}
      // @ts-ignore -- __experimentalRenderItem is a valid (experimental) prop.
      __experimentalRenderItem={showSearching ? renderSearchingItem : undefined}
      __next40pxDefaultSize
      __nextHasNoMarginBottom
      label={label}
      // @ts-ignore
      onChange={onChange}
      onInputChange={onInputChange}
      placeholder={placeholder}
      suggestions={suggestions}
      value={selectedItems}
      maxLength={multiple ? undefined : 1}
      maxSuggestions={999}
    />
  );
};

export default TermSelector;
