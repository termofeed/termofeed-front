import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Summary, SummaryWindow } from '../api/types';
import { i18n } from '../i18n/pt-BR';

interface ThermometerProps {
  summary: Summary | null;
  windowLabel?: SummaryWindow;
  className?: string;
  isFrozen?: boolean; // Para a tela de resumo final
}

export const Thermometer: React.FC<ThermometerProps> = ({
  summary,
  windowLabel = '1m',
  className = '',
  isFrozen = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [prevDominant, setPrevDominant] = useState<string | null>(null);
  const [pulseDominant, setPulseDominant] = useState(false);

  const dominantEmoji = summary?.dominantEmoji || null;
  const dominantItem = summary?.ranking?.find((r) => r.emoji === dominantEmoji);
  const dominantPercentage = dominantItem ? Math.round(dominantItem.percentage) : 0;
  const totalReactions = summary?.totalReactions || 0;

  // Animar "crescer um pouco e voltar" quando o emoji dominante mudar
  useEffect(() => {
    if (dominantEmoji && dominantEmoji !== prevDominant) {
      setPulseDominant(true);
      const timer = setTimeout(() => setPulseDominant(false), 400);
      setPrevDominant(dominantEmoji);
      return () => clearTimeout(timer);
    }
  }, [dominantEmoji, prevDominant]);

  // Calcula a altura do mercúrio (entre 12% na base e 92% no topo)
  const mercuryPercent = React.useMemo(() => {
    if (!summary || totalReactions === 0) return 14;
    // Base 20% + até 75% proporcional à porcentagem do dominante ou volume
    const fill = 20 + (dominantPercentage / 100) * 72;
    return Math.min(94, Math.max(16, fill));
  }, [summary, totalReactions, dominantPercentage]);

  // Texto descritivo para acessibilidade (RNF-016)
  const windowText = i18n.room.windows[windowLabel] || windowLabel;
  const accessibleText = dominantEmoji && totalReactions > 0
    ? i18n.room.thermometerAriaLabel
        .replace('{window}', windowText)
        .replace('{dominant}', dominantEmoji)
        .replace('{percentage}', dominantPercentage.toString())
        .replace('{total}', totalReactions.toString())
    : i18n.room.thermometerEmptyAriaLabel.replace('{window}', windowText);

  return (
    <div
      className={`flex flex-col items-center justify-center relative select-none ${className}`}
      role="region"
      aria-label="Termômetro de humor"
    >
      {/* Texto para leitores de tela */}
      <span className="sr-only" aria-live="polite">
        {accessibleText}
      </span>

      {/* Estrutura visual do termômetro em SVG */}
      <div className="relative w-36 h-80 sm:w-44 sm:h-96 flex items-center justify-center">
        <svg
          viewBox="0 0 160 360"
          className="w-full h-full drop-shadow-md overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradiente amarelo -> coral exigido no design */}
            <linearGradient id="mercury-gradient" x1="80" y1="320" x2="80" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFB627" />
              <stop offset="100%" stopColor="#E8442F" />
            </linearGradient>

            {/* Máscara para preenchimento suave da coluna */}
            <clipPath id="tube-clip">
              <rect x="66" y="22" width="28" height="230" rx="14" />
            </clipPath>
          </defs>

          {/* Sombra externa suave */}
          <rect x="64" y="20" width="32" height="234" rx="16" fill="#1B2340" fillOpacity="0.04" />
          <circle cx="80" cy="285" r="46" fill="#1B2340" fillOpacity="0.04" />

          {/* Tubo de vidro externo */}
          <rect
            x="64" y="20" width="32" height="232" rx="16"
            fill="#FFFFFF"
            stroke="#1B2340"
            strokeWidth="5"
          />

          {/* Graduações de nível na lateral do tubo */}
          <g stroke="#1B2340" strokeWidth="3" strokeLinecap="round" opacity="0.45">
            <line x1="104" y1="45" x2="116" y2="45" />
            <line x1="104" y1="85" x2="112" y2="85" />
            <line x1="104" y1="125" x2="116" y2="125" />
            <line x1="104" y1="165" x2="112" y2="165" />
            <line x1="104" y1="205" x2="116" y2="205" />
          </g>

          {/* Mercúrio subindo no tubo */}
          <g clipPath="url(#tube-clip)">
            {shouldReduceMotion ? (
              <rect
                x="66"
                y={252 - (mercuryPercent / 100) * 230}
                width="28"
                height={(mercuryPercent / 100) * 230}
                fill="url(#mercury-gradient)"
              />
            ) : (
              <motion.rect
                x="66"
                width="28"
                fill="url(#mercury-gradient)"
                initial={{ height: 30, y: 222 }}
                animate={{
                  height: (mercuryPercent / 100) * 230,
                  y: 252 - (mercuryPercent / 100) * 230,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 15,
                }}
              />
            )}
          </g>

          {/* Bulbo externo do termômetro */}
          <circle
            cx="80"
            cy="285"
            r="44"
            fill="#FFFFFF"
            stroke="#1B2340"
            strokeWidth="5"
          />

          {/* Mercúrio preenchendo o interior do bulbo */}
          <circle
            cx="80"
            cy="285"
            r="38"
            fill="url(#mercury-gradient)"
            className={isFrozen ? 'saturate-50 opacity-90' : ''}
          />

          {/* Brilho de vidro no bulbo */}
          <path
            d="M52 268 A38 38 0 0 1 76 250"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </svg>

        {/* Emoji ou rosto amigável dentro do bulbo */}
        <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-16 h-16 pointer-events-none">
          {dominantEmoji ? (
            <span
              className={`text-4xl transition-transform duration-300 ${
                pulseDominant && !shouldReduceMotion ? 'scale-125' : 'scale-100'
              }`}
              role="img"
              aria-hidden="true"
            >
              {dominantEmoji}
            </span>
          ) : (
            // Carinha simpática padrão se não houver reações
            <span className="text-3xl opacity-80" role="img" aria-label="Aguardando reações">
              😊
            </span>
          )}
        </div>
      </div>

      {/* Indicador de humor textual suave */}
      <div className="mt-3 text-center">
        {dominantEmoji ? (
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-termo-navy/10 shadow-sm">
            <span className="text-xl" aria-hidden="true">{dominantEmoji}</span>
            <span className="font-display font-semibold text-termo-navy text-sm">
              {dominantPercentage}% na janela
            </span>
            <span className="text-xs text-termo-navy/60 font-body">
              ({totalReactions} total)
            </span>
          </div>
        ) : (
          <p className="text-xs text-termo-navy/60 font-body italic">
            {i18n.room.noReactionsYet}
          </p>
        )}
      </div>
    </div>
  );
};
