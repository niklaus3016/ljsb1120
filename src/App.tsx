/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { HomeView } from './components/HomeView';
import {
  BookNavIcon,
  JiaobeiNavIcon,
  ScrollNavIcon,
  SealNavIcon,
} from './components/Icons';
import { KnowledgeView } from './components/KnowledgeView';
import { RecordsView } from './components/RecordsView';
import { SettingsView } from './components/SettingsView';
import { SplashScreen } from './components/SplashScreen';
import { LegalConsentGate } from './components/legal/LegalDialogs';
import { LEGAL_VERSION } from './components/legal/LegalContent';
import { usePWAInstall } from './hooks/usePWAInstall';
import type { AppSettings, DivinationRecord, TabKey } from './types';
import {
  loadLegalConsent,
  loadRecords,
  loadSettings,
  saveLegalConsent,
  saveRecords,
  saveSettings,
} from './utils/storage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [legalAccepted, setLegalAccepted] = useState(
    () => loadLegalConsent()?.version === LEGAL_VERSION,
  );
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [records, setRecords] = useState<DivinationRecord[]>(() => loadRecords());
  // Keep the install prompt listener alive for the whole session: the browser
  // fires `beforeinstallprompt` long before the settings tab is ever opened.
  const pwaInstall = usePWAInstall();

  const handleAcceptLegal = useCallback(() => {
    saveLegalConsent(LEGAL_VERSION);
    setLegalAccepted(true);
  }, []);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', settings.theme === 'dark' ? '#161210' : '#8B3A2B');
    }
  }, [settings.theme]);

  const handleUpdateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const handleSaveRecord = useCallback((record: DivinationRecord) => {
    setRecords((prev) => {
      const next = [record, ...prev];
      saveRecords(next);
      return next;
    });
  }, []);

  const handleUpdateRecord = useCallback((record: DivinationRecord) => {
    setRecords((prev) => {
      const next = prev.map((item) => (item.id === record.id ? record : item));
      saveRecords(next);
      return next;
    });
  }, []);

  const handleDeleteRecord = useCallback((id: string) => {
    setRecords((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveRecords(next);
      return next;
    });
  }, []);

  const handleClearAllRecords = useCallback(() => {
    setRecords([]);
    saveRecords([]);
  }, []);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  const handleTabChange = useCallback((tab: TabKey) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  }, []);

  const bgTextureClass =
    settings.backgroundTexture === 'wood'
      ? 'bg-texture-wood'
      : settings.backgroundTexture === 'cloud'
        ? 'bg-texture-cloud'
        : 'bg-texture-paper';

  const navItems: { key: TabKey; label: string }[] = [
    { key: 'home', label: '首页' },
    { key: 'records', label: '记录' },
    { key: 'knowledge', label: '知俗' },
    { key: 'settings', label: '设置' },
  ];

  const renderNavIcon = (key: TabKey, active: boolean) => {
    const cls = 'w-[22px] h-[22px]';
    if (key === 'home') return <JiaobeiNavIcon className={cls} filled={active} />;
    if (key === 'records') return <ScrollNavIcon className={cls} filled={active} />;
    if (key === 'knowledge') return <BookNavIcon className={cls} filled={active} />;
    return <SealNavIcon className={cls} filled={active} />;
  };

  return (
    <div
      className={`min-h-[100dvh] flex flex-col text-[#2E1F18] dark:text-[#EFE6D8] transition-colors duration-200 ${bgTextureClass}`}
    >
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Mobile Main Header */}
      <header className="md:hidden sticky top-0 z-30 pt-safe bg-[#F7F2E8]/92 dark:bg-[#161210]/92 backdrop-blur-md border-b border-[#5C463B]/14 dark:border-[#EFE6D8]/12">
        <div className="h-12 px-4 flex items-center justify-center text-center">
          <h1 className="text-xl font-bold tracking-[0.22em] text-[#2E1F18] dark:text-[#EFE6D8] truncate">
            灵境胜杯
          </h1>
        </div>
      </header>

      {/* Desktop Top Bar (3-zone contract: Brand — Nav Links — Theme Action) */}
      <header className="hidden md:block sticky top-0 z-30 bg-[#F7F2E8]/90 dark:bg-[#161210]/90 backdrop-blur-md border-b border-[#5C463B]/14 dark:border-[#EFE6D8]/12">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleTabChange('home')}
            className="text-xl font-bold tracking-[0.2em] text-[#2E1F18] dark:text-[#EFE6D8] whitespace-nowrap shrink-0 cursor-pointer"
          >
            灵境胜杯
          </button>

          {/* Zone 2: 4 Single-line Nav Links */}
          <nav className="flex items-center gap-7" aria-label="主导航">
            {navItems.map((item) => {
              const active = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleTabChange(item.key)}
                  className={`py-1.5 text-sm font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                    active
                      ? 'border-[#8B3A2B] dark:border-[#C86D55] text-[#8B3A2B] dark:text-[#C86D55]'
                      : 'border-transparent text-[#5C463B] dark:text-[#CBBBA8] hover:text-[#2E1F18] dark:hover:text-[#EFE6D8]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action (Theme toggle) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() =>
                handleUpdateSettings({
                  theme: settings.theme === 'dark' ? 'light' : 'dark',
                })
              }
              className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[#5C463B]/20 dark:border-[#EFE6D8]/16 text-xs font-medium text-[#5C463B] dark:text-[#CBBBA8] hover:bg-[#EFE7D8]/60 dark:hover:bg-[#28201C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {settings.theme === 'dark' ? '浅色宣纸' : '深色檀木'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-8">
        {activeTab === 'home' && (
          <HomeView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onSaveRecord={handleSaveRecord}
            onUpdateRecord={handleUpdateRecord}
          />
        )}
        {activeTab === 'records' && (
          <RecordsView
            records={records}
            onDeleteRecord={handleDeleteRecord}
            onClearAll={handleClearAllRecords}
          />
        )}
        {activeTab === 'knowledge' && <KnowledgeView />}
        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            recordCount={records.length}
            onUpdateSettings={handleUpdateSettings}
            onClearAllRecords={handleClearAllRecords}
            pwaInstall={pwaInstall}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom 4-Tab Bar */}
      <nav
        aria-label="底部导航"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBF8F1]/92 dark:bg-[#1C1613]/92 backdrop-blur-md border-t border-[#5C463B]/15 dark:border-[#EFE6D8]/12 pb-safe"
      >
        <div className="grid grid-cols-4 items-center h-16">
          {navItems.map((item) => {
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleTabChange(item.key)}
                className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-colors ${
                  active
                    ? 'text-[#8B3A2B] dark:text-[#C86D55]'
                    : 'text-[#7B6356] dark:text-[#9C8A7A]'
                }`}
              >
                {renderNavIcon(item.key, active)}
                <span className="text-[11px] font-medium tracking-wider leading-none whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Startup legal consent gate: shown once per policy version. */}
      {!showSplash && !legalAccepted && (
        <LegalConsentGate onAccept={handleAcceptLegal} />
      )}
    </div>
  );
}
