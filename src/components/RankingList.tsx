import React from 'react';
import { EmojiCount } from '../api/types';

interface RankingListProps {
  ranking: EmojiCount[];
  limit?: number; // padrão 3 para a sala, indefinido para a tela final
  className?: string;
}

export const RankingList: React.FC<RankingListProps> = ({
  ranking,
  limit,
  className = '',
}) => {
  const displayItems = limit ? ranking.slice(0, limit) : ranking;

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <div className={`w-full max-w-xs sm:max-w-sm flex flex-col gap-2 ${className}`}>
      {displayItems.map((item, index) => {
        const roundedPercent = Math.round(item.percentage);

        return (
          <div
            key={item.emoji}
            className="flex items-center gap-2.5 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-2xl border border-termo-navy/10 shadow-xs"
          >
            {/* Posição e emoji */}
            <div className="flex items-center gap-1.5 w-14 shrink-0">
              <span className="text-xs font-display font-semibold text-termo-navy/50">
                #{index + 1}
              </span>
              <span className="text-xl" role="img" aria-hidden="true">
                {item.emoji}
              </span>
            </div>

            {/* Barra de progresso arredondada */}
            <div className="flex-1 h-3 bg-termo-navy/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-termo-yellow to-termo-coral rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.max(4, roundedPercent)}%` }}
                role="progressbar"
                aria-valuenow={roundedPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.emoji}: ${roundedPercent}% das reações`}
              />
            </div>

            {/* Contagem e porcentagem */}
            <div className="text-right shrink-0 min-w-[52px]">
              <span className="text-xs font-display font-semibold text-termo-navy">
                {roundedPercent}%
              </span>
              <span className="text-[10px] text-termo-navy/50 font-body ml-1">
                ({item.count})
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
