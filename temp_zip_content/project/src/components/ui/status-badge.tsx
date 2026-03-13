interface StatusBadgeProps {
  label: string;
  status: string;
  className?: string;
}

export function StatusBadge({ label, status, className = '' }: StatusBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-ultra-wide ${className}`}>
      <span className="text-gray-500">{label}:</span>
      <span className="text-accent-purple-bright" style={{ textShadow: '0 0 15px rgba(168, 85, 247, 0.6)' }}>{status}</span>
      <span className="w-2 h-2 bg-accent-purple-bright animate-pulse rounded-sm" />
    </div>
  );
}
