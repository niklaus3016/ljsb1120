import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { AnimationQuality, CupFace, JiaobeiOutcome, TriggerMode } from '../types';

interface JiaobeiStageProps {
  leftFace: CupFace;
  rightFace: CupFace;
  isThrowing: boolean;
  hasThrown: boolean;
  outcome: JiaobeiOutcome | null;
  triggerMode: TriggerMode;
  animationQuality: AnimationQuality;
  meditationRemaining: number;
  throwSeed: number;
  onThrow: () => void;
}

interface CupSvgProps {
  face: CupFace;
  side: 'left' | 'right';
}

const JiaobeiBlockSvg: React.FC<CupSvgProps> = ({ face, side }) => {
  const isYang = face === 'yang';
  const mirror = side === 'right' ? 'scale(-1, 1)' : undefined;

  return (
    <svg
      viewBox="0 0 120 180"
      className="w-24 h-36 sm:w-28 sm:h-40 select-none overflow-visible"
      aria-label={isYang ? '阳面朝上（平面）' : '阴面朝上（凸面）'}
    >
      <defs>
        <linearGradient id={`yang-grad-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2DFBE" />
          <stop offset="55%" stopColor="#E1C292" />
          <stop offset="100%" stopColor="#C89F69" />
        </linearGradient>
        <linearGradient id={`yin-grad-${side}`} x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#B6503C" />
          <stop offset="42%" stopColor="#8B3A2B" />
          <stop offset="100%" stopColor="#4F1E15" />
        </linearGradient>
        <linearGradient id={`yin-highlight-${side}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="48%" stopColor="#F8E1C8" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g transform={mirror} style={{ transformOrigin: '60px 90px' }}>
        {/* Crescent moon Jiaobei silhouette */}
        <path
          d="M84 18C44 36 22 65 22 90s22 54 62 72c8.5 3.8 16.5-2.6 12.2-11.2-14.2-28.4-20-46.8-20-60.8s5.8-32.4 20-60.8C100.5 20.6 92.5 14.2 84 18Z"
          fill={isYang ? `url(#yang-grad-${side})` : `url(#yin-grad-${side})`}
          stroke={isYang ? '#9A6D43' : '#3C160F'}
          strokeWidth="2"
        />

        {isYang ? (
          /* Yang (flat carved inner face): subtle wood grain lines & beveled border */
          <g>
            <path
              d="M80 26C48 42 30 67 30 90s18 48 50 64c4.5 2.2 8.5-.8 6.4-5.5C74 123 68.5 106 68.5 90s5.5-33 17.9-58.5C88.5 26.8 84.5 23.8 80 26Z"
              fill="none"
              stroke="#B28454"
              strokeOpacity="0.55"
              strokeWidth="1.2"
            />
            <path
              d="M52 48c-8 14-12 28-12 42s4 28 12 42"
              fill="none"
              stroke="#A37243"
              strokeOpacity="0.32"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M61 56c-5 11-7.5 22-7.5 34s2.5 23 7.5 34"
              fill="none"
              stroke="#A37243"
              strokeOpacity="0.26"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </g>
        ) : (
          /* Yin (convex rounded lacquered back): arched specular ridge */
          <g>
            <path
              d="M78 24C46 41 28 66 28 90s18 49 50 66c3 1.6 6 .5 7-2.2-13-25-19-45-19-63.8S72 51.2 85 26.2c-1-2.7-4-3.8-7-2.2Z"
              fill={`url(#yin-highlight-${side})`}
            />
            <path
              d="M46 45c-10 15-15 30-15 45s5 30 15 45"
              fill="none"
              stroke="#F3D6B8"
              strokeOpacity="0.22"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        )}
      </g>
    </svg>
  );
};

export const JiaobeiStage: React.FC<JiaobeiStageProps> = ({
  leftFace,
  rightFace,
  isThrowing,
  hasThrown,
  outcome,
  triggerMode,
  animationQuality,
  meditationRemaining,
  throwSeed,
  onThrow,
}) => {
  const pointerStartY = useRef<number | null>(null);
  const [motionPermissionState, setMotionPermissionState] = useState<'idle' | 'granted' | 'denied' | 'unsupported'>('idle');
  const lastShakeAt = useRef(0);

  const isLocked = isThrowing || meditationRemaining > 0;
  // Refs keep the sensor listener stable across the once-per-second countdown
  // renders instead of tearing it down and re-registering every render.
  const onThrowRef = useRef(onThrow);
  const isLockedRef = useRef(isLocked);
  useEffect(() => {
    onThrowRef.current = onThrow;
  }, [onThrow]);
  useEffect(() => {
    isLockedRef.current = isLocked;
  }, [isLocked]);

  // Accelerometer shake listener when triggerMode === 'shake'
  useEffect(() => {
    if (triggerMode !== 'shake') return;
    if (typeof window === 'undefined' || !('DeviceMotionEvent' in window)) {
      setMotionPermissionState('unsupported');
      return;
    }

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;
      const x = acc.x ?? 0;
      const y = acc.y ?? 0;
      const z = acc.z ?? 0;
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      // Threshold tuned for deliberate phone shake (~22 m/s^2 including gravity)
      if (magnitude > 22) {
        const now = Date.now();
        if (now - lastShakeAt.current > 1100 && !isLockedRef.current) {
          lastShakeAt.current = now;
          onThrowRef.current();
        }
      }
    };

    const DME = window.DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof DME.requestPermission !== 'function') {
      window.addEventListener('devicemotion', handleMotion);
      setMotionPermissionState('granted');
      return () => window.removeEventListener('devicemotion', handleMotion);
    } else if (motionPermissionState === 'granted') {
      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [triggerMode, motionPermissionState]);

  const requestShakePermission = async () => {
    const DME = window.DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof DME?.requestPermission === 'function') {
      try {
        const res = await DME.requestPermission();
        setMotionPermissionState(res);
      } catch {
        setMotionPermissionState('denied');
      }
    }
  };

  // Support tap OR downward swipe on the ritual tray
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartY.current = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isLocked) return;
    const startY = pointerStartY.current;
    pointerStartY.current = null;
    if (startY === null) return;

    const deltaY = e.clientY - startY;
    // If the device has no shake sensor, treat the tray as tap-to-throw.
    const tapAllowed =
      triggerMode === 'tap' || motionPermissionState === 'unsupported';
    // Downward swipe >= 36px always throws, or tap when tap-to-throw is active
    if (deltaY >= 36 || (tapAllowed && Math.abs(deltaY) < 18)) {
      onThrow();
    }
  };

  const handlePointerCancel = () => {
    pointerStartY.current = null;
  };

  const idleHint =
    triggerMode === 'shake' && motionPermissionState !== 'unsupported'
      ? '轻摇手机或向下轻滑掷杯'
      : '轻触杯盘或向下轻滑掷杯';

  // Deterministic slight organic resting angle per throwSeed
  const leftRestAngle = hasThrown ? ((throwSeed * 17) % 24) - 18 : -8;
  const rightRestAngle = hasThrown ? ((throwSeed * 29) % 24) - 6 : 8;
  const fullAnim = animationQuality === 'full';

  return (
    <div className="flex flex-col items-center w-full">
      {/* Circular wooden ritual tray */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isLocked) {
            e.preventDefault();
            onThrow();
          }
        }}
        aria-label={
          meditationRemaining > 0
            ? `静心中，剩余 ${meditationRemaining} 秒`
            : triggerMode === 'shake'
              ? '摇晃手机或下滑投掷圣杯'
              : '点击或下滑投掷圣杯'
        }
        className={`relative w-full max-w-[340px] sm:max-w-[380px] aspect-square rounded-full flex items-center justify-center select-none touch-pan-y transition-transform duration-200 border ${
          isLocked ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
        } bg-[#EFE7D8]/90 dark:bg-[#211B18]/90 border-[#5C463B]/20 dark:border-[#EFE6D8]/15 shadow-[inset_0_2px_18px_rgba(46,31,24,0.08),0_10px_28px_rgba(46,31,24,0.08)] dark:shadow-[inset_0_2px_20px_rgba(0,0,0,0.45),0_12px_30px_rgba(0,0,0,0.45)]`}
      >
        {/* Inner engraved ritual ring */}
        <div className="absolute inset-4 rounded-full border border-[#8B3A2B]/18 dark:border-[#C86D55]/20 pointer-events-none" />
        <div className="absolute inset-7 rounded-full border border-dashed border-[#5C463B]/15 dark:border-[#EFE6D8]/10 pointer-events-none" />

        {/* Meditation breathing halo when countdown active */}
        {meditationRemaining > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-[#F7F2E8]/80 dark:bg-[#161210]/85 backdrop-blur-[2px] z-20 px-6 text-center">
            <div className="w-24 h-24 rounded-full border border-[#8B3A2B]/40 dark:border-[#C86D55]/50 flex items-center justify-center mb-3">
              <span className="text-3xl font-bold tabular-nums text-[#8B3A2B] dark:text-[#C86D55]">
                {meditationRemaining}s
              </span>
            </div>
            <p className="text-sm font-medium text-[#2E1F18] dark:text-[#EFE6D8]">净心凝神，默念所问</p>
            <p className="mt-1 text-xs text-[#7B6356] dark:text-[#9C8A7A]">倒计时结束后即可掷杯</p>
          </div>
        )}

        {/* Twin Jiaobei blocks */}
        <div className="relative z-10 flex items-center justify-center gap-5 sm:gap-7 px-4">
          {/* Left block + horizontal label */}
          <div className="flex flex-col items-center">
            <motion.div
              key={`left-${throwSeed}-${isThrowing ? 'toss' : 'land'}`}
              initial={false}
              animate={
                isThrowing
                  ? fullAnim
                    ? {
                        y: [0, -82, -16, 4, 0],
                        x: [0, -14, 8, -4, 0],
                        rotate: [leftRestAngle, leftRestAngle - 210, leftRestAngle - 390, leftRestAngle - 355, leftRestAngle],
                        scale: [1, 1.14, 0.96, 1.02, 1],
                        opacity: [1, 0.94, 1, 1, 1],
                      }
                    : {
                        y: [0, -24, 0],
                        scale: [1, 0.94, 1],
                        opacity: [1, 0.55, 1],
                      }
                  : {
                      y: 0,
                      x: 0,
                      rotate: leftRestAngle,
                      scale: 1,
                      opacity: 1,
                    }
              }
              transition={{
                duration: isThrowing ? (fullAnim ? 0.72 : 0.3) : 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="drop-shadow-[0_8px_10px_rgba(46,31,24,0.22)] dark:drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)]"
            >
              <JiaobeiBlockSvg face={leftFace} side="left" />
            </motion.div>
            <span
              className={`mt-2 text-xs font-medium tracking-[0.14em] transition-opacity duration-150 ${
                isThrowing ? 'opacity-0' : 'opacity-100'
              } ${
                leftFace === 'yang'
                  ? 'text-[#7A5532] dark:text-[#E5C99E]'
                  : 'text-[#8B3A2B] dark:text-[#D5816B]'
              }`}
            >
              {leftFace === 'yang' ? '阳 · 平面' : '阴 · 凸面'}
            </span>
          </div>

          {/* Right block + horizontal label */}
          <div className="flex flex-col items-center">
            <motion.div
              key={`right-${throwSeed}-${isThrowing ? 'toss' : 'land'}`}
              initial={false}
              animate={
                isThrowing
                  ? fullAnim
                    ? {
                        y: [0, -90, -10, 6, 0],
                        x: [0, 16, -6, 4, 0],
                        rotate: [rightRestAngle, rightRestAngle + 230, rightRestAngle + 380, rightRestAngle + 350, rightRestAngle],
                        scale: [1, 1.16, 0.95, 1.02, 1],
                        opacity: [1, 0.94, 1, 1, 1],
                      }
                    : {
                        y: [0, -24, 0],
                        scale: [1, 0.94, 1],
                        opacity: [1, 0.55, 1],
                      }
                  : {
                      y: 0,
                      x: 0,
                      rotate: rightRestAngle,
                      scale: 1,
                      opacity: 1,
                    }
              }
              transition={{
                duration: isThrowing ? (fullAnim ? 0.76 : 0.3) : 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="drop-shadow-[0_8px_10px_rgba(46,31,24,0.22)] dark:drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)]"
            >
              <JiaobeiBlockSvg face={rightFace} side="right" />
            </motion.div>
            <span
              className={`mt-2 text-xs font-medium tracking-[0.14em] transition-opacity duration-150 ${
                isThrowing ? 'opacity-0' : 'opacity-100'
              } ${
                rightFace === 'yang'
                  ? 'text-[#7A5532] dark:text-[#E5C99E]'
                  : 'text-[#8B3A2B] dark:text-[#D5816B]'
              }`}
            >
              {rightFace === 'yang' ? '阳 · 平面' : '阴 · 凸面'}
            </span>
          </div>
        </div>

        {/* Subtle idle prompt inside bottom arc of tray */}
        {!hasThrown && !isThrowing && meditationRemaining === 0 && (
          <div className="absolute bottom-7 left-0 right-0 text-center pointer-events-none">
            <span className="text-xs tracking-[0.18em] text-[#7B6356] dark:text-[#9C8A7A]">
              {idleHint}
            </span>
          </div>
        )}

        {/* Current settled outcome watermark-free crisp seal label at tray bottom */}
        {hasThrown && !isThrowing && outcome && meditationRemaining === 0 && (
          <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#8B3A2B] dark:text-[#C86D55]">
              {outcome}
            </span>
          </div>
        )}
      </div>

      {/* Sensor permission prompt if iOS Safari shake mode needs explicit user gesture */}
      {triggerMode === 'shake' && motionPermissionState === 'idle' && (
        <button
          type="button"
          onClick={requestShakePermission}
          className="mt-3 min-h-[44px] px-4 py-2 text-xs font-medium rounded-xl border border-[#8B3A2B]/35 dark:border-[#C86D55]/40 text-[#8B3A2B] dark:text-[#C86D55] hover:bg-[#8B3A2B]/8 transition-colors"
        >
          授权摇晃传感器权限
        </button>
      )}
    </div>
  );
};
