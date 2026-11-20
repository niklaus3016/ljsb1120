import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, RotateCcw, BookmarkPlus } from 'lucide-react';
import {
  OUTCOME_DATA,
  type AppSettings,
  type CupFace,
  type DivinationRecord,
  type JiaobeiOutcome,
  type MeditationDuration,
} from '../types';
import {
  playMeditationComplete,
  playThrowWhoosh,
  playWoodLand,
  warmUpAudio,
} from '../utils/audio';
import { formatCreateTime, generateId, getShengbeiStreak } from '../utils/storage';
import { MeditateIcon } from './Icons';
import { JiaobeiStage } from './JiaobeiStage';

interface HomeViewProps {
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onSaveRecord: (record: DivinationRecord) => void;
  onUpdateRecord: (record: DivinationRecord) => void;
}

function rollJiaobeiFaces(): { left: CupFace; right: CupFace; outcome: JiaobeiOutcome } {
  const left: CupFace = Math.random() < 0.5 ? 'yang' : 'yin';
  const right: CupFace = Math.random() < 0.5 ? 'yang' : 'yin';

  let outcome: JiaobeiOutcome;
  if (left !== right) {
    outcome = '圣茭';
  } else if (left === 'yang' && right === 'yang') {
    outcome = '笑茭';
  } else {
    outcome = '阴茭';
  }
  return { left, right, outcome };
}

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  onUpdateSettings,
  onSaveRecord,
  onUpdateRecord,
}) => {
  const [askText, setAskText] = useState('');
  const [leftFace, setLeftFace] = useState<CupFace>('yang');
  const [rightFace, setRightFace] = useState<CupFace>('yin');
  const [isThrowing, setIsThrowing] = useState(false);
  const [hasThrown, setHasThrown] = useState(false);
  const [throwSeed, setThrowSeed] = useState(1);

  const [roundResults, setRoundResults] = useState<JiaobeiOutcome[]>([]);
  const [isContinuousEnded, setIsContinuousEnded] = useState(false);
  const [showResultCard, setShowResultCard] = useState(false);
  const [savedThisRound, setSavedThisRound] = useState(false);
  // Keeps the record saved mid-round in sync, so continuing the round does not
  // create duplicate entries or leave a stale partial result in the records.
  const savedRecordRef = useRef<DivinationRecord | null>(null);

  // Meditation countdown state
  const [meditationDuration, setMeditationDuration] = useState<MeditationDuration>(
    settings.meditationDefault
  );
  const [meditationRemaining, setMeditationRemaining] = useState(0);
  const timerRef = useRef<number | null>(null);
  const throwTimerRef = useRef<number | null>(null);
  const meditationEndAtRef = useRef<number | null>(null);
  const meditationDoneRef = useRef(false);

  useEffect(() => {
    setMeditationDuration(settings.meditationDefault);
  }, [settings.meditationDefault]);

  useEffect(() => {
    if (meditationRemaining <= 0) return;

    const tick = () => {
      const endAt = meditationEndAtRef.current;
      if (endAt === null) return;
      // Derive the remaining time from a wall-clock deadline so background
      // throttling or screen lock cannot stretch the countdown.
      const remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setMeditationRemaining(remaining);
      if (remaining > 0 || meditationDoneRef.current) return;
      meditationDoneRef.current = true;
      if (settings.soundEnabled) {
        playMeditationComplete();
      }
      if (settings.vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(45);
      }
    };

    const timer = window.setInterval(tick, 250);
    timerRef.current = timer;
    return () => {
      window.clearInterval(timer);
      if (timerRef.current === timer) timerRef.current = null;
    };
  }, [meditationRemaining > 0, settings.soundEnabled, settings.vibrationEnabled]);

  useEffect(() => {
    return () => {
      if (throwTimerRef.current) window.clearTimeout(throwTimerRef.current);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const currentOutcome: JiaobeiOutcome | null =
    roundResults.length > 0 ? roundResults[roundResults.length - 1] : null;
  const streakCount = getShengbeiStreak(roundResults);

  const startMeditation = (seconds: MeditationDuration) => {
    setMeditationDuration(seconds);
    if (seconds > 0) {
      // Creating/resuming the AudioContext inside the click handler unlocks
      // audio on iOS so the completion chime can play later.
      if (settings.soundEnabled) warmUpAudio();
      meditationEndAtRef.current = Date.now() + seconds * 1000;
      meditationDoneRef.current = false;
      setMeditationRemaining(seconds);
    } else {
      meditationEndAtRef.current = null;
      meditationDoneRef.current = false;
      setMeditationRemaining(0);
    }
  };

  const cancelMeditation = () => {
    meditationEndAtRef.current = null;
    meditationDoneRef.current = false;
    setMeditationRemaining(0);
  };

  const handleThrow = () => {
    if (isThrowing || meditationRemaining > 0) return;

    // If continuous mode ended on previous throw, require reset or auto-start fresh round
    const startingFreshRound = settings.continuousMode && isContinuousEnded;

    const { left, right, outcome } = rollJiaobeiFaces();

    if (settings.soundEnabled) {
      playThrowWhoosh();
    }

    setIsThrowing(true);
    setShowResultCard(false);
    if (!settings.continuousMode || startingFreshRound) {
      savedRecordRef.current = null;
      setSavedThisRound(false);
    }
    setThrowSeed((s) => s + 1);

    const animDurationMs = settings.animationQuality === 'full' ? 720 : 300;

    if (throwTimerRef.current) window.clearTimeout(throwTimerRef.current);
    throwTimerRef.current = window.setTimeout(() => {
      setLeftFace(left);
      setRightFace(right);
      setIsThrowing(false);
      setHasThrown(true);

      if (settings.soundEnabled) {
        playWoodLand(outcome);
      }

      if (settings.vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        if (outcome === '圣茭') {
          navigator.vibrate([35, 50, 35]);
        } else if (outcome === '笑茭') {
          navigator.vibrate(45);
        } else {
          navigator.vibrate([60, 40, 25]);
        }
      }

      const nextResults = settings.continuousMode
        ? [...(startingFreshRound ? [] : roundResults), outcome]
        : [outcome];

      setRoundResults(nextResults);
      setIsContinuousEnded(settings.continuousMode && outcome !== '圣茭');

      if (settings.continuousMode && savedRecordRef.current) {
        const updated: DivinationRecord = {
          ...savedRecordRef.current,
          askText: askText.trim() || savedRecordRef.current.askText,
          resultList: nextResults,
        };
        savedRecordRef.current = updated;
        onUpdateRecord(updated);
      }

      setShowResultCard(true);
    }, animDurationMs);
  };

  const handleReset = () => {
    if (throwTimerRef.current) window.clearTimeout(throwTimerRef.current);
    setIsThrowing(false);
    setHasThrown(false);
    setRoundResults([]);
    setIsContinuousEnded(false);
    setShowResultCard(false);
    savedRecordRef.current = null;
    setSavedThisRound(false);
    setLeftFace('yang');
    setRightFace('yin');
  };

  const handleRecordRound = () => {
    if (roundResults.length === 0 || savedThisRound) return;
    const record: DivinationRecord = {
      id: generateId(),
      askText: askText.trim() || '默祷未书',
      createTime: formatCreateTime(new Date()),
      resultList: [...roundResults],
      isContinuous: settings.continuousMode,
    };
    onSaveRecord(record);
    savedRecordRef.current = record;
    setSavedThisRound(true);
  };

  const outcomeInfo = currentOutcome ? OUTCOME_DATA[currentOutcome] : null;
  const canContinueThrowing =
    !isThrowing &&
    meditationRemaining === 0 &&
    (!settings.continuousMode || !isContinuousEnded);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left column: Ritual Stage & Throw Action */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <JiaobeiStage
            leftFace={leftFace}
            rightFace={rightFace}
            isThrowing={isThrowing}
            hasThrown={hasThrown}
            outcome={currentOutcome}
            triggerMode={settings.triggerMode}
            animationQuality={settings.animationQuality}
            meditationRemaining={meditationRemaining}
            throwSeed={throwSeed}
            onThrow={handleThrow}
          />

          {/* Primary Action Controls (Ergonomic Thumb Reach) */}
          <div className="mt-5 w-full max-w-[380px] flex items-center gap-3">
            {meditationRemaining > 0 ? (
              <button
                type="button"
                onClick={cancelMeditation}
                className="flex-1 min-h-[48px] px-5 py-3 rounded-xl border border-[#5C463B]/25 dark:border-[#EFE6D8]/20 bg-[#FBF8F1] dark:bg-[#28201C] text-sm font-medium text-[#5C463B] dark:text-[#CBBBA8] hover:bg-[#EFE7D8] dark:hover:bg-[#312722] transition-colors whitespace-nowrap shrink-0"
              >
                结束静心
              </button>
            ) : (
              <button
                type="button"
                disabled={isThrowing}
                onClick={handleThrow}
                className="flex-1 min-h-[48px] px-6 py-3 rounded-xl bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210] text-base font-semibold tracking-[0.14em] shadow-sm hover:bg-[#7A3224] dark:hover:bg-[#D77A62] active:scale-[0.98] disabled:opacity-55 transition-all whitespace-nowrap shrink-0"
              >
                {isThrowing
                  ? '杯起落定中...'
                  : settings.continuousMode && hasThrown && !isContinuousEnded
                    ? '继续连掷'
                    : settings.continuousMode && isContinuousEnded
                      ? '重起一轮连掷'
                      : '掷圣杯'}
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              disabled={!hasThrown && !isThrowing && roundResults.length === 0}
              aria-label="收杯重置"
              className="min-h-[48px] min-w-[48px] px-4 py-3 rounded-xl border border-[#5C463B]/22 dark:border-[#EFE6D8]/16 bg-[#FBF8F1] dark:bg-[#28201C] text-sm font-medium text-[#5C463B] dark:text-[#CBBBA8] hover:bg-[#EFE7D8] dark:hover:bg-[#322823] disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重置</span>
            </button>
          </div>

          {/* Result Popup / Card (Fade in/out) */}
          <AnimatePresence mode="wait">
            {showResultCard && outcomeInfo && (
              <motion.div
                key={`${throwSeed}-${outcomeInfo.name}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 w-full max-w-[440px] rounded-2xl border border-[#5C463B]/18 dark:border-[#EFE6D8]/14 bg-[#FBF8F1]/95 dark:bg-[#211B18]/95 p-5 shadow-sm"
              >
                <div className="flex items-baseline justify-between gap-3 border-b border-[#5C463B]/12 dark:border-[#EFE6D8]/10 pb-3">
                  <div>
                    <h2 className="text-xl font-bold tracking-[0.12em] text-[#8B3A2B] dark:text-[#C86D55]">
                      {outcomeInfo.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
                      {outcomeInfo.altName}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-[#5C463B] dark:text-[#CBBBA8] whitespace-nowrap shrink-0">
                    {outcomeInfo.facesDesc}
                  </span>
                </div>

                <p className="mt-3 text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
                  {outcomeInfo.summary}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#5C463B] dark:text-[#CBBBA8]">
                  {outcomeInfo.detail}
                </p>

                {settings.continuousMode && (
                  <div className="mt-3 pt-3 border-t border-[#5C463B]/10 dark:border-[#EFE6D8]/10 text-xs text-[#5C463B] dark:text-[#CBBBA8]">
                    {isContinuousEnded ? (
                      <p>
                        连掷已止（见{currentOutcome}），本轮共得{' '}
                        <span className="font-semibold tabular-nums text-[#8B3A2B] dark:text-[#C86D55]">
                          {streakCount}
                        </span>{' '}
                        次连续圣茭。
                      </p>
                    ) : (
                      <p>
                        连掷中：已连得{' '}
                        <span className="font-semibold tabular-nums text-[#8B3A2B] dark:text-[#C86D55]">
                          {streakCount}
                        </span>{' '}
                        次圣茭，可继续掷杯。
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleRecordRound}
                    disabled={savedThisRound}
                    className={`flex-1 min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                      savedThisRound
                        ? 'bg-[#EFE7D8] dark:bg-[#2D2521] text-[#7B6356] dark:text-[#9C8A7A]'
                        : 'bg-[#2E1F18] dark:bg-[#EFE6D8] text-[#FBF8F1] dark:text-[#161210] hover:opacity-90'
                    }`}
                  >
                    {savedThisRound ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>已存入记录簿</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-4 h-4" />
                        <span>记录本次问事</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-[#5C463B]/20 dark:border-[#EFE6D8]/15 text-sm text-[#5C463B] dark:text-[#CBBBA8] hover:bg-[#EFE7D8]/70 dark:hover:bg-[#2D2521] transition-colors whitespace-nowrap shrink-0"
                  >
                    收杯
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column: Matter Input, Meditation Countdown & Continuous Mode Panel */}
        <div className="lg:col-span-5 space-y-4">
          {/* Matter Input Card */}
          <section className="rounded-2xl border border-[#5C463B]/16 dark:border-[#EFE6D8]/12 bg-[#FBF8F1]/85 dark:bg-[#211B18]/85 p-4 sm:p-5">
            <label
              htmlFor="ask-matter-input"
              className="block text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]"
            >
              心中所问之事
            </label>
            <textarea
              id="ask-matter-input"
              rows={2}
              maxLength={120}
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              placeholder="心中所问之事（选填，不填也可投掷）"
              className="mt-2.5 w-full rounded-xl border border-[#5C463B]/20 dark:border-[#EFE6D8]/15 bg-[#F7F2E8]/70 dark:bg-[#161210]/70 px-3.5 py-2.5 text-sm text-[#2E1F18] dark:text-[#EFE6D8] placeholder:text-[#9C8A7A] dark:placeholder:text-[#7B6356] focus:outline-none focus:ring-2 focus:ring-[#8B3A2B]/35 dark:focus:ring-[#C86D55]/45 resize-none"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-[#7B6356] dark:text-[#9C8A7A]">
              <span>输入内容仅本地保存，不会外传</span>
              <span className="tabular-nums">{askText.length}/120</span>
            </div>
          </section>

          {/* Continuous Mode & Round Sequence */}
          <section className="rounded-2xl border border-[#5C463B]/16 dark:border-[#EFE6D8]/12 bg-[#FBF8F1]/85 dark:bg-[#211B18]/85 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
                  连掷模式
                </h3>
                <p className="mt-0.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
                  连续掷出圣茭才算应允，遇笑茭或阴茭即止
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.continuousMode}
                aria-label="切换连掷模式"
                onClick={() => {
                  handleReset();
                  onUpdateSettings({ continuousMode: !settings.continuousMode });
                }}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
                  settings.continuousMode
                    ? 'bg-[#8B3A2B] dark:bg-[#C86D55] border-transparent'
                    : 'bg-[#EFE7D8] dark:bg-[#2D2521] border-[#5C463B]/25 dark:border-[#EFE6D8]/20'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-[#FBF8F1] shadow transition-transform ${
                    settings.continuousMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {settings.continuousMode && (
              <div className="mt-3 pt-3 border-t border-[#5C463B]/12 dark:border-[#EFE6D8]/10">
                <div className="flex items-center justify-between text-xs text-[#5C463B] dark:text-[#CBBBA8]">
                  <span>本轮序列</span>
                  <span className="tabular-nums">连续圣茭 {streakCount} 次</span>
                </div>
                {roundResults.length > 0 ? (
                  <p className="mt-1.5 text-sm font-medium text-[#2E1F18] dark:text-[#EFE6D8] leading-relaxed">
                    {roundResults.join(' → ')}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-[#7B6356] dark:text-[#9C8A7A]">
                    尚未投掷，点击下方或轻触杯盘开始本轮连掷
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Meditation Countdown Egg Feature */}
          <section className="rounded-2xl border border-[#5C463B]/16 dark:border-[#EFE6D8]/12 bg-[#FBF8F1]/85 dark:bg-[#211B18]/85 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MeditateIcon className="w-4 h-4 text-[#8B3A2B] dark:text-[#C86D55]" />
                <h3 className="text-sm font-semibold text-[#2E1F18] dark:text-[#EFE6D8]">
                  静心倒计时
                </h3>
              </div>
              <span className="text-xs text-[#7B6356] dark:text-[#9C8A7A]">
                {meditationRemaining > 0 ? `剩余 ${meditationRemaining} 秒` : '投掷前可选静心'}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {([0, 10, 30, 60] as MeditationDuration[]).map((sec) => {
                const active = meditationDuration === sec && (sec === 0 ? meditationRemaining === 0 : true);
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => startMeditation(sec)}
                    className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#8B3A2B] dark:bg-[#C86D55] text-[#FBF8F1] dark:text-[#161210]'
                        : 'bg-[#EFE7D8]/80 dark:bg-[#2D2521] text-[#5C463B] dark:text-[#CBBBA8] hover:bg-[#EFE7D8] dark:hover:bg-[#372D28]'
                    }`}
                  >
                    {sec === 0 ? '不静心' : `${sec}秒`}
                  </button>
                );
              })}
            </div>
          </section>

          {!canContinueThrowing && settings.continuousMode && isContinuousEnded && (
            <p className="text-xs text-center text-[#7B6356] dark:text-[#9C8A7A]">
              本轮连掷已止，可先【记录本次问事】或点击【重起一轮连掷】
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
