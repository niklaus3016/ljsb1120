import React, { useMemo, useState } from 'react';
import { Search, Trash2, X } from 'lucide-react';
import { OUTCOME_DATA, type DivinationRecord, type JiaobeiOutcome } from '../types';
import { getPrimaryOutcome, getShengbeiStreak } from '../utils/storage';

interface RecordsViewProps {
  records: DivinationRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

type FilterOutcome = '全部' | JiaobeiOutcome;

export const RecordsView: React.FC<RecordsViewProps> = ({
  records,
  onDeleteRecord,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterOutcome>('全部');
  const [selectedRecord, setSelectedRecord] = useState<DivinationRecord | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((rec) => {
      const primary = getPrimaryOutcome(rec.resultList);
      const matchesFilter =
        filter === '全部' || primary === filter || rec.resultList.includes(filter);
      const matchesQuery =
        !q ||
        rec.askText.toLowerCase().includes(q) ||
        rec.resultList.some((r) => r.includes(q));
      return matchesFilter && matchesQuery;
    });
  }, [records, searchQuery, filter]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#5C463B]/15 dark:border-[#EFE6D8]/12 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-[0.08em] text-[#2E1F18] dark:text-[#EFE6D8]">
            本地记录簿
          </h2>
          <p className="mt-1 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
            共 {records.length} 条问事记录 · 仅保存在本机沙盒存储
          </p>
        </div>

        {records.length > 0 && (
          <button
            type="button"
            onClick={() => setConfirmClearAll(true)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-[#8B3A2B]/30 dark:border-[#C86D55]/35 text-xs font-medium text-[#8B3A2B] dark:text-[#C86D55] hover:bg-[#8B3A2B]/8 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>清空全部记录</span>
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7B6356] dark:text-[#9C8A7A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="按问事文字搜索历史记录"
            className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl border border-[#5C463B]/20 dark:border-[#EFE6D8]/15 bg-[#FBF8F1]/90 dark:bg-[#211B18]/90 text-sm text-[#2E1F18] dark:text-[#EFE6D8] placeholder:text-[#9C8A7A] focus:outline-none focus:ring-2 focus:ring-[#8B3A2B]/35"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFE7D8]/90 dark:bg-[#211B18]/90 border border-[#5C463B]/15 dark:border-[#EFE6D8]/12 overflow-x-auto">
          {(['全部', '圣茭', '笑茭', '阴茭'] as FilterOutcome[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                filter === tab
                  ? 'bg-[#FBF8F1] dark:bg-[#322823] text-[#8B3A2B] dark:text-[#C86D55] shadow-sm'
                  : 'text-[#5C463B] dark:text-[#CBBBA8] hover:text-[#2E1F18] dark:hover:text-[#EFE6D8]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[#5C463B]/14 dark:border-[#EFE6D8]/10 bg-[#FBF8F1]/65 dark:bg-[#211B18]/65 px-6 py-12 text-center">
          <p className="text-sm font-medium text-[#5C463B] dark:text-[#CBBBA8]">
            {records.length === 0 ? '暂无本地问事记录' : '未检索到相符的历史记录'}
          </p>
          <p className="mt-1.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
            {records.length === 0
              ? '在首页掷杯后，可点击「记录本次问事」留存本地备忘'
              : '可更换搜索关键词或筛选条件查看'}
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-[#5C463B]/12 dark:divide-[#EFE6D8]/10 rounded-2xl border border-[#5C463B]/16 dark:border-[#EFE6D8]/12 bg-[#FBF8F1]/85 dark:bg-[#211B18]/85 overflow-hidden">
          {filteredRecords.map((rec) => {
            const primary = getPrimaryOutcome(rec.resultList);
            const streak = getShengbeiStreak(rec.resultList);
            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedRecord(rec);
                  }
                }}
                className="w-full text-left px-4 sm:px-5 py-4 hover:bg-[#EFE7D8]/55 dark:hover:bg-[#2A221E] transition-colors cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium text-[#2E1F18] dark:text-[#EFE6D8] truncate">
                    {rec.askText}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
                    <span className="tabular-nums">{rec.createTime}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rec.isContinuous ? '连掷模式' : '单次掷杯'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rec.resultList.join(' → ')}</span>
                    {rec.isContinuous && streak > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>连得圣茭 {streak} 次</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-sm font-semibold tracking-wider ${
                      primary === '圣茭'
                        ? 'text-[#8B3A2B] dark:text-[#C86D55]'
                        : primary === '笑茭'
                          ? 'text-[#6D563B] dark:text-[#D1B58F]'
                          : 'text-[#5C463B] dark:text-[#9C8A7A]'
                    }`}
                  >
                    {primary}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-[2px] p-0 sm:p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-[#5C463B]/20 dark:border-[#EFE6D8]/15 bg-[#FBF8F1] dark:bg-[#211B18] p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#5C463B]/12 dark:border-[#EFE6D8]/12 pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#2E1F18] dark:text-[#EFE6D8]">
                  问事详情
                </h3>
                <p className="mt-0.5 text-xs tabular-nums text-[#7B6356] dark:text-[#9C8A7A]">
                  {selectedRecord.createTime}
                </p>
              </div>
              <button
                type="button"
                aria-label="关闭详情"
                onClick={() => setSelectedRecord(null)}
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center text-[#5C463B] dark:text-[#CBBBA8] hover:text-[#2E1F18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="text-xs text-[#7B6356] dark:text-[#9C8A7A]">所问之事</div>
                <p className="mt-1 text-base font-medium text-[#2E1F18] dark:text-[#EFE6D8] leading-relaxed">
                  {selectedRecord.askText}
                </p>
              </div>

              <div>
                <div className="text-xs text-[#7B6356] dark:text-[#9C8A7A]">
                  {selectedRecord.isContinuous ? '连掷结果序列' : '掷杯结果'}
                </div>
                <p className="mt-1 text-sm font-semibold text-[#8B3A2B] dark:text-[#C86D55]">
                  {selectedRecord.resultList.join(' → ')}
                </p>
                {selectedRecord.isContinuous && (
                  <p className="mt-1 text-xs text-[#5C463B] dark:text-[#CBBBA8]">
                    本轮共得圣茭 {getShengbeiStreak(selectedRecord.resultList)} 次
                  </p>
                )}
              </div>

              <div className="rounded-xl bg-[#EFE7D8]/70 dark:bg-[#161210]/70 p-3.5 text-xs leading-relaxed text-[#5C463B] dark:text-[#CBBBA8]">
                {OUTCOME_DATA[getPrimaryOutcome(selectedRecord.resultList)].detail}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 pb-safe">
              <button
                type="button"
                onClick={() => {
                  onDeleteRecord(selectedRecord.id);
                  setSelectedRecord(null);
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#8B3A2B]/35 dark:border-[#C86D55]/40 text-sm font-medium text-[#8B3A2B] dark:text-[#C86D55] hover:bg-[#8B3A2B]/8 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>删除单条</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-[#2E1F18] dark:bg-[#EFE6D8] text-[#FBF8F1] dark:text-[#161210] text-sm font-medium"
              >
                返回记录簿
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Clear All Modal */}
      {confirmClearAll && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4"
          onClick={() => setConfirmClearAll(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-[#5C463B]/20 dark:border-[#EFE6D8]/15 bg-[#FBF8F1] dark:bg-[#211B18] p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold text-[#2E1F18] dark:text-[#EFE6D8]">
              确认清空全部记录？
            </h3>
            <p className="mt-2 text-sm text-[#5C463B] dark:text-[#CBBBA8] leading-relaxed">
              所有记录均仅存于本地，清空后将无法恢复。是否继续？
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmClearAll(false)}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl border border-[#5C463B]/20 dark:border-[#EFE6D8]/15 text-sm font-medium text-[#5C463B] dark:text-[#CBBBA8]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setConfirmClearAll(false);
                }}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210] text-sm font-semibold"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
