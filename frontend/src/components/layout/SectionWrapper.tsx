import { ReactNode } from 'react';

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
  alt?: boolean;
  fullWidth?: boolean;
}

export default function SectionWrapper({
  id,
  children,
  className = '',
  alt = false,
  fullWidth = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative w-full py-[var(--section-padding)] overflow-hidden ${
        alt ? 'bg-[var(--bg-alt)]' : 'bg-[var(--bg)]'
      } ${className}`}
    >
      <div
        className={`mx-auto px-6 md:px-10 ${
          fullWidth ? 'max-w-[var(--content-wide)]' : 'max-w-[var(--content-max)]'
        }`}
      >
        {children}
      </div>
    </section>
  );
}
