import type { NavLink, HeroBadge, Feature, PhilosophyPoint, Testimonial, Stat, FooterSection } from "@/types/landing"

export const NAV_LINKS: NavLink[] = [
  { label: "功能", href: "#features" },
  { label: "设计哲学", href: "#philosophy" },
  { label: "定价", href: "#pricing" },
  { label: "部落格", href: "/blog" },
]

export const HERO_BADGE: HeroBadge = {
  icon: "psychiatry",
  text: "认知优先 · 无干扰书写",
}

export const HERO_TITLE = "让思绪自由流动\n构建个人系统"

export const HERO_DESCRIPTION =
  "ClarityNotes 不只是笔记工具。它帮助你记录知识、整理思考、沉淀经验，并通过扁平化组织与极速搜索，逐步构建属于自己的个人知识操作系统。。"

export const FEATURES: Feature[] = [
  {
    icon: "psychology",
    title: "认知负荷管理",
    description: "最小视觉干扰，智能提示及动态大纲，帮助您在复杂信息中保持心流。",
  },
  {
    icon: "speed",
    title: "毫秒级全局搜索",
    description: "智能全文检索、标签联想，数百篇笔记瞬间定位，消除整理焦虑。",
  },
  {
    icon: "checklist",
    title: "任务即笔记",
    description: "待办事项与笔记深度融合，灵活嵌套大纲，让行动与思考无缝衔接。",
  },
  {
    icon: "cloud_sync",
    title: "端到端加密同步",
    description: "跨设备实时同步，隐私优先，您的内容只有您能访问。",
  },
]

export const PHILOSOPHY_BADGE = "设计哲学"
export const PHILOSOPHY_TITLE = "温柔聚焦，而非冰冷高效"
export const PHILOSOPHY_DESCRIPTION =
  "ClarityNotes 借鉴了薄荷调色板与细腻的空间留白。我们相信，知识工作者的压力往往源于界面的压迫感。因此，我们使用柔和阴影、32px 超大圆角和没有侵略性的边框，让您的思绪如同一张无限的白纸。"

export const PHILOSOPHY_POINTS: PhilosophyPoint[] = [
  { icon: "palette", text: "全自定义主题 & 动态深色模式" },
  { icon: "font_download", text: "Inter 专属排版 + 舒适行距 1.6" },
  { icon: "radio_button_unchecked", text: "大纲连线 & 聚焦焦点模式" },
]

export const TESTIMONIAL: Testimonial = {
  quote:
    "以前我的知识散落在文档、聊天记录和浏览器收藏夹中。现在所有内容都归档在一个统一空间里，需要时总能快速找到。",
  author: "产品设计师 · 李心怡",
}

export const STATS: Stat[] = [
  { value: "∞", label: "知识复利增长" },
  { value: "1", label: "个人知识中枢" },
  { value: "100%", label: "思考自主掌控" },
  { value: "0", label: "信息散落焦虑" },
]

export const CTA_TITLE = "准备好清晰思考了吗？"
export const CTA_DESCRIPTION =
  "加入数千名设计师、写作者和思考者，体验真正无压的笔记工具。"
export const CTA_FOOTNOTE = "无需信用卡 · 14 天全功能体验 · 随时取消"

export const FEATURE_TAGS: string[] = ["零干扰编辑器", "全局闪电搜索", "扁平化大纲"]

export const FOOTER_SECTIONS: Record<string, FooterSection> = {
  product: { title: "产品", links: [
    { label: "功能", href: "#" },
    { label: "定价", href: "#" },
    { label: "更新日志", href: "#" },
    { label: "下载客户端", href: "#" },
  ]},
  resources: { title: "资源", links: [
    { label: "帮助中心", href: "#" },
    { label: "博客", href: "#" },
    { label: "设计系统", href: "#" },
    { label: "社区指南", href: "#" },
  ]},
  company: { title: "公司", links: [
    { label: "关于我们", href: "#" },
    { label: "隐私条款", href: "#" },
    { label: "品牌资料", href: "#" },
  ]},
}

export const SOCIAL_ICONS = ["alternate_email", "rss_feed", "chat"] as const
