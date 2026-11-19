import React from 'react';
import { i18n } from '../i18n/pt-BR';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSlogan = false,
  className = '',
  iconOnly = false,
}) => {
  const dimensions = {
    sm: { icon: 32, text: 'text-xl', slogan: 'text-xs' },
    md: { icon: 44, text: 'text-2xl', slogan: 'text-sm' },
    lg: { icon: 64, text: 'text-4xl', slogan: 'text-base' },
    xl: { icon: 84, text: 'text-5xl', slogan: 'text-lg' },
  }[size];

  const iconSvg = (
    <svg
      width={dimensions.icon}
      height={dimensions.icon}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform hover:scale-105 duration-200"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="50" y1="90" x2="50" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8442F" />
          <stop offset="100%" stopColor="#FFB627" />
        </linearGradient>
      </defs>

      {/* Fundo suave circular */}
      <circle cx="50" cy="50" r="46" fill="#FFFFFF" stroke="#1B2340" strokeWidth="4" />

      {/* Tubo externo do termômetro */}
      <rect x="42" y="18" width="16" height="42" rx="8" fill="#FFF6EA" stroke="#1B2340" strokeWidth="3" />

      {/* Bulbo externo */}
      <circle cx="50" cy="68" r="18" fill="#FFF6EA" stroke="#1B2340" strokeWidth="3" />

      {/* Junção do tubo com bulbo */}
      <rect x="44" y="52" width="12" height="12" fill="#FFF6EA" />

      {/* Mercúrio com gradiente */}
      <rect x="45" y="32" width="10" height="28" rx="5" fill="url(#logo-gradient)" />
      <circle cx="50" cy="68" r="13" fill="url(#logo-gradient)" />

      {/* Olhos amigáveis no bulbo */}
      <circle cx="45" cy="66" r="2" fill="#1B2340" />
      <circle cx="55" cy="66" r="2" fill="#1B2340" />
      {/* Sorriso do termômetro */}
      <path d="M46 72 Q50 76 54 72" stroke="#1B2340" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Linhas de graduação do termômetro */}
      <line x1="61" y1="26" x2="65" y2="26" stroke="#1B2340" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="61" y1="36" x2="65" y2="36" stroke="#1B2340" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="61" y1="46" x2="65" y2="46" stroke="#1B2340" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );

  if (iconOnly) {
    return iconSvg;
  }

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div className="flex items-center gap-2.5">
        {iconSvg}
        <span
          className={`font-display font-semibold tracking-tight text-[#1B2340] ${dimensions.text}`}
        >
          termo<span className="text-[#E8442F]">feed</span>
        </span>
      </div>
      {showSlogan && (
        <p className={`mt-1 font-body text-[#1B2340]/80 font-medium ${dimensions.slogan}`}>
          {i18n.app.slogan}
        </p>
      )}
    </div>
  );
};
