export function Field({ label, hint, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-medium text-ink mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-muted mt-1">{hint}</span>}
    </label>
  );
}

export function Input({ icon: Icon, className = '', ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
      )}
      <input
        className={`w-full rounded-xl border border-line bg-card px-3.5 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-ink transition-colors ${
          Icon ? 'pl-10' : ''
        } ${className}`}
        {...props}
      />
    </div>
  );
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl border border-line bg-card px-3.5 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-ink transition-colors resize-none ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full rounded-xl border border-line bg-card px-3.5 py-3 text-sm text-ink focus:border-ink transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
