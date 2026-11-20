import React from 'react';

/**
 * 协议版本号：修改协议实质内容时必须同步更新该日期。
 * App 启动时会拿本地已同意的版本号与这里比较，不一致则重新弹窗确认。
 */
export const LEGAL_VERSION = '2026-11-20';
export const LEGAL_UPDATED_AT = '2026年11月20日';
export const LEGAL_COMPANY = '深圳丰佰瑞网络科技有限公司';
export const LEGAL_EMAIL = 'Jp182025@163.com';

const sectionTitle =
  'text-sm font-bold text-[#2E1F18] dark:text-[#EFE6D8] border-b border-[#5C463B]/15 dark:border-[#EFE6D8]/12 pb-1.5';
const strong = 'font-semibold text-[#2E1F18] dark:text-[#EFE6D8]';

export const PrivacyPolicyContent: React.FC = () => (
  <div className="space-y-5 text-xs sm:text-[13px] leading-relaxed text-[#5C463B] dark:text-[#CBBBA8]">
    <p className="text-center text-[11px] tabular-nums text-[#7B6356] dark:text-[#9C8A7A]">
      生效日期：{LEGAL_UPDATED_AT}
    </p>

    <div className="rounded-xl border-l-2 border-[#8B3A2B] dark:border-[#C86D55] bg-[#EFE7D8]/70 dark:bg-[#2D2521] px-4 py-3.5">
      <p>
        欢迎使用「灵境胜杯」。本应用由
        <strong className={strong}>{LEGAL_COMPANY}</strong>
        （以下简称“我们”）开发并运营。我们深知个人信息对您的重要性，并严格遵守《中华人民共和国个人信息保护法》等相关法律法规。
      </p>
    </div>

    <p>
      本政策说明「灵境胜杯」如何收集、使用、存储和保护信息，以及您对这些信息享有的权利。请您在使用前仔细阅读并充分理解本政策，特别是加粗内容。如您有任何疑问，可通过文末方式与我们联系。
    </p>

    <section className="space-y-2">
      <h3 className={sectionTitle}>一、我们收集的信息</h3>
      <ol className="list-decimal space-y-2 pl-5 marker:text-[#8B3A2B] dark:marker:text-[#C86D55]">
        <li>
          <strong className={strong}>不收集个人身份信息</strong>
          ：本应用无需注册或登录，不收集姓名、手机号、身份证号、位置、通讯录、相册等任何可识别您个人身份的信息，也不会将您的问事内容上传至服务器。
        </li>
        <li>
          <strong className={strong}>本地保存的数据</strong>
          ：您主动输入的「心中所问之事」、问事记录（结果、时间、连掷序列）以及个性化设置（主题、底纹、音效、触发方式、静心时长等），仅保存在您设备的浏览器本地存储（localStorage）中。
        </li>
        <li>
          <strong className={strong}>设备权限</strong>
          ：仅在您开启「振动反馈」时调用设备振动；仅在您选择「摇晃投掷」模式时读取运动传感器以识别摇晃动作，不记录、不上传传感器轨迹。本应用不申请定位、相机、麦克风、通讯录或外部存储权限。
        </li>
        <li>
          <strong className={strong}>字体资源请求</strong>
          ：界面字体首次加载时会向 Google Fonts 请求字体文件。该请求与普通网页请求一样包含 IP 地址等常规网络信息，但不包含您在应用内输入的任何内容；字体加载后会由缓存保存。
        </li>
      </ol>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>二、我们如何使用信息</h3>
      <p>
        上述本地数据仅用于实现掷筊结果展示、连掷统计、记录查看、设置恢复与提示音播放等核心功能。我们不会对您的数据进行画像、分析、广告推送或营销，也不会将其用于本政策未说明的其他用途。
      </p>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>三、我们如何共享、转让和公开披露</h3>
      <ol className="list-decimal space-y-2 pl-5 marker:text-[#8B3A2B] dark:marker:text-[#C86D55]">
        <li>我们不会出售、出租或以其他方式向任何第三方共享您的问事内容与记录。</li>
        <li>本应用未接入第三方统计、广告或用户追踪 SDK，不存在与之相关的数据共享。</li>
        <li>
          Google Fonts 仅作为字体资源提供方接收字体请求，不接收您在应用内输入的任何内容。
        </li>
        <li>仅在法律法规规定或行政、司法机关依法提出强制性要求时，我们才会依法配合提供必要信息。</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>四、我们如何存储和保护信息</h3>
      <ol className="list-decimal space-y-2 pl-5 marker:text-[#8B3A2B] dark:marker:text-[#C86D55]">
        <li>
          <strong className={strong}>存储位置</strong>
          ：本应用无后端服务器，所有业务数据均存储在您的设备本地，不进行云端备份或跨设备同步。
        </li>
        <li>
          <strong className={strong}>保存期限</strong>
          ：数据保存至您主动删除、在「设置」中清除本地记录、卸载应用或清除浏览器站点数据为止；删除后无法恢复。
        </li>
        <li>
          <strong className={strong}>安全提示</strong>
          ：请您妥善保管设备与浏览器账户，避免他人未经授权查看您的本地记录。
        </li>
      </ol>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>五、您的权利</h3>
      <ol className="list-decimal space-y-2 pl-5 marker:text-[#8B3A2B] dark:marker:text-[#C86D55]">
        <li><strong className={strong}>访问</strong>：可在「记录」页查看全部本地问事记录。</li>
        <li><strong className={strong}>更正</strong>：可重新发起问事并保存新的记录。</li>
        <li><strong className={strong}>删除</strong>：可删除单条记录、清空全部记录，或通过清除浏览器站点数据彻底删除。</li>
        <li>
          <strong className={strong}>撤回同意</strong>
          ：您可停止使用本应用并清除本地数据以撤回同意；撤回不影响撤回前基于您的同意已完成的本地处理。
        </li>
        <li>
          <strong className={strong}>数据导出</strong>
          ：数据完全存储在本地，您可通过设备备份或手动抄录方式自行留存；本应用不提供云端导出。
        </li>
      </ol>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>六、未成年人保护</h3>
      <p>
        若您未满 14 周岁，请在监护人指导下阅读本政策，并在取得监护人同意后使用本应用。本应用不收集个人身份信息；如监护人发现有相关信息被误留存，可通过文末邮箱联系我们删除。
      </p>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>七、本政策的更新</h3>
      <p>
        我们可能根据法律法规或产品功能变化更新本政策，更新后会在应用内公示并修改生效日期。涉及收集范围、使用方式等重大变更时，我们会通过启动弹窗重新征得您的同意；如您不同意更新内容，请停止使用并清除本地数据。
      </p>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>八、联系我们</h3>
      <p>如您对本政策有任何疑问、意见或建议，或需要行使相关权利，请通过以下方式联系：</p>
      <div className="rounded-xl border border-[#5C463B]/15 dark:border-[#EFE6D8]/12 bg-[#EFE7D8]/50 dark:bg-[#2D2521] px-4 py-3">
        <p>运营者：{LEGAL_COMPANY}</p>
        <p className="mt-1">
          电子邮箱：
          <a
            href={`mailto:${LEGAL_EMAIL}`}
            className="text-[#8B3A2B] dark:text-[#C86D55] underline underline-offset-2"
          >
            {LEGAL_EMAIL}
          </a>
        </p>
      </div>
    </section>

    <div className="border-t border-[#5C463B]/15 dark:border-[#EFE6D8]/12 pt-4 text-center text-[11px] text-[#7B6356] dark:text-[#9C8A7A]">
      <p>感谢您使用灵境胜杯。</p>
      <p className="mt-1">© 2026 {LEGAL_COMPANY} 版权所有</p>
    </div>
  </div>
);

