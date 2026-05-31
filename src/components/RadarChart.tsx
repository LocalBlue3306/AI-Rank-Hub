import {
  Radar,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import type { ScoreResult } from '../types'

interface RadarChartProps {
  scores: ScoreResult
}

export default function RadarChart({ scores }: RadarChartProps) {
  const data = [
    { dimension: '使用深度', score: scores.D, fullMark: 5 },
    { dimension: '认知层次', score: scores.C, fullMark: 5 },
    { dimension: '应用广度', score: scores.B, fullMark: 5 },
  ]

  return (
    <div className="w-full max-w-xs mx-auto mb-10">
      <ResponsiveContainer width="100%" height={240}>
        <ReRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#a1a1aa', fontSize: 13 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fill: '#52525b', fontSize: 10 }}
            tickCount={6}
            stroke="#27272a"
          />
          <Radar
            name="得分"
            dataKey="score"
            stroke="#a78bfa"
            fill="#a78bfa"
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
