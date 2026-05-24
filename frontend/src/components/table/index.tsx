import type { FC, ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react'

export const Table: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <table className={`min-w-full ${className}`}>{children}</table>
)

export const TableHeader: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <thead className={className}>{children}</thead>

export const TableBody: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <tbody className={className}>{children}</tbody>

export const TableRow: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <tr className={className}>{children}</tr>

export const TableCell: FC<
  { children: ReactNode; isHeader?: boolean; className?: string; colSpan?: number } & (
    | ThHTMLAttributes<HTMLTableCellElement>
    | TdHTMLAttributes<HTMLTableCellElement>
  )
> = ({ children, isHeader, className = '', colSpan, ...props }) => {
  const Tag = isHeader ? 'th' : 'td'
  return (
    <Tag className={className} colSpan={colSpan} {...props}>
      {children}
    </Tag>
  )
}
