import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Clock, Sparkles } from 'lucide-react';
import { i18n } from '../i18n/pt-BR';

export type BannerType = 'reconnecting' | 'expiring' | 'extended';

interface NotificationBannerProps {
  type: BannerType | null;
  extraMinutes?: number;
  onExtendClick?: () => void;
  showExtendShortcut?: boolean;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type,
  extraMinutes,
  onExtendClick,
  showExtendShortcut = false,
}) => {
  return (
    <AnimatePresence>
      {type && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-40 max-w-sm w-11/12"
          role="status"
          aria-live="polite"
        >
          {type === 'reconnecting' && (
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-termo-navy text-white rounded-full shadow-lg text-xs sm:text-sm font-body font-medium">
              <WifiOff className="w-4 h-4 animate-pulse text-termo-yellow" />
              <span>{i18n.room.reconnecting}</span>
            </div>
          )}

          {type === 'expiring' && (
            <div className="flex items-center justify-between gap-3 px-4 py-2 bg-termo-coral text-white rounded-full shadow-lg text-xs sm:text-sm font-body font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-termo-yellow shrink-0 animate-bounce" />
                <span>{i18n.room.notifications.expiringSoon}</span>
              </div>
              {showExtendShortcut && onExtendClick && (
                <button
                  type="button"
                  onClick={onExtendClick}
                  className="min-h-[32px] px-2.5 py-1 rounded-full bg-white text-termo-coral-dark text-xs font-display font-semibold hover:bg-white/90 shadow-xs"
                >
                  Estender
                </button>
              )}
            </div>
          )}

          {type === 'extended' && (
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full shadow-lg text-xs sm:text-sm font-body font-medium">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>
                {i18n.room.notifications.extended.replace(
                  '{minutes}',
                  (extraMinutes || 15).toString()
                )}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
