interface OrgNode {
  title: string;
  role?: string;
  children?: OrgNode[];
}

interface OrgChartProps {
  data: OrgNode;
  className?: string;
}

function OrgNodeCard({ node, level = 0 }: { node: OrgNode; level?: number }) {
  const isRoot = level === 0;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          px-6 py-4 rounded-[var(--radius-sm)] border text-center
          ${isRoot
            ? 'bg-gold/10 border-gold/30 min-w-[200px]'
            : 'bg-[var(--bg-card)] border-[var(--border)] min-w-[160px]'
          }
        `}
      >
        <p className={`text-sm font-medium ${isRoot ? 'text-gold' : 'text-[var(--text)]'}`}>
          {node.title}
        </p>
        {node.role && (
          <p className="text-xs text-[var(--text-muted)] mt-1">{node.role}</p>
        )}
      </div>

      {node.children && node.children.length > 0 && (
        <>
          <div className="w-px h-6 bg-[var(--border-gold)]" />
          <div className="flex gap-4 flex-wrap justify-center">
            {node.children.map((child, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-px h-4 bg-[var(--border)]" />
                <OrgNodeCard node={child} level={level + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OrgChart({ data, className = '' }: OrgChartProps) {
  return (
    <div className={`flex justify-center overflow-x-auto py-8 ${className}`}>
      <OrgNodeCard node={data} />
    </div>
  );
}
