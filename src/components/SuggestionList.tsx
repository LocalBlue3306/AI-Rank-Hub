interface SuggestionListProps {
  suggestions: string[]
}

export default function SuggestionList({ suggestions }: SuggestionListProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="border border-border px-5 py-4">
      <p className="text-xs tracking-widest uppercase text-text-dim mb-3">
        下一步
      </p>
      <ul className="space-y-2">
        {suggestions.map((s, i) => (
          <li key={i} className="text-sm text-zinc-400 leading-relaxed flex gap-2">
            <span className="text-text-dim shrink-0">{i + 1}.</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
