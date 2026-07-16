export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const base =
    'w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-[15px] font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-primary text-white shadow-sm hover:shadow-md hover:bg-blue-700',
    secondary: 'bg-white text-ink border border-line shadow-sm hover:bg-gray-50',
    ghost: 'bg-transparent text-muted hover:bg-gray-100 hover:text-ink',
    lost: 'bg-lost text-white shadow-sm hover:shadow-md hover:opacity-90',
    found: 'bg-found text-white shadow-sm hover:shadow-md hover:opacity-90',
  };

  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
