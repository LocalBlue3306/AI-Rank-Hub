# AI Level Quiz — SPEC

## 项目目标

一款 AI 使用水平评测网站（类似 MBTI 风格）。用户答 25 道情景判断题，系统按三个维度独立打分 + 门槛交叉映射给出最终等级、雷达图和后续建议。

## 技术栈

- React 18 + Vite + TypeScript
- Tailwind CSS — 样式
- Recharts — 雷达图
- Vitest — 测试（≥80% 覆盖）
- 纯客户端 SPA，无后端，无持久化

## 项目结构

```
ai-level-quiz/
├── SPEC.md
├── PLAN.md
├── README.md
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                 # Tailwind 入口
│   ├── data/
│   │   ├── questions.ts          # 25 道题（TS 模块）
│   │   └── level-mapping.ts      # 等级名称和画像文案
│   ├── engine/
│   │   ├── scorer.ts             # 评分引擎：答案 → 三维得分
│   │   ├── level-resolver.ts     # 等级判定：三维得分 → Core Tier → 展示等级
│   │   └── profile.ts            # 偏科画像判定 + 建议生成
│   ├── components/
│   │   ├── LandingPage.tsx        # 入口页
│   │   ├── QuizPage.tsx           # 答题页（逐题展示 + 进度条）
│   │   ├── QuestionCard.tsx       # 单道题的场景 + 选项
│   │   ├── ProgressBar.tsx        # 进度指示
│   │   ├── ResultPage.tsx         # 结果页
│   │   ├── RadarChart.tsx         # 三维雷达图（Recharts）
│   │   ├── LevelBadge.tsx         # 等级徽章（Lv.X + 名称）
│   │   ├── ProfileCard.tsx        # 偏科画像卡片
│   │   ├── SuggestionList.tsx     # 建议列表
│   │   └── TrophyQuestion.tsx     # 终极确认题（条件渲染）
│   └── types/
│       └── index.ts               # 全局类型定义
└── tests/
    ├── scorer.test.ts
    ├── level-resolver.test.ts
    └── profile.test.ts
```

## 数据模型

### 原始类型

```typescript
type Dimension = 'D' | 'C' | 'B';
type DimensionScore = 1 | 2 | 3 | 4 | 5;
type DisplayLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type CoreTier = 1 | 2 | 3 | 4 | 5;
```

### 题目模型

```typescript
interface Question {
  id: string;                    // e.g. "D1", "C4", "B3"
  dimension: Dimension;
  scenario: string;              // 场景描述
  options: Option[];
}

interface Option {
  label: string;                 // "A" | "B" | "C" | "D" | "E" | "F"
  text: string;
  level?: DimensionScore;        // F 选项无 level，选 F 该题不参与该维度计分
}
```

### 答题状态

```typescript
interface Answer {
  questionId: string;
  selectedOption: string;
}

interface QuizState {
  currentIndex: number;
  answers: Answer[];
}

// 持久化：每次选择后 JSON.stringify 存入 localStorage('quiz-state')
// App 初始化时尝试从 localStorage 恢复，实现刷新/切后台不丢进度
```

### 评分结果

```typescript
interface ScoreResult {
  D: DimensionScore;
  C: DimensionScore;
  B: DimensionScore;
  total: number;
}

interface LevelResult {
  coreTier: CoreTier;
  displayLevel: DisplayLevel | null;  // null when pendingTrophy
  name: string;
  description: string;
  pendingTrophy?: boolean;
}

interface ProfileResult {
  type: string;                  // e.g. "机械执行者", "全能型"
  description: string;
  suggestions: string[];
}
```

## 算分引擎

### scorer.ts — 答案转三维得分

按维度分组答案，计算有效选项等级的**均值**，四舍五入到整数。F 选项（"没遇到过"）不计入。均值比众数更抗平坦分布异常（如 [1,2,3,5] → 均值 2.75 → Lv3，而非平局取高得 Lv5）。

### level-resolver.ts — 三维得分转展示等级

实现 `docs/level-mapping2.md` §1.2 的判定流。纯门槛驱动，从上到下匹配，命中即停：

```
1. D=5 AND C=5 AND B=5 → Core-5 → pendingTrophy=true
2. D≥5 AND C≥4 AND B≥4 → Core-4 → 总13→Lv.7 / 总≥14→Lv.8
3. B≥3 AND D≥3 → Core-3 → 总≤8→Lv.4 / 总≥9+D≥4+C≥3→Lv.6 / 兜底→Lv.5
4. D≥2 → Core-2 → 总≤5→Lv.2 / 总≥6→Lv.3
5. 默认 → Core-1 → 总≤3→Lv.0 / 总≥4→Lv.1
```

### profile.ts — 偏科画像 + 建议

实现 `docs/level-mapping2.md` §4-5：偏科检测 → 按最低维度优先生成建议。

## 组件树 & 页面流

```
App (pageState machine)
├── LandingPage          # 入口：名称 + 一句话介绍 + 开始按钮
├── QuizPage             # 答题主流程（每次选择后自动写 localStorage）
│   ├── ProgressBar      # "第 3/25 题"
│   └── QuestionCard     # 场景 + 选项列表（点击选中 + 下一题）
├── TrophyQuestion       # 仅当 pendingTrophy=true 时展示
└── ResultPage           # 结果页
    ├── LevelBadge       # "Lv.7 铸造师"
    ├── RadarChart       # 三维雷达图（Recharts）
    ├── ProfileCard      # 偏科画像
    └── SuggestionList   # 建议
```

页面切换用简单 state machine（`'landing' | 'quiz' | 'trophy' | 'result'`），不用 react-router。

## 实现阶段

### Phase 1: 项目骨架
- npm create vite@latest 初始化
- 装依赖：tailwind, recharts, vitest
- 建目录结构
- types/index.ts — 类型定义
- data/questions.ts — 题目数据（从 questions-sample.md 搬运）
- data/level-mapping.ts — 等级名称和画像文案

### Phase 2: 算分引擎 + 测试
- engine/scorer.ts → TDD
- engine/level-resolver.ts → 验证 13 个边界 case
- engine/profile.ts → 验证偏科判定

### Phase 3: UI 组件
- LandingPage → QuizPage + QuestionCard + ProgressBar → TrophyQuestion → ResultPage
- Tailwind 样式（移动端优先，375px 起）
- 结果页雷达图

### Phase 4: 集成验证
- 完整链路：入口 → 答完全部题 → 看到结果页
- 手动测试几个典型组合

## 验证标准

1. `npm test` — 算分引擎单元测试全部通过
2. 手动完整答题一次，确认等级与三维得分一致
3. 移动端显示效果（375px）
4. `npm run build` 无报错
