export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const base =
    'w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-ink text-paper hover:bg-ink2',
    secondary: 'bg-transparent text-ink border border-ink/20 hover:bg-line/50',
    ghost: 'bg-line/40 text-ink hover:bg-line/70',
    lost: 'bg-lost text-paper hover:opacity-90',
    found: 'bg-found text-paper hover:opacity-90',
  };

  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
