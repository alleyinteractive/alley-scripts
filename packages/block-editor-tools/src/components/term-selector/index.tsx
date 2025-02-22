// Dependencies.
import { __ } from '@wordpress/i18n';
import { Selector } from '..';

type BaseSelectedTerm = {
  id: number;
  title: string;
};

type SelectedTerm<T extends Record<string, unknown> = {}> = BaseSelectedTerm & T;

type TermSelectorProps<T extends Record<string, unknown> = {}> = {
  className?: string;
  emptyLabel?: string;
  label?: string;
  maxPages?: number;
  multiple?: boolean;
  onSelect: (terms: SelectedTerm<T>[]) => void;
  placeholder?: string;
  selected?: SelectedTerm<T>[];
  subTypes?: string[];
  threshold?: number;
};

const TermSelector = <T extends Record<string, unknown>>({
  className = '',
  emptyLabel = __('No terms found', 'alley-scripts'),
  label = __('Search for terms', 'alley-scripts'),
  maxPages = 5,
  multiple = false,
  onSelect,
  placeholder = __('Search for terms', 'alley-scripts'),
  selected = [],
  subTypes = [],
  threshold = 3,
}: TermSelectorProps<T>) => (
  <Selector
    className={className}
    emptyLabel={emptyLabel}
    label={label}
    maxPages={maxPages}
    multiple={multiple}
    onSelect={onSelect}
    placeholder={placeholder}
    selected={selected}
    subTypes={subTypes}
    threshold={threshold}
    type="term"
  />
  );

export default TermSelector;
