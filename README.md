# AI Level Quiz

> **v1.0** — 初版功能已上线，持续迭代中。

一款 AI 使用水平评测 SPA。25 道情景判断题，从**使用深度 (D)**、**认知层次 (C)**、**应用广度 (B)** 三个维度评估你的 AI 协作能力，生成等级、雷达图与个性化建议。

## 截图

### 首页
![首页](https://raw.githubusercontent.com/LocalBlue3306/AI-Rank-Hub/main/image/%E9%A6%96%E9%A1%B5.png)

### 答题
![答题](https://raw.githubusercontent.com/LocalBlue3306/AI-Rank-Hub/main/image/%E7%AD%94%E9%A2%98.png)

### 结果
![结果](https://raw.githubusercontent.com/LocalBlue3306/AI-Rank-Hub/main/image/%E7%BB%93%E6%9E%9C.png)

## 技术栈

- **框架**: React 19 + TypeScript
- **构建**: Vite
- **样式**: Tailwind CSS v3
- **图表**: Recharts
- **测试**: Vitest

## 快速开始

```bash
npm install
npm run dev      # 开发服务器 (http://localhost:5173)
npm run build    # 生产构建
npm run test     # 运行测试
npm run preview  # 预览生产构建
```

## 等级体系

纯门槛驱动，从上到下匹配，命中即停：

| Core Tier | 门槛条件 | 对应等级 |
|-----------|---------|---------|
| Core-5 | D=5 ∧ C=5 ∧ B=5 | Lv.9 / Lv.10 (终极确认题) |
| Core-4 | D≥5 ∧ C≥4 ∧ B≥4 | Lv.7 / Lv.8 |
| Core-3 | B≥3 ∧ D≥3 | Lv.4 / Lv.5 / Lv.6 |
| Core-2 | D≥2 | Lv.2 / Lv.3 |
| Core-1 | 默认 | Lv.0 / Lv.1 |

## 项目结构

```
src/
├── types/               # 全局类型定义
├── data/
│   ├── questions.ts     # 25 道题
│   └── level-mapping.ts # 等级名称、画像文案、建议库
├── engine/              # 算分引擎（纯函数）
│   ├── scorer.ts        # 答案 → 三维得分
│   ├── level-resolver.ts# 三维得分 → 等级判定
│   └── profile.ts       # 偏科画像 + 建议生成
├── components/          # UI 组件
└── App.tsx              # 页面状态机
tests/                   # 单元测试（39 个，100% 通过）
```

## 许可

MIT
