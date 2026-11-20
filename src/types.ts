export type JiaobeiOutcome = '圣茭' | '笑茭' | '阴茭';

export type CupFace = 'yang' | 'yin'; // yang = 平面(正), yin = 凸面(反)

export type TriggerMode = 'tap' | 'shake';
export type AnimationQuality = 'full' | 'simple';
export type ThemeMode = 'light' | 'dark';
export type BackgroundTexture = 'paper' | 'wood' | 'cloud';
export type MeditationDuration = 0 | 10 | 30 | 60;
export type TabKey = 'home' | 'records' | 'knowledge' | 'settings';

export interface DivinationRecord {
  id: string;
  askText: string;
  createTime: string;
  resultList: JiaobeiOutcome[];
  isContinuous: boolean;
}

export interface AppSettings {
  triggerMode: TriggerMode;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  animationQuality: AnimationQuality;
  continuousMode: boolean;
  theme: ThemeMode;
  backgroundTexture: BackgroundTexture;
  meditationDefault: MeditationDuration;
}

export interface OutcomeInfo {
  name: JiaobeiOutcome;
  altName: string;
  facesDesc: string;
  summary: string;
  detail: string;
}

export const APP_PACKAGE_ID = 'com.ljsb.app';

export const MANDATORY_DISCLAIMER =
  '灵境胜杯仅为潮汕筊杯民俗文化模拟娱乐工具，所有结果不构成任何人生、投资、决策建议，请勿迷信。';

export const OUTCOME_DATA: Record<JiaobeiOutcome, OutcomeInfo> = {
  圣茭: {
    name: '圣茭',
    altName: '圣杯 · 一正一反',
    facesDesc: '一阳面朝上，一阴面朝上',
    summary: '吉 · 神明应允，顺遂可行',
    detail: '阴阳相合，主所问之事得其应允，气机顺畅，可怀诚意稳步推行。',
  },
  笑茭: {
    name: '笑茭',
    altName: '笑杯 · 两面朝上',
    facesDesc: '双阳面（平面）朝上',
    summary: '变 · 主意未定，尚存变数',
    detail: '双阳呈笑，意指事尚在酝酿或问者心中犹疑，宜先理清念头、察明情况后再问。',
  },
  阴茭: {
    name: '阴茭',
    altName: '阴杯 · 两面朝下',
    facesDesc: '双阴面（凸面）朝上',
    summary: '慎 · 时机未至，此事不宜',
    detail: '双阴背覆，主当下条件未备或行事易阻，宜暂缓静守、另谋周全之道。',
  },
};
