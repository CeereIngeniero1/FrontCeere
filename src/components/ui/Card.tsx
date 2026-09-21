import type { CSSProperties, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
  style?: CSSProperties
}

export function Card({
  children,
  className = '',
  as: Tag = 'div',
  style,
}: CardProps) {
  return (
    <Tag className={`card ${className}`.trim()} style={style}>
      {children}
    </Tag>
  )
}
