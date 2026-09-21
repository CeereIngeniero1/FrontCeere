import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function Textarea({
  label,
  id,
  error,
  className = '',
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name
  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={textareaId}>{label}</label>
      <textarea id={textareaId} aria-invalid={Boolean(error)} {...props} />
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  )
}
