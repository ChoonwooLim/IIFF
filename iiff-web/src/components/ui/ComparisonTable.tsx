'use client';

interface ComparisonItem {
  category: string;
  iiff: string;
  competitor: string;
}

interface ComparisonTableProps {
  title?: string;
  competitorName?: string;
  items: ComparisonItem[];
  className?: string;
}

export default function ComparisonTable({
  title,
  competitorName = 'BIFF',
  items,
  className = '',
}: ComparisonTableProps) {
  return (
    <div className={className}>
      {title && (
        <h3 className="heading-section text-xl text-[var(--text)] mb-6">{title}</h3>
      )}
      <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border)]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-6 py-4 text-sm font-medium text-[var(--text-muted)] w-1/3">항목</th>
              <th className="px-6 py-4 text-sm font-medium text-gold w-1/3">IIFF</th>
              <th className="px-6 py-4 text-sm font-medium text-[var(--text-muted)] w-1/3">{competitorName}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-[var(--border)] last:border-0">
                <td className="px-6 py-4 text-sm font-medium text-[var(--text)]">{item.category}</td>
                <td className="px-6 py-4 text-sm text-gold">{item.iiff}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-dim)]">{item.competitor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
