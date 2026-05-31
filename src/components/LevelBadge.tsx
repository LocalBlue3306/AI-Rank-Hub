import type { LevelResult } from '../types'

interface LevelBadgeProps {
  result: LevelResult
}

export default function LevelBadge({ result }: LevelBadgeProps) {
  return (
    <div className="text-center mb-10">
      <p className="text-xs tracking-widest uppercase text-text-dim mb-3">
        Core Tier {result.coreTier}
      </p>
      <div className="text-7xl font-light tracking-tight text-white mb-3">
        Lv.{result.displayLevel}
      </div>
      <h2 className="text-2xl font-medium text-zinc-200 mb-2">
        {result.name}
      </h2>
      <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
        {result.description}
      </p>
    </div>
  )
}
