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
        <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
      )}
      <input
        className={`w-full rounded-2xl border border-line bg-[#F9FAFB] px-4 py-3.5 text-[15px] text-ink placeholder:text-muted/60 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all ${
          Icon ? 'pl-11' : ''
        } ${className}`}
        {...props}
      />
    </div>
  );
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full rounded-2xl border border-line bg-[#F9FAFB] px-4 py-3.5 text-[15px] text-ink placeholder:text-muted/60 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all resize-none ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full appearance-none rounded-2xl border border-line bg-[#F9FAFB] px-4 py-3.5 text-[15px] text-ink focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
