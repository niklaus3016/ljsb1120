import React from 'react';
import { MANDATORY_DISCLAIMER, OUTCOME_DATA } from '../types';

const MiniBlockDiagram: React.FC<{ left: 'yang' | 'yin'; right: 'yang' | 'yin' }> = ({
  left,
  right,
}) => (
  <div className="flex flex-col items-center shrink-0">
    <svg viewBox="0 0 80 48" className="w-16 h-10" aria-hidden="true">
      <path
        d="M32 6C19 12 12 20 12 24s7 12 20 18c3 1.2 5-1 3.5-3.8-4.5-8-6-11.5-6-14.2s1.5-6.2 6-14.2C37 7 35 4.8 32 6Z"
        fill={left === 'yang' ? '#E1C292' : '#8B3A2B'}
        stroke={left === 'yang' ? '#9A6D43' : '#4F1E15'}
        strokeWidth="1.4"
      />
      <path
        d="M48 6C61 12 68 20 68 24s-7 12-20 18c-3 1.2-5-1-3.5-3.8 4.5-8 6-11.5 6-14.2s-1.5-6.2-6-14.2C43 7 45 4.8 48 6Z"
        fill={right === 'yang' ? '#E1C292' : '#8B3A2B'}
        stroke={right === 'yang' ? '#9A6D43' : '#4F1E15'}
        strokeWidth="1.4"
      />
    </svg>
    <div className="mt-1 flex items-center gap-3 text-[11px] font-medium text-[#7B6356] dark:text-[#CBBBA8]">
      <span>{left === 'yang' ? '阳' : '阴'}</span>
      <span>{right === 'yang' ? '阳' : '阴'}</span>
    </div>
  </div>
);

