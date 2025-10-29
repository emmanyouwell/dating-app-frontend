type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'text'
  | 'blockquote'
  | 'lead'
  | 'small';

type TypographyProps = Readonly<{
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}>;

export function Typography({
  children,
  className = '',
  variant = 'p',
}: TypographyProps) {
  const base = 'text-balance tracking-tight';

  const variants: Record<Variant, string> = {
    // Headings
    h1: `${base} text-4xl sm:text-5xl md:text-6xl font-bold leading-tight scroll-m-20`,
    h2: `${base} text-3xl sm:text-4xl font-bold leading-snug scroll-m-20`,
    h3: `${base} text-2xl sm:text-3xl font-semibold leading-snug scroll-m-20`,
    h4: `${base} text-xl sm:text-2xl font-semibold leading-snug scroll-m-20`,
    h5: `${base} text-lg sm:text-xl font-medium leading-snug scroll-m-20`,
    h6: `${base} text-base sm:text-lg font-medium uppercase tracking-wide text-foreground/70 scroll-m-20`,

    // Paragraphs and text
    p: `text-base sm:text-lg leading-7 text-foreground/90`,
    text: `text-base text-foreground/80`,

    // Supporting text styles
    lead: `text-lg sm:text-xl text-foreground/80`,
    small: `text-sm text-muted-foreground`,

    // Blockquote
    blockquote: `mt-6 border-l-4 border-primary/30 pl-6 italic text-base sm:text-lg text-foreground/80`,
  };

  const Tag =
    variant === 'text' || variant === 'lead' || variant === 'small'
      ? 'span'
      : variant === 'blockquote'
      ? 'blockquote'
      : variant;

  return (
    <Tag className={`${variants[variant]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
