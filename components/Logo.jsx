export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { box: 32, text: 'text-base' },
    md: { box: 44, text: 'text-xl' },
    lg: { box: 72, text: 'text-3xl' },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div
        style={{ width: s.box, height: s.box }}
        className="shrink-0 rounded-xl bg-ink flex items-center justify-center"
      >
        <svg width={s.box * 0.55} height={s.box * 0.55} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21s-7.5-5.1-9.5-9.6C.8 7.7 3 4 6.8 4c2 0 3.5 1.1 4.2 2.4C11.7 5.1 13.2 4 15.2 4 19 4 21.2 7.7 19.5 11.4 17.5 15.9 12 21 12 21z"
            fill="none"
            stroke="#F7F7F5"
            strokeWidth="1.6"
          />
          <circle cx="12" cy="11" r="2.4" fill="#F7F7F5" />
        </svg>
      </div>
      <span className={`font-display ${s.text} tracking-tight text-ink`}>FindIt</span>
    </div>
  );
}