export const KnowledgeView: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-5 pb-12 space-y-8">
      <header className="border-b border-[#5C463B]/15 dark:border-[#EFE6D8]/12 pb-4">
        <h2 className="text-xl font-bold tracking-[0.08em] text-[#2E1F18] dark:text-[#EFE6D8]">
          潮汕民俗小知识库
        </h2>
        <p className="mt-1 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
          认识筊杯器物渊源、三杯寓意与传统掷茭礼俗
        </p>
      </header>

      {/* Section 1 */}
      <section className="space-y-2.5">
        <h3 className="text-base font-bold text-[#8B3A2B] dark:text-[#C86D55]">
          一、筊杯是什么与起源习俗
        </h3>
        <p className="text-[15px] leading-[1.75] text-[#2E1F18] dark:text-[#EFE6D8]">
          筊杯（潮汕地区常称「圣杯」「茭杯」或「跋杯」），是闽南、潮汕及岭南、台港澳一带流传千年的传统民俗器物。其器形通常取天然竹根或老木雕成一对半月形块片，每片一面平整（称阳面、正），另一面呈弧形凸起（称阴面、反），合之成双月之象，寓阴阳相济之意。
        </p>
        <p className="text-[15px] leading-[1.75] text-[#5C463B] dark:text-[#CBBBA8]">
          据民俗文献所载，早期先民常以两枚贝壳或竹片抛掷占事，后渐演化为专制木雕筊杯，广泛用于传统岁时祭祀、家宅祈福、民俗问事等文化仪式之中，承载着敬天法祖、慎始敬终的人文精神。
        </p>
      </section>

      <div className="h-px bg-[#5C463B]/12 dark:bg-[#EFE6D8]/10" />

      {/* Section 2 */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-[#8B3A2B] dark:text-[#C86D55]">
          二、三种茭杯结果含义解释
        </h3>

        <div className="grid grid-cols-1 gap-3.5">
          <div className="rounded-2xl border border-[#5C463B]/16 dark:border-[#EFE6D8]/12 bg-[#FBF8F1]/85 dark:bg-[#211B18]/85 p-4 flex items-center gap-4">
            <MiniBlockDiagram left="yang" right="yin" />
            <div className="min-w-0">
              <div className="text-base font-bold text-[#2E1F18] dark:text-[#EFE6D8]">
                {OUTCOME_DATA.圣茭.name}（{OUTCOME_DATA.圣茭.altName}）
              </div>
              <p className="mt-1 text-sm text-[#5C463B] dark:text-[#CBBBA8] leading-relaxed">
                一平面（阳）朝上、一凸面（阴）朝上，称「一正一反」。代表阴阳和谐，寓意所问之事顺遂可行、已得应允。
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#5C463B]/16 dark:border-[#EFE6D8]/12 bg-[#FBF8F1]/85 dark:bg-[#211B18]/85 p-4 flex items-center gap-4">
            <MiniBlockDiagram left="yang" right="yang" />
            <div className="min-w-0">
              <div className="text-base font-bold text-[#2E1F18] dark:text-[#EFE6D8]">
                {OUTCOME_DATA.笑茭.name}（{OUTCOME_DATA.笑茭.altName}）
              </div>
              <p className="mt-1 text-sm text-[#5C463B] dark:text-[#CBBBA8] leading-relaxed">
                两片均为平面（阳面）朝上。在民俗中寓意「笑而不语」，通常表示所问主意尚有犹豫、陈述未明，或事情存在变数，可整理思绪后再行斟酌。
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#5C463B]/16 dark:border-[#EFE6D8]/12 bg-[#FBF8F1]/85 dark:bg-[#211B18]/85 p-4 flex items-center gap-4">
            <MiniBlockDiagram left="yin" right="yin" />
            <div className="min-w-0">
              <div className="text-base font-bold text-[#2E1F18] dark:text-[#EFE6D8]">
                {OUTCOME_DATA.阴茭.name}（{OUTCOME_DATA.阴茭.altName}）
              </div>
              <p className="mt-1 text-sm text-[#5C463B] dark:text-[#CBBBA8] leading-relaxed">
                两片均为凸面（阴面）朝上（即两面平面皆覆于下）。象征时机未至或条件欠妥，提醒此事暂不宜行，当静观待时。
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-[#5C463B]/12 dark:bg-[#EFE6D8]/10" />

      {/* Section 3 */}
      <section className="space-y-3">
        <h3 className="text-base font-bold text-[#8B3A2B] dark:text-[#C86D55]">
          三、传统掷茭礼仪小常识
        </h3>
        <ul className="space-y-2.5 text-[15px] leading-[1.75] text-[#2E1F18] dark:text-[#EFE6D8] list-disc pl-5">
          <li>
            <span className="font-semibold">静心定念：</span>
            传统掷杯前讲究净手端立、片刻静心，先理清心中所惑，忌心浮气躁时仓促而掷。
          </li>
          <li>
            <span className="font-semibold">一问一事：</span>
            每次问事宜明确单一、指向清楚（如是否可行、何时为宜），避免一问之中杂糅数事。
          </li>
          <li>
            <span className="font-semibold">三杯定局与连掷：</span>
            遇到重要民俗事务时，民间常以「连掷三圣茭」为重，若中途出笑茭或阴茭则止；本应用提供「连掷模式」以还原这一传统习俗体验。
          </li>
          <li>
            <span className="font-semibold">顺其自然：</span>
            古人云「谋事在人」，民俗问卜重在借仪式沉静内心、反观己念，切勿反复强求同一结果。
          </li>
        </ul>
      </section>

      {/* Section 4: Mandatory Disclaimer at End */}
      <section className="rounded-2xl border border-[#8B3A2B]/25 dark:border-[#C86D55]/30 bg-[#EFE7D8]/75 dark:bg-[#211B18]/90 p-5">
        <h3 className="text-sm font-bold text-[#8B3A2B] dark:text-[#C86D55]">
          四、免责重申
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#2E1F18] dark:text-[#EFE6D8]">
          {MANDATORY_DISCLAIMER}
        </p>
      </section>
    </div>
  );
};
