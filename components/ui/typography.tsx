type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'text' | 'blockquote';

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
  const variants: Record<Variant, string> = {
    h1: 'scroll-m-20 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance',
    h2: 'scroll-m-20 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-lg sm:text-xl md:text-2xl font-semibold tracking-tight',
    p: 'text-base sm:text-lg leading-7',
    text: 'text-base',
    blockquote: 'mt-6 border-l-2 pl-6 italic text-base sm:text-lg md:mt-4',
  };

  const Tag =
    variant === 'text'
      ? 'span'
      : variant === 'blockquote'
      ? 'blockquote'
      : variant;
  return (
    <Tag className={`${variants[variant] || variants.p} ${className}`}>
      {children}
    </Tag>
  );
}
