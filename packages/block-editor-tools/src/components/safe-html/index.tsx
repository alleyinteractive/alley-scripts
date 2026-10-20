import type { ElementType } from 'react';
import DOMPurify from 'dompurify';

export interface SafeHTMLProps {
  className?: string;
  html: string;
  tag: ElementType;
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
