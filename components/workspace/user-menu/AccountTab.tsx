"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { validateOldPassword, updatePassword } from "@/lib/services/userService";
import {
  validateFullName,
  validatePhone,
  validateEmail,
  validatePasswordStrength,
  validateConfirmPassword,
} from "@/utils/validators";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Toast } from "@/components/ui/toast";
import { MembershipDialog } from "@/components/workspace/user-menu/MembershipDialog";

function maskPhone(phone: string): string {
  return `+86 ${phone.slice(0, 3)}****${phone.slice(7)}`;
}

export function AccountTab() {
  const { user, updateUser, logoutAndClear } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(user?.fullName ?? "临时账号");
  const [displayEmail, setDisplayEmail] = useState(user?.email ?? "user@example.com");
  const [displayAvatar, setDisplayAvatar] = useState(user?.avatar ?? "用");
  const uid = user?.uid ?? "";

  const [membershipOpen, setMembershipOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileAvatarPreview, setProfileAvatarPreview] = useState<string | null>(null);
  const [profileAvatarFile, setProfileAvatarFile] = useState<File | null>(null);
  const [profileNameError, setProfileNameError] = useState("");

  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneDisplay, setPhoneDisplay] = useState(
    user?.phone ? maskPhone(user.phone) : "+86 138****0000"
  );
  const [phoneError, setPhoneError] = useState("");

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [deleteInput, setDeleteInput] = useState("");
  const [deleteChecked, setDeleteChecked] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const openProfileModal = () => {
    setProfileName(displayName);
    setProfileAvatarPreview(null);
    setProfileAvatarFile(null);
    setProfileNameError("");
    setProfileModalOpen(true);
  };

  const handleAvatarFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setProfileAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const error = validateFullName(profileName);
    if (error) {
      setProfileNameError(error);
      return;
    }
    setProfileNameError("");
    const trimmed = profileName.trim();
    setDisplayName(trimmed);
    if (profileAvatarFile) {
      const firstChar = trimmed.charAt(0);
      setDisplayAvatar(firstChar);
      updateUser({ fullName: trimmed, avatar: firstChar });
    } else {
      updateUser({ fullName: trimmed });
    }
    setProfileModalOpen(false);
    triggerToast("个人信息修改成功");
  };

  const openPhoneModal = () => {
    setPhoneInput("");
    setPhoneError("");
    setPhoneModalOpen(true);
  };

  const handleSavePhone = () => {
    const error = validatePhone(phoneInput);
    if (error) {
      setPhoneError(error);
      return;
    }
    setPhoneError("");
    setPhoneDisplay(maskPhone(phoneInput));
    updateUser({ phone: phoneInput });
    setPhoneModalOpen(false);
    triggerToast("手机号修改成功");
  };

  const openEmailModal = () => {
    setEmailInput(displayEmail);
    setEmailError("");
    setEmailModalOpen(true);
  };

  const handleSaveEmail = () => {
    const error = validateEmail(emailInput);
    if (error) {
      setEmailError(error);
      return;
    }
    setEmailError("");
    setDisplayEmail(emailInput);
    updateUser({ email: emailInput });
    setEmailModalOpen(false);
    triggerToast("邮箱修改成功");
  };

  const openPasswordModal = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setPasswordModalOpen(true);
  };

  const handleSavePassword = () => {
    if (!user) return;
    let hasError = false;

    if (!validateOldPassword(user, oldPassword)) {
      setOldPasswordError("原密码不正确");
      hasError = true;
    } else {
      setOldPasswordError("");
    }

    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) {
      setNewPasswordError(strengthError);
      hasError = true;
    } else {
      setNewPasswordError("");
    }

    const confirmError = validateConfirmPassword(newPassword, confirmPassword);
    if (confirmError) {
      setConfirmPasswordError(confirmError);
      hasError = true;
    } else {
      setConfirmPasswordError("");
    }

    if (hasError) return;

    updatePassword(user.id, newPassword);
    setPasswordModalOpen(false);
    triggerToast("密码修改成功");
  };

  const openDeleteModal = () => {
    setDeleteInput("");
    setDeleteChecked(false);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteAccount = () => {
    logoutAndClear();
    router.push("/");
  };

  const deleteCanConfirm = deleteInput === "我已经知晓" && deleteChecked;

  return (
    <>
      <div className="space-y-8">
        <div>
          <h3 className="mb-1 text-base font-semibold text-mint-text">个人信息</h3>
          <p className="mb-4 text-xs text-mint-muted">修改你的头像、用户名和邮箱地址</p>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-mint-accent text-xl font-bold text-white shadow-sm">
              {displayAvatar}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-mint-text">{displayName}</p>
              <p className="text-xs text-mint-muted">UID: {uid}</p>
            </div>
            <button
              className="ml-auto rounded-lg border border-mint-border/50 px-3 py-1.5 text-xs font-medium text-mint-text transition hover:bg-mint-hover cursor-pointer"
              type="button"
              onClick={openProfileModal}
            >
              修改
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-mint-border/20 bg-white px-4 py-3">
            <div>
              <p className="text-sm font-medium text-mint-text">会员信息</p>
              <p className="text-xs text-mint-muted">免费版</p>
            </div>
            <Button variant="text" size="sm" onClick={() => setMembershipOpen(true)}>升级会员</Button>
          </div>
        </div>

        <div className="border-t border-mint-border/10 pt-6">
          <h3 className="mb-1 text-base font-semibold text-mint-text">账号绑定</h3>
          <p className="mb-4 text-xs text-mint-muted">管理你的绑定手机号和邮箱</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-mint-border/20 bg-white px-4 py-3">
              <div>
                <p className="text-sm font-medium text-mint-text">手机号</p>
                <p className="text-xs text-mint-muted">{phoneDisplay}</p>
              </div>
              <Button variant="text" size="sm" onClick={openPhoneModal}>修改</Button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-mint-border/20 bg-white px-4 py-3">
              <div>
                <p className="text-sm font-medium text-mint-text">邮箱</p>
                <p className="text-xs text-mint-muted">{displayEmail}</p>
              </div>
              <Button variant="text" size="sm" onClick={openEmailModal}>修改</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-mint-border/10 pt-6">
          <h3 className="mb-1 text-base font-semibold text-mint-text">安全设置</h3>
          <p className="mb-4 text-xs text-mint-muted">管理你的密码和安全选项</p>
          <div className="flex items-center justify-between rounded-xl border border-mint-border/20 bg-white px-4 py-3">
            <div>
              <p className="text-sm font-medium text-mint-text">密码</p>
              <p className="text-xs text-mint-muted">********</p>
            </div>
            <Button variant="text" size="sm" onClick={openPasswordModal}>修改</Button>
          </div>
        </div>

        <div className="border-t border-mint-border/10 pt-6">
          <button
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 cursor-pointer"
            type="button"
            onClick={openDeleteModal}
          >
            注销账号
          </button>
        </div>
      </div>

      <Modal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} title="修改个人信息" width="sm">
        <div className="space-y-5 p-6">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-20 items-center justify-center rounded-full bg-mint-accent text-2xl font-bold text-white shadow-sm">
              {profileAvatarPreview ? (
                <img src={profileAvatarPreview} alt="头像预览" className="size-20 rounded-full object-cover" />
              ) : (
                displayAvatar
              )}
            </div>
            <label className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-mint-accent transition hover:bg-mint-hover/60">
              上传头像
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
            </label>
          </div>
          <FormInput
            label="用户名称"
            value={profileName}
            onChange={(e) => { setProfileName(e.target.value); setProfileNameError(""); }}
            error={profileNameError}
            placeholder="请输入用户名（2-20字符）"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setProfileModalOpen(false)}>取消</Button>
            <Button variant="primary" size="sm" onClick={handleSaveProfile}>保存</Button>
          </div>
        </div>
      </Modal>

      <Modal open={phoneModalOpen} onClose={() => setPhoneModalOpen(false)} title="修改绑定手机号" width="sm">
        <div className="space-y-5 p-6">
          <FormInput
            label="新手机号"
            value={phoneInput}
            onChange={(e) => { setPhoneInput(e.target.value); setPhoneError(""); }}
            error={phoneError}
            placeholder="请输入11位手机号"
            type="tel"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setPhoneModalOpen(false)}>取消</Button>
            <Button variant="primary" size="sm" onClick={handleSavePhone}>保存</Button>
          </div>
        </div>
      </Modal>

      <Modal open={emailModalOpen} onClose={() => setEmailModalOpen(false)} title="修改绑定邮箱" width="sm">
        <div className="space-y-5 p-6">
          <FormInput
            label="新邮箱地址"
            value={emailInput}
            onChange={(e) => { setEmailInput(e.target.value); setEmailError(""); }}
            error={emailError}
            placeholder="请输入邮箱地址"
            type="email"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setEmailModalOpen(false)}>取消</Button>
            <Button variant="primary" size="sm" onClick={handleSaveEmail}>保存</Button>
          </div>
        </div>
      </Modal>

      <Modal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} title="修改密码" width="sm">
        <div className="space-y-5 p-6">
          <FormInput
            label="原密码"
            value={oldPassword}
            onChange={(e) => { setOldPassword(e.target.value); setOldPasswordError(""); }}
            error={oldPasswordError}
            type="password"
            placeholder="请输入原密码"
          />
          <FormInput
            label="新密码"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setNewPasswordError(""); }}
            error={newPasswordError}
            type="password"
            placeholder="至少 8 位"
          />
          <FormInput
            label="确认新密码"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(""); }}
            error={confirmPasswordError}
            type="password"
            placeholder="再次输入新密码"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setPasswordModalOpen(false)}>取消</Button>
            <Button variant="primary" size="sm" onClick={handleSavePassword}>保存</Button>
          </div>
        </div>
      </Modal>

      <MembershipDialog open={membershipOpen} onClose={() => setMembershipOpen(false)} />

      <Modal open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="注销账号" width="sm">
        <div className="space-y-5 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="material-symbols-outlined text-4xl text-red-500">warning</span>
            <div>
              <p className="text-sm font-medium text-mint-text">确定要注销账号吗？</p>
              <p className="mt-1 text-xs text-mint-muted">注销后所有数据将被永久清除，无法恢复。</p>
            </div>
          </div>
          <FormInput
            label="请输入「我已经知晓」以确认"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            placeholder="我已经知晓"
          />
          <Checkbox
            label="我已知晓注销后数据不可恢复"
            checked={deleteChecked}
            onChange={setDeleteChecked}
          />
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmOpen(false)}>取消</Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-red-500! hover:bg-red-600! disabled:opacity-50! disabled:cursor-not-allowed!"
              disabled={!deleteCanConfirm}
              onClick={handleDeleteAccount}
            >
              确认注销
            </Button>
          </div>
        </div>
      </Modal>

      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </>
  );
}
