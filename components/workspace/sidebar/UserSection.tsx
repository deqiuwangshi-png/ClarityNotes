"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { UserMenu, type UserMenuItem } from "@/components/workspace/user-menu/UserMenu";
import { AccountSettingsDialog } from "@/components/workspace/user-menu/AccountSettingsDialog";
import { MembershipDialog } from "@/components/workspace/user-menu/MembershipDialog";

interface UserSectionProps {
  user: { displayName: string; email: string; avatarInitial: string };
  onToggleSidebar: () => void;
}

const MENU_ITEMS: Omit<UserMenuItem, "onClick">[] = [
  { icon: "settings", label: "账号设置" },
  { icon: "notifications", label: "消息通知" },
  { icon: "feedback", label: "产品反馈" },
  { icon: "campaign", label: "更新公告" },
  { icon: "workspace_premium", label: "会员订阅" },
  { icon: "logout", label: "退出登录", danger: true, dividerAbove: true },
];

export function UserSection({ user, onToggleSidebar }: UserSectionProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  const menuItems: UserMenuItem[] = MENU_ITEMS.map((item) => {
    switch (item.label) {
      case "账号设置": return { ...item, onClick: () => setSettingsOpen(true) };
      case "消息通知": return { ...item, onClick: () => console.log("【消息通知】") };
      case "产品反馈": return { ...item, onClick: () => { window.open(process.env.NEXT_PUBLIC_FEISHU_FORM_URL ?? "https://my.feishu.cn/share/base/form/shrcnOikCJSkmGhpqJdD1XKwtFb", "_blank"); } };
      case "更新公告": return { ...item, onClick: () => console.log("【更新公告】") };
      case "会员订阅": return { ...item, onClick: () => setMembershipOpen(true) };
      case "退出登录": return { ...item, onClick: handleLogout };
      default: return { ...item, onClick: () => {} };
    }
  });

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <UserMenu
          items={menuItems}
          displayName={user.displayName}
          displayEmail={user.email}
          avatarChar={user.avatarInitial}
        />
        <button
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-mint-muted transition hover:bg-mint-border/30 hover:text-mint-accent ml-1 cursor-pointer"
          onClick={onToggleSidebar}
          type="button"
          aria-label="折叠侧边栏"
        >
          <span className="material-symbols-outlined text-[18px]">menu</span>
        </button>
      </div>
      {createPortal(
        <AccountSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />,
        document.body,
      )}
      {createPortal(
        <MembershipDialog open={membershipOpen} onClose={() => setMembershipOpen(false)} />,
        document.body,
      )}
    </>
  );
}
