import type { SelectHTMLAttributes } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Option[]
  error?: string
}

export function Select({
  label,
  id,
  options,
  error,
  className = '',
  ...props
}: SelectProps) {
  const selectId = id ?? props.name
  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={selectId}>{label}</label>
      <select id={selectId} aria-invalid={Boolean(error)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  )
}