export const UserAgreementContent: React.FC = () => (
  <div className="space-y-5 text-xs sm:text-[13px] leading-relaxed text-[#5C463B] dark:text-[#CBBBA8]">
    <p className="text-center text-[11px] tabular-nums text-[#7B6356] dark:text-[#9C8A7A]">
      更新日期：{LEGAL_UPDATED_AT}
    </p>

    <div className="rounded-xl border-l-2 border-[#8B3A2B] dark:border-[#C86D55] bg-[#EFE7D8]/70 dark:bg-[#2D2521] px-4 py-3.5">
      <p>
        欢迎使用「灵境胜杯」。本协议是您与
        <strong className={strong}>{LEGAL_COMPANY}</strong>
        （以下简称“我们”）之间关于使用本应用的法律协议。请您在使用前完整阅读并充分理解，尤其是免责条款。
      </p>
    </div>

    <section className="space-y-2">
      <h3 className={sectionTitle}>一、协议的接受</h3>
      <p>
        您通过点击「同意并继续」、安装或使用本应用，即表示您已阅读并同意本协议及《隐私政策》的全部内容。如您不同意其中任何条款，请停止安装或使用。
      </p>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>二、服务内容</h3>
      <p>本应用是一款潮汕筊杯民俗文化模拟工具，提供以下功能：</p>
      <ul className="list-disc space-y-1.5 pl-5 marker:text-[#8B3A2B] dark:marker:text-[#C86D55]">
        <li>模拟掷筊并展示圣茭、笑茭、阴茭结果；</li>
        <li>连续掷筊、静心倒计时等辅助体验；</li>
        <li>在本机保存、筛选和查看问事记录；</li>
        <li>浏览筊杯民俗文化知识，以及主题、音效等个性化设置。</li>
      </ul>
      <p>本应用为纯本地工具，不提供账号、云端存储或在线占卜服务。</p>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>三、使用规则与用户义务</h3>
      <p>作为本应用的用户，您同意：</p>
      <ul className="list-disc space-y-1.5 pl-5 marker:text-[#8B3A2B] dark:marker:text-[#C86D55]">
        <li>遵守国家法律法规及本协议约定，不利用本应用从事任何违法活动；</li>
        <li>不将本应用用于赌博、诈骗、非法敛财或其他侵害他人权益的用途；</li>
        <li>不干扰、破坏本应用的正常运行，不进行恶意攻击、逆向破解或批量复制；</li>
        <li>自行妥善保管设备与浏览器数据，防止未授权访问或记录丢失。</li>
      </ul>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>四、知识产权</h3>
      <p>
        本应用的界面设计、文字说明、图标、程序代码等内容受知识产权法律保护，未经我们书面许可，不得复制、修改、分发或用于商业目的。筊杯相关民俗文化元素属于公共文化范畴；您在应用内输入的问事内容与生成的记录归您本人所有。
      </p>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>五、免责声明</h3>
      <div className="rounded-xl border border-[#8B3A2B]/25 dark:border-[#C86D55]/25 bg-[#8B3A2B]/5 dark:bg-[#C86D55]/8 px-4 py-3.5 space-y-2">
        <p>
          <strong className={strong}>本应用的全部结果均为随机生成，仅供民俗文化娱乐与自我静心参考，不构成任何形式的预测、占卜、人生、医疗、投资、法律或婚姻建议。</strong>
        </p>
        <p>
          请勿将结果作为任何重要决策的依据。因依赖或参考结果而作出的决定及其后果，由您自行承担。
        </p>
        <p>
          本应用按「现状」提供。我们不保证服务不会中断或完全无错误；因设备故障、浏览器清理数据、卸载应用等导致的本地记录丢失，我们无法恢复。
        </p>
      </div>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>六、服务变更与终止</h3>
      <p>
        我们可能根据运营需要更新、优化或停止部分功能，并会在应用内进行合理提示。您可随时停止使用本应用，并通过清除本地数据删除全部记录；停止使用即终止本协议。
      </p>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>七、法律适用与争议解决</h3>
      <p>
        本协议的订立、履行与解释适用中华人民共和国法律。因本协议产生的争议，双方应友好协商解决；协商不成的，任何一方可向深圳市有管辖权的人民法院提起诉讼。
      </p>
    </section>

    <section className="space-y-2">
      <h3 className={sectionTitle}>八、其他</h3>
      <p>
        本协议部分条款无效或不可执行的，不影响其余条款的效力。如您对本协议有疑问，可通过以下方式联系我们：
      </p>
      <div className="rounded-xl border border-[#5C463B]/15 dark:border-[#EFE6D8]/12 bg-[#EFE7D8]/50 dark:bg-[#2D2521] px-4 py-3">
        <p>运营者：{LEGAL_COMPANY}</p>
        <p className="mt-1">
          电子邮箱：
          <a
            href={`mailto:${LEGAL_EMAIL}`}
            className="text-[#8B3A2B] dark:text-[#C86D55] underline underline-offset-2"
          >
            {LEGAL_EMAIL}
          </a>
        </p>
      </div>
    </section>

    <div className="border-t border-[#5C463B]/15 dark:border-[#EFE6D8]/12 pt-4 text-center text-[11px] text-[#7B6356] dark:text-[#9C8A7A]">
      <p>© 2026 {LEGAL_COMPANY} 版权所有</p>
    </div>
  </div>
);
