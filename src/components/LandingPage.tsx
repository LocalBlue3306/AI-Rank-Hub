interface LandingPageProps {
  onStart: () => void
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-20 text-center">
      <h1 className="text-4xl font-light tracking-tight text-zinc-100">
        你的 AI 使用水平在<em className="font-medium text-white not-italic">哪一级</em>
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
        25 道情景判断题，从使用深度、认知水平和应用广度三个维度，评估你的 AI 协作能力等级。
      </p>
      <button
        onClick={onStart}
        className="mt-10 inline-flex items-center gap-2 border border-zinc-700 px-9 py-3 text-sm uppercase tracking-wider text-zinc-300 transition hover:border-zinc-500 hover:text-white"
      >
        开始评测 →
      </button>
    </div>
  )
}
