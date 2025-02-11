// Dependencies.
import { __ } from '@wordpress/i18n';
import { Selector } from '..';

export interface SelectedTerm {
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
  selected?: SelectedTerm[];
  subTypes?: string[];
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
  selected = [],
  subTypes = [],
  threshold = 3,
}: TermSelectorProps) => (
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
