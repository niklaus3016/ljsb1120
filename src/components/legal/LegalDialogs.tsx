import React, { useEffect, useId, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { motion } from 'motion/react';
import {
  LEGAL_COMPANY,
  PrivacyPolicyContent,
  UserAgreementContent,
} from './LegalContent';

const OVERLAY =
  'fixed inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px] p-4';

interface LegalDocumentModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  footerLabel?: string;
  children: React.ReactNode;
}

/** 阅读完整协议/隐私政策的弹层，启动弹窗与设置页共用。 */
export const LegalDocumentModal: React.FC<LegalDocumentModalProps> = ({
  title,
  subtitle,
  onClose,
  footerLabel,
  children,
}) => {
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={`${OVERLAY} z-[70]`} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-2xl h-[88dvh] sm:h-[85vh] flex flex-col rounded-2xl border border-[#5C463B]/20 dark:border-[#EFE6D8]/15 bg-[#FBF8F1] dark:bg-[#211B18] shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#5C463B]/12 dark:border-[#EFE6D8]/12 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-[#8B3A2B]/10 dark:bg-[#C86D55]/12 text-[#8B3A2B] dark:text-[#C86D55] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3
                id={titleId}
                className="text-base font-bold text-[#2E1F18] dark:text-[#EFE6D8] truncate"
              >
                {title}
              </h3>
              {subtitle && (
                <p className="mt-0.5 text-[11px] text-[#7B6356] dark:text-[#9C8A7A] truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            aria-label={`关闭${title}`}
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-[#5C463B] dark:text-[#CBBBA8] hover:text-[#2E1F18] dark:hover:text-[#EFE6D8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {children}
        </div>

        {footerLabel && (
          <div className="px-5 py-3.5 border-t border-[#5C463B]/12 dark:border-[#EFE6D8]/12 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[44px] rounded-xl bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210] text-sm font-medium"
            >
              {footerLabel}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

interface LegalConsentGateProps {
  onAccept: () => void;
}

/**
 * 启动时的协议确认闸门。
 * 未同意前覆盖整个应用；拒绝后进入阻断页，可重新返回阅读并同意。
 */
export const LegalConsentGate: React.FC<LegalConsentGateProps> = ({ onAccept }) => {
  const [openDoc, setOpenDoc] = useState<'agreement' | 'privacy' | null>(null);
  const [confirmDecline, setConfirmDecline] = useState(false);
  const [declined, setDeclined] = useState(false);
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (declined) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#FBF8F1] dark:bg-[#161210] p-6">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#8B3A2B]/10 dark:bg-[#C86D55]/12 text-[#8B3A2B] dark:text-[#C86D55] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold tracking-[0.06em] text-[#2E1F18] dark:text-[#EFE6D8]">
            无法继续使用
          </h2>
          <p className="text-sm leading-relaxed text-[#5C463B] dark:text-[#CBBBA8]">
            您已拒绝《用户服务协议》与《隐私政策》。灵境胜杯需要您的同意才能运行。
          </p>
          <p className="text-xs text-[#7B6356] dark:text-[#9C8A7A]">
            您可以直接关闭本页面，或返回重新阅读协议。
          </p>
          <button
            type="button"
            onClick={() => setDeclined(false)}
            className="w-full min-h-[48px] rounded-xl bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210] text-sm font-medium"
          >
            重新查看协议
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${OVERLAY} z-[60]`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="w-full max-w-md max-h-[85dvh] flex flex-col rounded-2xl border border-[#5C463B]/20 dark:border-[#EFE6D8]/15 bg-[#FBF8F1] dark:bg-[#211B18] shadow-2xl overflow-hidden"
        >
          <div className="px-5 pt-6 pb-4 text-center shrink-0">
            <div className="mx-auto mb-3 w-11 h-11 rounded-2xl bg-[#8B3A2B]/10 dark:bg-[#C86D55]/12 text-[#8B3A2B] dark:text-[#C86D55] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2
              id={titleId}
              className="text-lg font-bold tracking-[0.06em] text-[#2E1F18] dark:text-[#EFE6D8]"
            >
              用户协议与隐私政策
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-5 space-y-4 text-xs sm:text-[13px] leading-relaxed text-[#5C463B] dark:text-[#CBBBA8]">
            <p className="text-[#2E1F18] dark:text-[#EFE6D8]">
              在开始问事之前，请阅读并同意以下内容：
            </p>
            <ol className="list-decimal space-y-2 pl-5 marker:text-[#8B3A2B] dark:marker:text-[#C86D55]">
              <li>本应用纯本地运行，不收集、不上传您的问事内容和记录。</li>
              <li>不接入第三方统计或广告 SDK；仅界面字体首次加载会向 Google Fonts 请求字体资源。</li>
              <li>所有结果均为随机生成，仅供民俗文化娱乐参考，不构成任何建议。</li>
            </ol>
            <p>
              请阅读完整的
              <button
                type="button"
                onClick={() => setOpenDoc('agreement')}
                className="mx-0.5 font-medium text-[#8B3A2B] dark:text-[#C86D55] underline underline-offset-2"
              >
                《用户服务协议》
              </button>
              和
              <button
                type="button"
                onClick={() => setOpenDoc('privacy')}
                className="mx-0.5 font-medium text-[#8B3A2B] dark:text-[#C86D55] underline underline-offset-2"
              >
                《隐私政策》
              </button>
              了解详细内容。点击「同意并继续」即表示您已阅读并同意上述协议。
            </p>
            <p className="text-[11px] text-[#7B6356] dark:text-[#9C8A7A]">
              运营者：{LEGAL_COMPANY}
            </p>
          </div>

          <div className="grid grid-cols-2 border-t border-[#5C463B]/12 dark:border-[#EFE6D8]/12 shrink-0">
            <button
              type="button"
              onClick={() => setConfirmDecline(true)}
              className="min-h-[52px] px-4 text-sm font-medium text-[#5C463B] dark:text-[#CBBBA8] border-r border-[#5C463B]/12 dark:border-[#EFE6D8]/12 hover:bg-[#EFE7D8]/50 dark:hover:bg-[#2D2521] transition-colors"
            >
              不同意
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="min-h-[52px] px-4 text-sm font-medium text-[#FBF8F1] dark:text-[#161210] bg-[#8B3A2B] dark:bg-[#C86D55] hover:bg-[#7A3225] dark:hover:bg-[#D47A61] transition-colors"
            >
              同意并继续
            </button>
          </div>
        </motion.div>
      </div>

      {openDoc && (
        <LegalDocumentModal
          title={openDoc === 'agreement' ? '用户服务协议' : '隐私政策'}
          onClose={() => setOpenDoc(null)}
        >
          {openDoc === 'agreement' ? <UserAgreementContent /> : <PrivacyPolicyContent />}
        </LegalDocumentModal>
      )}

      {confirmDecline && (
        <div
          className={`${OVERLAY} z-[70]`}
          onClick={() => setConfirmDecline(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.16 }}
            role="alertdialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-[#5C463B]/20 dark:border-[#EFE6D8]/15 bg-[#FBF8F1] dark:bg-[#211B18] shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-5 space-y-2">
              <h3 className="text-base font-bold text-[#2E1F18] dark:text-[#EFE6D8]">
                确认拒绝
              </h3>
              <p className="text-sm leading-relaxed text-[#5C463B] dark:text-[#CBBBA8]">
                拒绝后将无法继续使用灵境胜杯。您可以返回重新阅读协议，或直接关闭本页面。
              </p>
            </div>
            <div className="grid grid-cols-2 border-t border-[#5C463B]/12 dark:border-[#EFE6D8]/12">
              <button
                type="button"
                onClick={() => setConfirmDecline(false)}
                className="min-h-[48px] text-sm font-medium text-[#5C463B] dark:text-[#CBBBA8] border-r border-[#5C463B]/12 dark:border-[#EFE6D8]/12 hover:bg-[#EFE7D8]/50 dark:hover:bg-[#2D2521] transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDecline(false);
                  setDeclined(true);
                }}
                className="min-h-[48px] text-sm font-medium text-[#8B3A2B] dark:text-[#C86D55] hover:bg-[#EFE7D8]/50 dark:hover:bg-[#2D2521] transition-colors"
              >
                确认拒绝
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
