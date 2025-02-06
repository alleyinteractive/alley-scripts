// Dependencies.
import { __ } from '@wordpress/i18n';
import { Selector } from '..';

interface SelectedTerm {
  id: number;
  title: string;
  type: string;
  url: string;
}

interface TermSelectorProps {
  className?: string;
  emptyLabel?: string;
  label?: string;
  maxPages?: number;
  multiple?: boolean;
  onSelect: (terms: SelectedTerm[]) => void;
  placeholder?: string;
  subTypes?: string[];
  selected?: SelectedTerm[];
  threshold?: number;
}

/**
 * Render term selector component.
 */
const TermSelector = ({
  className = '',
  emptyLabel = __('No terms found', 'alley-scripts'),
  label = __('Search for terms', 'alley-scripts'),
  maxPages = 5,
  multiple = false,
  onSelect,
  placeholder = __('Search for terms', 'alley-scripts'),
  subTypes = [],
  selected = [],
  threshold = 3,
}: TermSelectorProps) => (
  <Selector
    type="term"
    className={className}
    emptyLabel={emptyLabel}
    label={label}
    maxPages={maxPages}
    multiple={multiple}
    onSelect={onSelect}
    placeholder={placeholder}
    subTypes={subTypes}
    selected={selected}
    threshold={threshold}
  />
);

export default TermSelector;
