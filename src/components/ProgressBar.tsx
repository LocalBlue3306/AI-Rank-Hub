interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-xs text-text-dim mb-2">
        <span>
          第 {current}/{total} 题
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-0.5 w-full bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-white/80 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
