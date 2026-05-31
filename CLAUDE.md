# AI Level Quiz

一款 AI 使用水平评测 SPA。用户答 25 道情景判断题，系统按三个维度独立打分 + 门槛交叉映射给出最终等级、雷达图和后续建议。

## 技术栈

React 19 + Vite + TypeScript + Tailwind CSS v3 + Recharts + Vitest

## 命令

```
npm run dev      # 开发服务器
npm run build    # tsc -b && vite build
npm run test     # vitest run
npm run test:watch
npm run lint     # eslint .
```

## 架构

- **纯客户端 SPA**，无后端，无路由库（react-router）
- 页面切换用 `App.tsx` 内 state machine：`landing → quiz → trophy → result`
- 答题进度持久化到 `localStorage('quiz-state')`，刷新/切后台不丢进度。完成后清除
- Tailwind 自定义色板定义在 `tailwind.config.js`

## 项目结构

```
src/
├── types/index.ts            # 全局类型
├── data/
│   ├── questions.ts          # 25 道题（D1-D8, C1-C8, B1-B8, T1）
│   └── level-mapping.ts      # 等级名称、画像文案、建议库
├── engine/                   # 算分引擎（纯函数，39 tests）
│   ├── scorer.ts             # 答案 → 三维得分（按维度求均值，F 选项不计入）
│   ├── level-resolver.ts     # 三维得分 → Core Tier → 展示等级（门槛驱动）
│   └── profile.ts            # 偏科画像判定 + 建议生成
├── components/               # UI 组件
│   ├── LandingPage.tsx
│   ├── QuizPage.tsx
│   ├── QuestionCard.tsx
│   ├── ProgressBar.tsx
│   ├── TrophyQuestion.tsx
│   ├── ResultPage.tsx
│   ├── LevelBadge.tsx
│   ├── RadarChart.tsx
│   ├── ProfileCard.tsx
│   └── SuggestionList.tsx
└── App.tsx                   # 页面状态机 + 组件编排
tests/                        # Vitest（≥80% 覆盖目标）
```

## 算分引擎规则

**纯门槛驱动，无加权公式。** 从上到下匹配，命中即停：

1. D=5 AND C=5 AND B=5 → Core-5 → 触发终极确认题 → Lv.9 / Lv.10
2. D≥5 AND C≥4 AND B≥4 → Core-4 → 总13→Lv.7 / 总≥14→Lv.8
3. B≥3 AND D≥3 → Core-3 → 总≤8→Lv.4 / 总≥9+D≥4+C≥3→Lv.6 / 兜底→Lv.5
4. D≥2 → Core-2 → 总≤5→Lv.2 / 总≥6→Lv.3
5. 默认 → Core-1 → 总≤3→Lv.0 / 总≥4→Lv.1

详细边界 case 见 `docs/level-mapping2.md` §7。

## 测试

- 框架：Vitest，配置在 `vite.config.ts` 的 `test` 段
- 测试文件匹配 `tests/**/*.test.ts`
- TDD 要求：先写测试再写实现

## 深入文档

| 文档 | 内容 |
|------|------|
| `SPEC.md` | 完整需求规格、数据模型、组件树 |
| `docs/level-mapping2.md` | 等级映射 v2、判定流、13 个边界 case、偏科画像规则 |
| `docs/questions-sample.md` | 题目源材料（已搬运到 `src/data/questions.ts`） |
| `docs/dimension-*-*.md` | 三维度设计文档 |
