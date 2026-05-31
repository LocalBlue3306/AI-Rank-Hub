import type { DimensionScore, DisplayLevel } from '../types'

// ============================================================
// 展示等级信息
// ============================================================

export interface LevelInfo {
  level: DisplayLevel
  name: string
  description: string
}

export const LEVEL_INFO: Record<DisplayLevel, LevelInfo> = {
  0: { level: 0, name: '旁观者', description: '听过 AI 但没用过' },
  1: { level: 1, name: '尝鲜者', description: '刚开始用，给啥用啥，不会问' },
  2: { level: 2, name: '对话者', description: '会追问、会给角色指令、知道 Prompt 这个词' },
  3: { level: 3, name: '驯化师', description: '结构化 Prompt + 多模型分工 + 会约束 AI' },
  4: { level: 4, name: '越境者', description: '用 AI 做专业外的事，能力边界在扩张' },
  5: { level: 5, name: '织网者', description: 'AI 嵌入工作流，有 Prompt 库和项目知识库' },
  6: { level: 6, name: '召唤师', description: '从 ChatBot 跨到 Agent，开始用 Claude Code 等工具' },
  7: { level: 7, name: '铸造师', description: '自己做 Skill/Agent，设计反馈循环，投资基础设施' },
  8: { level: 8, name: '造物主', description: 'AI 不再是工具而是工作方式，产出逼近专业水准' },
  9: { level: 9, name: '觉醒者', description: 'AI 成为思维方式，人机协作原生' },
  10: { level: 10, name: '一人军团', description: '一个人的产出 = 一个团队' },
}

export function getLevelInfo(level: DisplayLevel): LevelInfo {
  return LEVEL_INFO[level]
}

// ============================================================
// 偏科画像
// ============================================================

export interface ProfileDef {
  type: string
  description: string
}

export const PROFILE_DEFS: Record<string, ProfileDef> = {
  '机械执行者': { type: '机械执行者', description: '工具用得溜但不懂判断质量，AI 说什么信什么' },
  '理论派': { type: '理论派', description: '懂很多但动手少，分析头头是道实际产出少' },
  '浅尝辄止者': { type: '浅尝辄止者', description: '什么领域都试过，什么领域都不深，每次都裸问' },
  '深度专家': { type: '深度专家', description: '在自己一亩三分地里挖到极深，但从不出圈' },
  '纸上谈兵': { type: '纸上谈兵', description: '理解很深，但只在少数场景用，没扩张' },
  '全能型': { type: '全能型', description: '均衡发展，无明显短板' },
  '入门型': { type: '入门型', description: '全面起步阶段' },
  '发展中': { type: '发展中', description: '正在形成稳定的能力结构' },
}

// ============================================================
// 建议文案（按最低维度）
// ============================================================

export const SUGGESTIONS_BY_DIMENSION: Record<string, string[]> = {
  D: [
    '学会追问和补充背景——AI 答得不好时不要直接放弃',
    '给自己最高频的 3 个场景各写一个固定 Prompt 模板',
    '为一个重复性任务搭建固定工作流，从"每次裸问"升级到"模板驱动"',
  ],
  C: [
    '每次使用 AI 强制加一步验证——事实类数据自己核实，代码跑一遍',
    '学会诊断"这次为什么出错"——是 Prompt 问题还是模型局限',
    '了解幻觉的常见模式、不同模型的核心差异、什么时候该信任/不该信任 AI',
  ],
  B: [
    '从当前主场景外，再扩 2-3 个稳定使用场景',
    '选一个跟自己专业完全无关的小项目，用 AI 做出完整结果',
    '不追求多装工具，先追求跨类别任务迁移',
  ],
  allHigh: [
    '从"自己高效"走向"让别人也能复用"——把经验封装成模板、知识库或 SOP',
    '思考你的 AI 系统能不能服务更多人——开源、教程、团队推广',
  ],
}

export function pickSuggestions(
  scores: { D: DimensionScore; C: DimensionScore; B: DimensionScore }
): string[] {
  const { D, C, B } = scores
  const minScore = Math.min(D, C, B)

  const candidates = [D, C, B]
    .map((s, i) => ({ score: s, dim: ['D', 'C', 'B'][i] }))
    .filter(({ score }) => score === minScore)

  // 多个最低维度时合并建议，每维度取 1 条
  if (candidates.length > 1) {
    return candidates.flatMap(({ dim }) => SUGGESTIONS_BY_DIMENSION[dim].slice(0, 1))
  }

  return SUGGESTIONS_BY_DIMENSION[candidates[0].dim].slice(0, 2)
}
