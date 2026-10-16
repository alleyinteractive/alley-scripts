import type { JSX } from 'react';
import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  className?: string;
  html: string;
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
