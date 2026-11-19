import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { i18n } from '../i18n/pt-BR';

interface EmojiPaletteProps {
  emojis: string[];
  onReact: (emoji: string) => void;
  cooldownTotalSeconds: number;
  nextAllowedAt: number | null; // Timestamp em milissegundos
  disabled?: boolean;
}

export const EmojiPalette: React.FC<EmojiPaletteProps> = ({
  emojis,
  onReact,
  cooldownTotalSeconds,
  nextAllowedAt,
  disabled = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [timeLeftMs, setTimeLeftMs] = useState(0);

  useEffect(() => {
    if (!nextAllowedAt) {
      setTimeLeftMs(0);
      return;
    }

    const updateCooldown = () => {
      const diff = nextAllowedAt - Date.now();
      if (diff <= 0) {
        setTimeLeftMs(0);
      } else {
        setTimeLeftMs(diff);
      }
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 100);
    return () => clearInterval(interval);
  }, [nextAllowedAt]);

  const isInCooldown = timeLeftMs > 0;
  const cooldownFraction = isInCooldown
    ? 1 - timeLeftMs / (cooldownTotalSeconds * 1000)
    : 1;

  // Raio e perímetro do anel SVG circular de espera
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - cooldownFraction * circumference;

  const handleClick = (emoji: string) => {
    if (disabled || isInCooldown) {
      // Ignora o toque sem erro vermelho durante cooldown (RF-014)
      return;
    }
    onReact(emoji);
  };

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFF6EA]/95 backdrop-blur-md border-t border-[#1B2340]/10 px-3 py-3 sm:py-4 transition-all"
      role="toolbar"
      aria-label="Paleta de reações"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {emojis.map((emoji) => {
          const ariaLabel = i18n.room.reactAriaLabel.replace('{emoji}', emoji);

          return (
            <div key={emoji} className="relative flex items-center justify-center">
              {/* Anel de espera SVG durante cooldown */}
              {isInCooldown && (
                <svg
                  className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                  viewBox="0 0 60 60"
                  aria-hidden="true"
                >
                  {/* Trilha de fundo */}
                  <circle
                    cx="30"
                    cy="30"
                    r={radius}
                    stroke="#1B2340"
                    strokeWidth="3"
                    strokeOpacity="0.1"
                    fill="none"
                  />
                  {/* Anel que enche */}
                  <circle
                    cx="30"
                    cy="30"
                    r={radius}
                    stroke="#E8442F"
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-100 ease-linear"
                  />
                </svg>
              )}

              {/* Botão de reação grande (mínimo 44x44px, ideal 56px - RNF-014) */}
              <motion.button
                type="button"
                onClick={() => handleClick(emoji)}
                disabled={disabled}
                aria-label={ariaLabel}
                aria-disabled={isInCooldown || disabled}
                title={ariaLabel}
                whileTap={shouldReduceMotion || isInCooldown ? {} : { scale: 0.88, y: -4 }}
                className={`w-14 h-14 min-w-[44px] min-h-[44px] sm:w-16 sm:h-16 rounded-full bg-white border-2 flex items-center justify-center text-2xl sm:text-3xl shadow-sm transition-all focus:outline-none focus-visible:ring-3 focus-visible:ring-termo-coral active:bg-termo-yellow/10 ${
                  isInCooldown
                    ? 'border-termo-navy/15 cursor-not-allowed opacity-75'
                    : 'border-termo-navy/20 hover:border-termo-coral hover:shadow-md cursor-pointer'
                }`}
              >
                <span className="select-none pointer-events-none" role="img" aria-hidden="true">
                  {emoji}
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Mensagem discreta de espera para leitores de tela e usuários */}
      {isInCooldown && (
        <p className="text-center text-xs text-termo-navy/60 font-body mt-1.5" aria-live="polite">
          {i18n.room.cooldownWaiting.replace(
            '{seconds}',
            Math.ceil(timeLeftMs / 1000).toString()
          )}
        </p>
      )}
    </footer>
  );
};
