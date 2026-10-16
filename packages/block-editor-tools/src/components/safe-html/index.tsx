import type { JSX } from 'react';
import DOMPurify from 'dompurify';

export interface SafeHTMLProps {
  className?: string;
  /**
   * The HTML to sanitize and render.
   */
  html: string;
  /**
   * The tag name of the wrapping element, e.g. `div`.
   */
  tag: keyof JSX.IntrinsicElements;
}

const SafeHTML = ({
  className = '',
  html,
  tag: Tag,
}: SafeHTMLProps) => (
  <Tag
    className={className}
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(html),
    }}
  />
);

export default SafeHTML;
