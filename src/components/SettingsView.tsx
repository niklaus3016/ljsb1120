import React, { useState } from 'react';
import { Download, ScrollText, ShieldCheck, Trash2 } from 'lucide-react';
import type { PWAInstallState } from '../hooks/usePWAInstall';
import {
  MANDATORY_DISCLAIMER,
  type AppSettings,
  type BackgroundTexture,
  type MeditationDuration,
} from '../types';
import { LegalDocumentModal } from './legal/LegalDialogs';
import {
  LEGAL_UPDATED_AT,
  PrivacyPolicyContent,
  UserAgreementContent,
} from './legal/LegalContent';

interface SettingsViewProps {
  settings: AppSettings;
  recordCount: number;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onClearAllRecords: () => void;
  pwaInstall: PWAInstallState;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  recordCount,
  onUpdateSettings,
  onClearAllRecords,
  pwaInstall,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearedTip, setClearedTip] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = pwaInstall;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-5 pb-12 space-y-6">
      <header className="border-b border-[#5C463B]/15 dark:border-[#EFE6D8]/12 pb-4">
        <h2 className="text-xl font-bold tracking-[0.08em] text-[#2E1F18] dark:text-[#EFE6D8]">
          设置
        </h2>
        <p className="mt-1 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
          投掷方式、声画体验与本地数据管理
        </p>
      </header>

      {/* Group 1: Interaction & Ritual Mode */}
      <section className="rounded-2xl border border-[#5C463B]/16 dark:border-[#EFE6D8]/12 bg-[#FBF8F1]/85 dark:bg-[#211B18]/85 divide-y divide-[#5C463B]/12 dark:divide-[#EFE6D8]/10">
        {/* Trigger Mode */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
              投掷触发方式
            </h3>
            <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
              选择轻触下滑投掷，或摇晃手机感应掷杯
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFE7D8] dark:bg-[#161210] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onUpdateSettings({ triggerMode: 'tap' })}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                settings.triggerMode === 'tap'
                  ? 'bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210]'
                  : 'text-[#5C463B] dark:text-[#CBBBA8]'
              }`}
            >
              点击投掷
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ triggerMode: 'shake' })}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                settings.triggerMode === 'shake'
                  ? 'bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210]'
                  : 'text-[#5C463B] dark:text-[#CBBBA8]'
              }`}
            >
              摇晃投掷
            </button>
          </div>
        </div>

        {/* Continuous Mode */}
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
              连掷模式
            </h3>
            <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
              默认关闭；开启后可连续掷杯直至笑茭或阴茭止
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.continuousMode}
            aria-label="连掷模式开关"
            onClick={() => onUpdateSettings({ continuousMode: !settings.continuousMode })}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
              settings.continuousMode
                ? 'bg-[#8B3A2B] dark:bg-[#C86D55] border-transparent'
                : 'bg-[#EFE7D8] dark:bg-[#161210] border-[#5C463B]/25 dark:border-[#EFE6D8]/20'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-[#FBF8F1] shadow transition-transform ${
                settings.continuousMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Animation Quality */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
              动画档位
            </h3>
            <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
              低配机型可选简洁动画以节省耗电
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFE7D8] dark:bg-[#161210] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onUpdateSettings({ animationQuality: 'full' })}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                settings.animationQuality === 'full'
                  ? 'bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210]'
                  : 'text-[#5C463B] dark:text-[#CBBBA8]'
              }`}
            >
              完整动画
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ animationQuality: 'simple' })}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                settings.animationQuality === 'simple'
                  ? 'bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210]'
                  : 'text-[#5C463B] dark:text-[#CBBBA8]'
              }`}
            >
              简洁动画
            </button>
          </div>
        </div>
      </section>

      {/* Group 2: Audio & Vibration */}
      <section className="rounded-2xl border border-[#5C463B]/16 dark:border-[#EFE6D8]/12 bg-[#FBF8F1]/85 dark:bg-[#211B18]/85 divide-y divide-[#5C463B]/12 dark:divide-[#EFE6D8]/10">
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
              音效开关
            </h3>
            <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
              本地合成抛杯风声、木质落地声与三杯提示音
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.soundEnabled}
            aria-label="音效开关"
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
              settings.soundEnabled
                ? 'bg-[#8B3A2B] dark:bg-[#C86D55] border-transparent'
                : 'bg-[#EFE7D8] dark:bg-[#161210] border-[#5C463B]/25 dark:border-[#EFE6D8]/20'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-[#FBF8F1] shadow transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
              振动反馈
            </h3>
            <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
              杯落出卦时触发轻震提示（需设备支持振动）
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.vibrationEnabled}
            aria-label="振动反馈开关"
            onClick={() => onUpdateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
              settings.vibrationEnabled
                ? 'bg-[#8B3A2B] dark:bg-[#C86D55] border-transparent'
                : 'bg-[#EFE7D8] dark:bg-[#161210] border-[#5C463B]/25 dark:border-[#EFE6D8]/20'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-[#FBF8F1] shadow transition-transform ${
                settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Group 3: Theme, Background & Default Meditation */}
      <section className="rounded-2xl border border-[#5C463B]/16 dark:border-[#EFE6D8]/12 bg-[#FBF8F1]/85 dark:bg-[#211B18]/85 divide-y divide-[#5C463B]/12 dark:divide-[#EFE6D8]/10">
        {/* Theme Mode */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
              外观主题
            </h3>
            <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
              浅色宣纸与深色檀木两套护眼配色
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFE7D8] dark:bg-[#161210] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onUpdateSettings({ theme: 'light' })}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                settings.theme === 'light'
                  ? 'bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210]'
                  : 'text-[#5C463B] dark:text-[#CBBBA8]'
              }`}
            >
              浅色宣纸
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                settings.theme === 'dark'
                  ? 'bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210]'
                  : 'text-[#5C463B] dark:text-[#CBBBA8]'
              }`}
            >
              深色檀木
            </button>
          </div>
        </div>

        {/* 3 Static Guofeng Backgrounds */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
              国风底纹切换
            </h3>
            <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
              素纸、木纹、暗纹祥云三套静态底纹
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFE7D8] dark:bg-[#161210] self-start sm:self-auto">
            {(
              [
                { id: 'paper', label: '素纸' },
                { id: 'wood', label: '木纹' },
                { id: 'cloud', label: '暗纹祥云' },
              ] as { id: BackgroundTexture; label: string }[]
            ).map((bg) => (
              <button
                key={bg.id}
                type="button"
                onClick={() => onUpdateSettings({ backgroundTexture: bg.id })}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  settings.backgroundTexture === bg.id
                    ? 'bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210]'
                    : 'text-[#5C463B] dark:text-[#CBBBA8]'
                }`}
              >
                {bg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Default Meditation Duration */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
              默认静心时长
            </h3>
            <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
              每次打开首页默认预选的静心倒计时
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFE7D8] dark:bg-[#161210] self-start sm:self-auto">
            {([0, 10, 30, 60] as MeditationDuration[]).map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => onUpdateSettings({ meditationDefault: sec })}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  settings.meditationDefault === sec
                    ? 'bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210]'
                    : 'text-[#5C463B] dark:text-[#CBBBA8]'
                }`}
              >
                {sec === 0 ? '关闭' : `${sec}秒`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Group 4: Privacy Policy, Offline Install & Local Data */}
      <section className="rounded-2xl border border-[#5C463B]/16 dark:border-[#EFE6D8]/12 bg-[#FBF8F1]/85 dark:bg-[#211B18]/85 divide-y divide-[#5C463B]/12 dark:divide-[#EFE6D8]/10">
        {!isInstalled && (isInstallable || isIOS) && (
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
                安装至手机桌面
              </h3>
              <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
                作为独立应用运行，无需联网即可随时使用
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isInstallable) {
                  install();
                } else if (isIOS) {
                  setShowIOSGuide(true);
                }
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#2E1F18] dark:bg-[#EFE6D8] text-[#FBF8F1] dark:text-[#161210] text-xs font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>安装应用</span>
            </button>
          </div>
        )}

        {/* Standalone Privacy Policy Row */}
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
              隐私政策
            </h3>
            <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
              查看纯本地运行与权限说明
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPrivacyPolicy(true)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-[#5C463B]/25 dark:border-[#EFE6D8]/20 text-xs font-medium text-[#2E1F18] dark:text-[#EFE6D8] hover:bg-[#EFE7D8]/60 dark:hover:bg-[#2D2521] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-[#8B3A2B] dark:text-[#C86D55]" />
            <span>查看隐私政策</span>
          </button>
        </div>

        {/* User Agreement Row */}
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
              用户服务协议
            </h3>
            <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
              查看服务内容、使用规则与免责声明
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAgreement(true)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-[#5C463B]/25 dark:border-[#EFE6D8]/20 text-xs font-medium text-[#2E1F18] dark:text-[#EFE6D8] hover:bg-[#EFE7D8]/60 dark:hover:bg-[#2D2521] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <ScrollText className="w-4 h-4 text-[#8B3A2B] dark:text-[#C86D55]" />
            <span>查看用户协议</span>
          </button>
        </div>

        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
              清除本地记录
            </h3>
            <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
              {clearedTip
                ? '已清空全部本地问事日志'
                : `当前本地共存储 ${recordCount} 条记录，清除后不可恢复`}
            </p>
          </div>
          <button
            type="button"
            disabled={recordCount === 0}
            onClick={() => setConfirmClear(true)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-[#8B3A2B]/35 dark:border-[#C86D55]/40 text-xs font-medium text-[#8B3A2B] dark:text-[#C86D55] hover:bg-[#8B3A2B]/8 disabled:opacity-40 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>清除记录</span>
          </button>
        </div>
      </section>

      {/* Group 5: About */}
      <section className="rounded-2xl border border-[#5C463B]/16 dark:border-[#EFE6D8]/12 bg-[#FBF8F1]/85 dark:bg-[#211B18]/85 p-5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
            软件说明 · 关于灵境胜杯
          </h3>
          <span className="text-xs tabular-nums text-[#7B6356] dark:text-[#9C8A7A] whitespace-nowrap">
            v1.0.0
          </span>
        </div>
        <p className="text-xs font-medium text-[#8B3A2B] dark:text-[#C86D55]">
          灵境胜杯 · 民俗模拟，仅供娱乐参考
        </p>
        <p className="text-xs leading-relaxed text-[#5C463B] dark:text-[#CBBBA8]">
          本应用为纯前端本地运行的潮汕筊杯民俗文化模拟工具，核心功能可正常使用，不设账号、不上传任何数据，所有问事日志均保存于本机沙盒存储中。
        </p>
        <p className="text-xs leading-relaxed text-[#7B6356] dark:text-[#9C8A7A]">
          {MANDATORY_DISCLAIMER}
        </p>
      </section>

      {/* Confirm Clear Modal */}
      {confirmClear && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4"
          onClick={() => setConfirmClear(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-[#5C463B]/20 dark:border-[#EFE6D8]/15 bg-[#FBF8F1] dark:bg-[#211B18] p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold text-[#2E1F18] dark:text-[#EFE6D8]">
              确认清除全部本地记录？
            </h3>
            <p className="mt-2 text-sm text-[#5C463B] dark:text-[#CBBBA8] leading-relaxed">
              将永久清空本地记录簿中的 {recordCount} 条问事日志，无法撤回。
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl border border-[#5C463B]/20 dark:border-[#EFE6D8]/15 text-sm font-medium text-[#5C463B] dark:text-[#CBBBA8]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAllRecords();
                  setConfirmClear(false);
                  setClearedTip(true);
                }}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210] text-sm font-semibold"
              >
                确认清除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari Install Guide */}
      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-[#5C463B]/20 dark:border-[#EFE6D8]/15 bg-[#FBF8F1] dark:bg-[#211B18] p-6 shadow-xl"
          >
            <h3 className="text-base font-bold text-[#2E1F18] dark:text-[#EFE6D8]">
              添加到主屏幕
            </h3>
            <p className="mt-2 text-sm text-[#5C463B] dark:text-[#CBBBA8] leading-relaxed">
              1. 点击浏览器底部的「分享」按钮。
              <br />
              2. 向下滑动并选择「添加到主屏幕」，即可作为独立应用打开。
            </p>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full min-h-[44px] rounded-xl bg-[#2E1F18] dark:bg-[#EFE6D8] text-[#FBF8F1] dark:text-[#161210] text-sm font-medium"
            >
              知道了
            </button>
          </div>
        </div>
      )}
      {showPrivacyPolicy && (
        <LegalDocumentModal
          title="灵境胜杯隐私政策"
          subtitle={`更新日期：${LEGAL_UPDATED_AT}`}
          onClose={() => setShowPrivacyPolicy(false)}
          footerLabel="我已阅读并知悉"
        >
          <PrivacyPolicyContent />
        </LegalDocumentModal>
      )}
      {showAgreement && (
        <LegalDocumentModal
          title="灵境胜杯用户服务协议"
          subtitle={`更新日期：${LEGAL_UPDATED_AT}`}
          onClose={() => setShowAgreement(false)}
          footerLabel="我已阅读并知悉"
        >
          <UserAgreementContent />
        </LegalDocumentModal>
      )}
    </div>
  );
};
