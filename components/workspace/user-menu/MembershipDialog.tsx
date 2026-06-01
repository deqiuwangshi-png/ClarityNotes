import { Modal } from "@/components/ui/modal";

interface MembershipDialogProps {
  open: boolean;
  onClose: () => void;
}

const PLANS = [
  { key: "free", name: "免费版", price: "¥0", period: "/月", desc: "适合个人日常使用", features: ["最多 3 个文档空间", "100 MB 存储空间", "基础 Markdown 编辑", "本地离线访问"], highlighted: false },
  { key: "pro", name: "专业版", price: "¥29", period: "/月", desc: "适合进阶知识工作者", features: ["无限文档空间", "50 GB 存储空间", "高级富文本编辑器", "版本历史与对比", "设备间实时同步", "AI 智能摘要"], highlighted: true },
  { key: "team", name: "团队版", price: "¥99", period: "/月", desc: "适合团队知识管理", features: ["包含专业版全部功能", "200 GB / 人存储空间", "团队空间与权限管理", "协作编辑与评论", "API 与 Webhook 集成", "专属客户支持"], highlighted: false },
];

export function MembershipDialog({ open, onClose }: MembershipDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title="会员订阅" width="xl">
      <div className="p-6">
        <div className="mb-8 text-center">
          <h3 className="text-xl font-bold text-mint-text">选择适合你的计划</h3>
          <p className="mt-1 text-sm text-mint-muted">当前使用 <span className="font-semibold text-mint-accent">免费版</span>，随时升级解锁更多功能</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div key={plan.key} className={`relative flex flex-col rounded-2xl border p-6 ${plan.highlighted ? "border-mint-accent/40 bg-mint-hover/30 shadow-md" : "border-mint-border/20 bg-white"}`}>
              {plan.highlighted && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-mint-accent px-3 py-0.5 text-[11px] font-semibold text-white shadow-sm">推荐</div>}
              <div className="mb-4">
                <h4 className="text-base font-bold text-mint-text">{plan.name}</h4>
                <div className="mt-2 flex items-baseline gap-0.5">
                  <span className="text-3xl font-bold text-mint-text">{plan.price}</span>
                  <span className="text-xs text-mint-muted">{plan.period}</span>
                </div>
                <p className="mt-1 text-xs text-mint-muted">{plan.desc}</p>
              </div>
              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <span className="material-symbols-outlined mt-0.5 text-[16px] text-mint-accent">check_circle</span>
                    <span className="text-xs text-mint-text">{feat}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full rounded-xl py-2.5 text-sm font-semibold transition cursor-pointer ${plan.highlighted ? "bg-mint-accent text-white shadow-sm hover:bg-mint-accent/90" : "border border-mint-border/30 text-mint-text hover:bg-mint-hover/50"}`} type="button" onClick={() => console.log(`【选择套餐】${plan.name}`)}>{plan.key === "free" ? "当前使用" : "立即升级"}</button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
