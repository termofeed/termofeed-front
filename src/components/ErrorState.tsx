import React from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage, i18n } from '../i18n/pt-BR';

interface ErrorStateProps {
  code?: string;
  onRetry?: () => void;
  customMessage?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  code,
  onRetry,
  customMessage,
}) => {
  const message = customMessage || getErrorMessage(code);

  // Expressão do termômetro de acordo com o tipo de erro
  const getThermometerFace = () => {
    switch (code) {
      case 'ROOM_NOT_FOUND':
        return { emoji: '🤔', mouth: 'M46 72 Q50 68 54 72' }; // confuso
      case 'ROOM_GONE':
        return { emoji: '😴', mouth: 'M46 70 L54 70' }; // adormecido/removido
      case 'ROOM_FULL':
        return { emoji: '😮', mouth: 'M50 72 A3 3 0 1 1 50 71.9' }; // espantado/cheio
      case 'ROOM_ENDED':
        return { emoji: '😌', mouth: 'M46 71 Q50 75 54 71' }; // sereno/encerrado
      default:
        return { emoji: '😢', mouth: 'M46 74 Q50 68 54 74' }; // triste
    }
  };

  const face = getThermometerFace();

  return (
    <div
      className="flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto my-auto min-h-[60vh]"
      role="alert"
    >
      {/* Desenho do termômetro com expressão correspondente */}
      <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Círculo do fundo */}
          <circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="#1B2340" strokeWidth="4" />
          {/* Tubo */}
          <rect x="44" y="20" width="12" height="34" rx="6" fill="#FFF6EA" stroke="#1B2340" strokeWidth="3" />
          {/* Bulbo */}
          <circle cx="50" cy="66" r="18" fill="#FFF6EA" stroke="#1B2340" strokeWidth="3" />
          {/* Mercúrio baixo */}
          <circle cx="50" cy="66" r="14" fill="#E8442F" opacity="0.6" />
          {/* Olhos tristes/expressivos */}
          <circle cx="45" cy="64" r="2" fill="#1B2340" />
          <circle cx="55" cy="64" r="2" fill="#1B2340" />
          {/* Boca expressiva */}
          <path d={face.mouth} stroke="#1B2340" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>

        {/* Emoji flutuante discreto */}
        <span className="absolute -top-1 -right-1 text-2xl" role="img" aria-hidden="true">
          {face.emoji}
        </span>
      </div>

      {/* Frase curta do erro */}
      <h2 className="font-display font-semibold text-xl text-termo-navy mb-2">
        {code === 'ROOM_NOT_FOUND' && 'Sala não encontrada'}
        {code === 'ROOM_GONE' && 'Esta sala não existe mais'}
        {code === 'ROOM_FULL' && 'Sala cheia'}
        {code === 'ROOM_ENDED' && 'Sala encerrada'}
        {(!code || !['ROOM_NOT_FOUND', 'ROOM_GONE', 'ROOM_FULL', 'ROOM_ENDED'].includes(code)) && 'Ops! Algo deu errado'}
      </h2>

      <p className="text-sm text-termo-navy/70 font-body mb-6 max-w-xs">
        {message}
      </p>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="w-full min-h-[44px] px-5 py-2.5 rounded-full bg-white border border-termo-navy/20 text-termo-navy font-display font-semibold text-sm hover:border-termo-coral transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-coral"
          >
            {i18n.errors.tryAgain}
          </button>
        )}
        <Link
          to="/"
          className="w-full min-h-[44px] px-5 py-2.5 rounded-full bg-termo-navy text-white font-display font-semibold text-sm hover:bg-termo-navy/90 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-coral"
        >
          {i18n.errors.backToHome}
        </Link>
      </div>
    </div>
  );
};
