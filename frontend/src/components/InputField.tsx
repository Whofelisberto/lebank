import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function InputField({ label, error, id, ...props }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        id={inputId}
        {...props}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all
          ${
            error
              ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
              : 'border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
          }
          ${props.className ?? ''}`}
      />
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}
