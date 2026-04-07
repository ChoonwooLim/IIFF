interface DataTableProps {
  headers: string[];
  rows: string[][];
  className?: string;
  compact?: boolean;
  'aria-label'?: string;
}

export default function DataTable({ headers, rows, className = '', compact = false, 'aria-label': ariaLabel }: DataTableProps) {
  return (
    <div className={`overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border)] ${className}`}>
      <table className="w-full text-left" aria-label={ariaLabel}>
        <thead>
          <tr className="bg-gradient-to-r from-gold/10 to-gold/5 border-b border-[var(--border)]">
            {headers.map((h, i) => (
              <th
                key={i}
                scope="col"
                className={`${compact ? 'px-2 py-2 md:px-4 md:py-3 text-xs' : 'px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm'} font-medium text-gold tracking-wide`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors duration-200"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`${compact ? 'px-2 py-2 md:px-4 md:py-3 text-xs' : 'px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm'} text-[var(--text-dim)]`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
