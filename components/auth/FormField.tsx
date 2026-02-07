interface FormFieldProps {
  id: string;
  label: string;
  name?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}

export default function FormField({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-[0.16em] text-black/60"
      >
        {label}
      </label>
      <input
        id={id}
        name={name ?? id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-black shadow-sm outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/10"
      />
    </div>
  );
}
