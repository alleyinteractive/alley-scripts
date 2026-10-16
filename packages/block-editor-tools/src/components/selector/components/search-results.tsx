// Dependencies.
import classNames from 'classnames';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export type SelectorItem = {
  id: number,
  title: string,
  [key: string]: any,
};

interface SearchResultsProps {
  emptyLabel: string;
  error: string;
  id: string;
  isOpen: boolean;
  labelledbyId: string;
  loading: boolean;
  onSelect: (item: SelectorItem) => void;
  options: SelectorItem[];
  selectedItems: SelectorItem[];
  threshold: number;
  value: string;
}

/**
 * Render search results list.
 */
const SearchResults = ({
  emptyLabel,
  error,
  id,
  isOpen,
  labelledbyId,
  loading,
  onSelect,
  options,
  selectedItems,
  threshold,
  value,
}: SearchResultsProps) => {
  // Don't show anything if we aren't loading and don't have a value.
  if (!loading && (value === '' || threshold > value.length)) {
    return null;
  }

  let className = '';
  let content = '';

  if (loading) {
    className = 'loading';
    content = __('Loading...', 'alley-scripts');
  } else if (error) {
    className = 'error';
    content = error;
  } else if (!loading && options.length === 0) {
    className = 'no-posts';
    content = emptyLabel;
  }

  // If we're loading
  // Or if we're not loading and have a search string with no posts.
  // Or if we're not loading and have an error.
  if (loading || (!loading && ((value && options.length === 0) || error))) {
    return (
      <div
        aria-busy
        className={
          classNames(
            'autocomplete__dropdown',
            {
              'autocomplete__dropdown--is-open': isOpen,
            },
          )
        }
      >
        <div
          className={
            classNames(
              'autocomplete__dropdown--notice',
              `autocomplete__${className}`,
            )
          }
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        classNames(
          'autocomplete__dropdown',
          {
            'autocomplete__dropdown--is-open': isOpen,
          },
        )
      }
    >
      <ul
        role="listbox"
        aria-labelledby={labelledbyId}
        id={id}
        className={
          classNames(
            'autocomplete__dropdown--results',
            'autocomplete__list',
          )
        }
      >
        {options.map((item) => (
          <li
            className="autocomplete__list--item"
            key={item.id}
          >
            <Button
              onClick={() => onSelect(item)}
              type="button"
              disabled={selectedItems.some((post) => post.id === item.id)}
              variant="tertiary"
            >
              {item.title}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
