interface HeroSectionProps {
  label: string;
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  overlay?: 'dark' | 'gradient' | 'none';
  height?: 'full' | 'half' | 'auto';
  children?: React.ReactNode;
}

export default function HeroSection({
  label,
  title,
  description,
  imageSrc,
  imageAlt = '',
  overlay = 'gradient',
  height = 'half',
  children,
}: HeroSectionProps) {
  const heightClass = {
    full: 'min-h-screen',
    half: 'min-h-[60vh]',
    auto: 'py-[var(--section-padding)]',
  }[height];

  return (
    <section className={`relative w-full ${heightClass} flex items-center overflow-hidden`}>
      {/* Background Image */}
      {imageSrc && (
        <div className="absolute inset-0 z-0">
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="eager"
            className="object-cover w-full h-full"
          />
          {overlay === 'dark' && (
            <div className="absolute inset-0 bg-[var(--bg)]/80" />
          )}
          {overlay === 'gradient' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-[var(--bg)]/50" />
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-[var(--content-max)] mx-auto px-6 md:px-10 py-20">
        <p className="label-upper text-gold mb-6">{label}</p>
        <h2 className="heading-display text-4xl md:text-6xl lg:text-7xl text-[var(--text)] mb-8 max-w-3xl">
          {title}
        </h2>
        {description && (
          <p className="text-body text-[var(--text-dim)] text-lg max-w-2xl">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
