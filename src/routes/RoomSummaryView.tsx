import React from 'react';
import { Trophy, Plus } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Thermometer } from '../components/Thermometer';
import { RankingList } from '../components/RankingList';
import { Room, Summary } from '../api/types';
import { i18n } from '../i18n/pt-BR';

interface RoomSummaryViewProps {
  summary: Summary | null;
  room: Room | null;
  onCreateNewRoom: () => void;
}

export const RoomSummaryView: React.FC<RoomSummaryViewProps> = ({
  summary,
  room,
  onCreateNewRoom,
}) => {
  const championEmoji = summary?.dominantEmoji || null;
  const totalReactions = summary?.totalReactions || 0;

  const endedReasonText =
    room?.endedReason === 'host'
      ? i18n.summary.reasonHost
      : room?.endedReason === 'timeout'
      ? i18n.summary.reasonTimeout
      : '';

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 max-w-lg mx-auto py-8">
      <header className="text-center">
        <Logo size="md" />
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-termo-navy mt-4">
          {i18n.summary.title}
        </h1>
        {endedReasonText && (
          <p className="text-xs text-termo-navy/60 font-body mt-1">
            {endedReasonText}
          </p>
        )}
      </header>

      {/* Herói: Termômetro congelado com o campeão */}
      <section className="my-6 flex flex-col items-center text-center">
        <Thermometer
          summary={summary}
          windowLabel="all"
          isFrozen
        />

        {championEmoji ? (
          <div className="mt-4 p-4 bg-white rounded-3xl border border-termo-navy/10 shadow-soft max-w-xs w-full">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-termo-yellow mb-1">
              <Trophy className="w-4 h-4 fill-termo-yellow" />
              <span className="text-termo-navy">{i18n.summary.championTitle}</span>
            </div>
            <div className="text-4xl my-1" role="img" aria-label={`Campeão: ${championEmoji}`}>
              {championEmoji}
            </div>
            <p className="text-xs text-termo-navy/60 font-body">
              {i18n.summary.totalReactions.replace('{total}', totalReactions.toString())}
            </p>
          </div>
        ) : (
          <p className="text-xs text-termo-navy/60 font-body italic mt-4">
            {i18n.summary.noChampion}
          </p>
        )}
      </section>

      {/* Ranking completo da sala */}
      {summary && summary.ranking.length > 0 && (
        <section className="w-full mb-8">
          <h2 className="font-display font-semibold text-sm text-termo-navy/80 mb-3 text-center">
            {i18n.summary.fullRankingTitle}
          </h2>
          <div className="flex justify-center">
            <RankingList ranking={summary.ranking} />
          </div>
        </section>
      )}

      {/* Botão herói "Criar nova sala" */}
      <footer className="w-full pt-4">
        <button
          type="button"
          onClick={onCreateNewRoom}
          className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-termo-yellow to-termo-coral text-white font-display font-semibold text-base shadow-glow hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-3 focus-visible:ring-termo-navy"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>{i18n.summary.createNewRoom}</span>
        </button>
      </footer>
    </main>
  );
};
