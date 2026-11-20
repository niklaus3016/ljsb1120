import type { AppSettings, DivinationRecord, JiaobeiOutcome } from '../types';

const RECORDS_STORAGE_KEY = 'com.ljsb.app.records';
const SETTINGS_STORAGE_KEY = 'com.ljsb.app.settings';
const LEGACY_RECORDS_KEY = 'lingjing_shengbei_records';
const LEGACY_SETTINGS_KEY = 'lingjing_shengbei_settings';

export const DEFAULT_SETTINGS: AppSettings = {
  triggerMode: 'tap',
  soundEnabled: true,
  vibrationEnabled: true,
  animationQuality: 'full',
  continuousMode: false,
  theme: 'light',
  backgroundTexture: 'paper',
  meditationDefault: 0,
};

export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `lj-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatCreateTime(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

const VALID_OUTCOMES = new Set<string>(['圣茭', '笑茭', '阴茭']);

export function loadRecords(): DivinationRecord[] {
  try {
    const raw =
      localStorage.getItem(RECORDS_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_RECORDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is DivinationRecord =>
        item &&
        typeof item.id === 'string' &&
        typeof item.askText === 'string' &&
        typeof item.createTime === 'string' &&
        Array.isArray(item.resultList) &&
        item.resultList.length > 0 &&
        item.resultList.every((result: unknown) => typeof result === 'string' && VALID_OUTCOMES.has(result)) &&
        typeof item.isContinuous === 'boolean'
    );
  } catch {
    return [];
  }
}

export function saveRecords(records: DivinationRecord[]): void {
  try {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
    localStorage.removeItem(LEGACY_RECORDS_KEY);
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw =
      localStorage.getItem(SETTINGS_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    localStorage.removeItem(LEGACY_SETTINGS_KEY);
  } catch {
    // Ignore storage errors gracefully
  }
}

const CONSENT_STORAGE_KEY = 'com.ljsb.app.consent';

export interface LegalConsentRecord {
  version: string;
  acceptedAt: string;
}

export function loadLegalConsent(): LegalConsentRecord | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.version !== 'string') return null;
    return {
      version: parsed.version,
      acceptedAt: typeof parsed.acceptedAt === 'string' ? parsed.acceptedAt : '',
    };
  } catch {
    return null;
  }
}

export function saveLegalConsent(version: string): void {
  try {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ version, acceptedAt: new Date().toISOString() }),
    );
  } catch {
    // Ignore storage errors gracefully; the in-memory state still proceeds.
  }
}

export function getPrimaryOutcome(resultList: JiaobeiOutcome[]): JiaobeiOutcome {
  if (resultList.length === 0) return '圣茭';
  return resultList[resultList.length - 1];
}

export function getShengbeiStreak(resultList: JiaobeiOutcome[]): number {
  return resultList.filter((r) => r === '圣茭').length;
}
