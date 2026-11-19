import React from 'react';
import { SummaryWindow } from '../api/types';
import { i18n } from '../i18n/pt-BR';

interface WindowSelectorProps {
  currentWindow: SummaryWindow;
  onChangeWindow: (w: SummaryWindow) => void;
  showAllOption?: boolean;
}

export const WindowSelector: React.FC<WindowSelectorProps> = ({
  currentWindow,
  onChangeWindow,
  showAllOption = false,
}) => {
  const options: SummaryWindow[] = showAllOption
    ? ['30s', '1m', '5m', 'all']
    : ['30s', '1m', '5m'];

  return (
    <div
      className="inline-flex items-center p-1 bg-white/70 backdrop-blur-sm rounded-full border border-termo-navy/15 shadow-sm"
      role="group"
      aria-label={i18n.room.windowSelectorLabel}
    >
      {options.map((win) => {
        const isActive = currentWindow === win;
        const label = i18n.room.windows[win] || win;

        return (
          <button
            key={win}
            type="button"
            onClick={() => onChangeWindow(win)}
            aria-pressed={isActive}
            className={`min-w-[44px] min-h-[36px] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-body font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-coral ${
              isActive
                ? 'bg-termo-navy text-white shadow-sm font-semibold'
                : 'text-termo-navy/70 hover:text-termo-navy hover:bg-black/5'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
