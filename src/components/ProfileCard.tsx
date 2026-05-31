import type { ProfileResult } from '../types'

interface ProfileCardProps {
  profile: ProfileResult
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="border border-border px-5 py-4 mb-6">
      <p className="text-xs tracking-widest uppercase text-text-dim mb-2">
        偏科画像
      </p>
      <h3 className="text-lg font-medium text-zinc-200 mb-1">
        {profile.type}
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        {profile.description}
      </p>
    </div>
  )
}
