interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export default function StatCard({ value, label, className = '' }: StatCardProps) {
  return (
    <div className={`text-center p-8 rounded-[var(--radius-card)] bg-[var(--bg-card)] border border-[var(--border)] ${className}`}>
      <p className="font-heading text-4xl md:text-5xl font-bold text-gold mb-3">{value}</p>
      <p className="label-upper text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
