import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Users, Clock } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Thermometer } from '../components/Thermometer';
import { FloatingEmojis, FloatingEmojiItem } from '../components/FloatingEmojis';
import { EmojiPalette } from '../components/EmojiPalette';
import { WindowSelector } from '../components/WindowSelector';
import { RankingList } from '../components/RankingList';
import { HostControlsSheet } from '../components/HostControlsSheet';
import { NotificationBanner, BannerType } from '../components/NotificationBanner';
import { ErrorState } from '../components/ErrorState';
import { RoomSummaryView } from './RoomSummaryView';
import { api } from '../api/client';
import { RoomSocket, SocketStatus } from '../ws/room-socket';
import { Room, Summary, SummaryWindow, ApiError } from '../api/types';
import { RoomWebSocketEvent } from '../api/ws-types';
import { i18n } from '../i18n/pt-BR';

export const RoomPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Tokens
  const [hostToken, setHostToken] = useState<string | null>(null);
  const [participantToken, setParticipantToken] = useState<string | null>(null);

  // Dados da sala e resumo
  const [room, setRoom] = useState<Room | null>(null);
  const [summaries, setSummaries] = useState<Record<string, Summary>>({});
  const [currentWindow, setCurrentWindow] = useState<SummaryWindow>('1m');
  const [participantCount, setParticipantCount] = useState<number>(1);

  // Estados de conexão e tela
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [, setSocketStatus] = useState<SocketStatus>('connecting');
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [endSummary, setEndSummary] = useState<Summary | null>(null);

  // Banner de notificações e atalhos
  const [bannerType, setBannerType] = useState<BannerType | null>(null);
  const [extendedMinutes, setExtendedMinutes] = useState<number>(0);

  // Cooldown
  const [nextAllowedAt, setNextAllowedAt] = useState<number | null>(null);

  // Emojis flutuantes
  const [floatingList, setFloatingList] = useState<FloatingEmojiItem[]>([]);
  const floatingCounter = useRef<number>(0);

  // Tempo restante
  const [timeLeftStr, setTimeLeftStr] = useState<string>('00:00');

  // Modal de entrada rápida (RNF-021)
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>('');
  const [isJoining, setIsJoining] = useState<boolean>(false);

  const socketRef = useRef<RoomSocket | null>(null);

  // 1. Processa adminToken / hostToken na URL (RF-034)
  useEffect(() => {
    if (!code) return;
    const urlHostToken = searchParams.get('adminToken') || searchParams.get('hostToken');
    if (urlHostToken) {
      try {
        localStorage.setItem(`termofeed_host_${code}`, urlHostToken);
        setHostToken(urlHostToken);
      } catch (err) {
        console.warn('Erro ao salvar hostToken:', err);
      }
    } else {
      const stored = localStorage.getItem(`termofeed_host_${code}`);
      if (stored) setHostToken(stored);
    }

    const storedParticipant = localStorage.getItem(`termofeed_participant_${code}`);
    if (storedParticipant) {
      setParticipantToken(storedParticipant);
    }
  }, [code, searchParams]);

  // Função para adicionar emoji flutuante (limite de 40 na tela)
  const spawnFloatingEmoji = useCallback((emoji: string) => {
    floatingCounter.current += 1;
    const newItem: FloatingEmojiItem = {
      id: `${Date.now()}-${floatingCounter.current}`,
      emoji,
      leftPercent: 12 + Math.random() * 76,
      swayDistance: (Math.random() - 0.5) * 40,
    };

    setFloatingList((prev) => {
      // Descarta os mais antigos se atingir 40
      const trimmed = prev.length >= 40 ? prev.slice(prev.length - 39) : prev;
      return [...trimmed, newItem];
    });
  }, []);

  const handleRemoveFloating = useCallback((id: string) => {
    setFloatingList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Busca inicial da sala (RF-008)
  const fetchRoomData = useCallback(async () => {
    if (!code) return;
    try {
      setIsLoading(true);
      setErrorCode(null);
      const roomData = await api.getRoom(code);
      setRoom(roomData);
      setParticipantCount(roomData.participantCount);

      if (roomData.status === 'ended') {
        setIsEnded(true);
        // Busca resumo all
        try {
          const finalSummary = await api.getSummary(code, 'all');
          setEndSummary(finalSummary);
        } catch {
          // ignora
        }
        setIsLoading(false);
        return;
      }

      // Busca resumo inicial por REST
      try {
        const initialSummary = await api.getSummary(code, currentWindow);
        setSummaries((prev) => ({ ...prev, [currentWindow]: initialSummary }));
      } catch (err) {
        console.warn('Erro ao buscar resumo inicial:', err);
      }

      // Se já temos o participantToken no localStorage, podemos conectar ao WS
      const savedToken = localStorage.getItem(`termofeed_participant_${code}`);
      if (savedToken) {
        setParticipantToken(savedToken);
      } else {
        // Mostra modal amigável para entrar com 1 clique (RNF-021)
        setShowJoinModal(true);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorCode(err.problem.code);
      } else {
        setErrorCode('NETWORK_ERROR');
      }
    } finally {
      setIsLoading(false);
    }
  }, [code, currentWindow]);

  useEffect(() => {
    fetchRoomData();
  }, [fetchRoomData]);

  // Contagem regressiva suave (mm:ss)
  useEffect(() => {
    if (!room || isEnded) return;

    const updateTimer = () => {
      const now = Date.now();
      const expires = new Date(room.expiresAt).getTime();
      const diffSec = Math.max(0, Math.floor((expires - now) / 1000));

      if (diffSec <= 0) {
        setTimeLeftStr(i18n.room.expired);
        return;
      }

      const minutes = Math.floor(diffSec / 60);
      const seconds = diffSec % 60;
      const mm = minutes.toString().padStart(2, '0');
      const ss = seconds.toString().padStart(2, '0');
      setTimeLeftStr(`${mm}:${ss}`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [room, isEnded]);

  // Handler dos eventos WebSocket (asyncapi.yaml)
  const handleWsEvent = useCallback(
    (event: RoomWebSocketEvent) => {
      switch (event.type) {
        case 'reaction.created':
          spawnFloatingEmoji(event.emoji);
          break;

        case 'summary.updated':
          setSummaries((prev) => ({
            ...prev,
            ...event.windows,
          }));
          break;

        case 'participants.changed':
          setParticipantCount(event.participantCount);
          break;

        case 'room.expiring':
          setBannerType('expiring');
          if (room) {
            setRoom({ ...room, expiresAt: event.expiresAt });
          }
          break;

        case 'room.extended':
          setExtendedMinutes(event.extraMinutes);
          setBannerType('extended');
          if (room) {
            setRoom({ ...room, expiresAt: event.expiresAt });
          }
          setTimeout(() => setBannerType(null), 4000);
          break;

        case 'room.closed':
          setBannerType(null);
          setIsEnded(true);
          setEndSummary(event.summary);
          if (socketRef.current) {
            socketRef.current.close();
          }
          break;
      }
    },
    [room, spawnFloatingEmoji]
  );

  // Abre conexão WebSocket quando temos o participantToken
  useEffect(() => {
    if (!code || !participantToken || isEnded) return;

    const ws = new RoomSocket({
      code,
      token: participantToken,
      onEvent: handleWsEvent,
      onStatusChange: (status) => {
        setSocketStatus(status);
        if (status === 'reconnecting') {
          setBannerType('reconnecting');
        } else if (status === 'connected') {
          setBannerType((prev) => (prev === 'reconnecting' ? null : prev));
        }
      },
      onReconnectSuccess: async () => {
        // Ao reconectar, busca o resumo mais recente por REST (RNF-008)
        try {
          const fresh = await api.getSummary(code, currentWindow);
          setSummaries((prev) => ({ ...prev, [currentWindow]: fresh }));
        } catch (err) {
          console.warn('Erro ao atualizar resumo pós-reconexão:', err);
        }
      },
    });

    socketRef.current = ws;
    ws.connect();

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [code, participantToken, isEnded, handleWsEvent, currentWindow]);

  // Entrar na sala (RF-009, RF-010, RNF-021)
  const handleJoin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code) return;

    try {
      setIsJoining(true);
      const resp = await api.joinRoom(code, {
        nickname: nickname.trim() || undefined,
      });

      try {
        localStorage.setItem(`termofeed_participant_${code}`, resp.participantToken);
      } catch (err) {
        console.warn('Erro no localStorage:', err);
      }

      setParticipantToken(resp.participantToken);
      setRoom(resp.room);
      setParticipantCount(resp.room.participantCount);
      setShowJoinModal(false);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorCode(err.problem.code);
      } else {
        setErrorCode('JOIN_ERROR');
      }
    } finally {
      setIsJoining(false);
    }
  };

  // Enviar reação (RF-013, RF-014)
  const handleReact = async (emoji: string) => {
    if (!code || !participantToken || isEnded) return;

    // Efeito local imediato
    spawnFloatingEmoji(emoji);

    try {
      const resp = await api.sendReaction(code, emoji, participantToken);
      if (resp.nextAllowedAt) {
        setNextAllowedAt(new Date(resp.nextAllowedAt).getTime());
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.problem.code === 'COOLDOWN_ACTIVE') {
          // Aplica o cooldown sem erro vermelho (RF-014)
          const waitSec = err.problem.retryAfterSeconds || room?.reactionCooldownSeconds || 5;
          setNextAllowedAt(Date.now() + waitSec * 1000);
        } else if (err.problem.code === 'ROOM_ENDED') {
          setIsEnded(true);
        }
      }
    }
  };

  // Estender sala (Criador)
  const handleExtend = async (extraMinutes: number) => {
    if (!code || !hostToken) return;
    const updated = await api.extendRoom(code, extraMinutes, hostToken);
    setRoom(updated);
  };

  // Encerrar sala (Criador)
  const handleClose = async () => {
    if (!code || !hostToken) return;
    const closed = await api.closeRoom(code, hostToken);
    setIsEnded(true);
    setEndSummary(closed.summary);
  };

  // Se a sala encerrou, renderiza o resumo final (RF-031)
  if (isEnded) {
    return (
      <RoomSummaryView
        summary={endSummary}
        room={room}
        onCreateNewRoom={() => navigate('/')}
      />
    );
  }

  // Se houver erro de rota / sala
  if (errorCode) {
    return <ErrorState code={errorCode} onRetry={fetchRoomData} />;
  }

  if (isLoading || !room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Logo size="md" />
        <p className="mt-4 text-sm text-termo-navy/70 font-body animate-pulse">
          {i18n.room.connecting}
        </p>
      </div>
    );
  }

  const activeSummary = summaries[currentWindow] || null;

  return (
    <div className="min-h-screen flex flex-col relative pb-28 pt-3 px-3 sm:px-6 max-w-xl mx-auto overflow-x-hidden">
      {/* Banner de notificações suaves (topo) */}
      <NotificationBanner
        type={bannerType}
        extraMinutes={extendedMinutes}
        showExtendShortcut={Boolean(hostToken)}
        onExtendClick={() => handleExtend(15)}
      />

      {/* Camada de emojis flutuantes (RF-021) */}
      <FloatingEmojis
        emojis={floatingList}
        onComplete={handleRemoveFloating}
      />

      {/* Topo: Nome da sala, tempo restante e participantes */}
      <header className="flex items-center justify-between gap-2 py-2 px-1 border-b border-termo-navy/10">
        <div className="flex-1 min-w-0 pr-2">
          <h1 className="font-display font-semibold text-base sm:text-lg text-termo-navy truncate">
            {room.name || i18n.app.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-termo-navy/60 font-body mt-0.5">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-termo-coral" />
              {timeLeftStr}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-termo-yellow" />
              {participantCount}{' '}
              {participantCount === 1
                ? i18n.room.participantsCount.replace('{count} ', '')
                : i18n.room.participantsCountPlural.replace('{count} ', '')}
            </span>
          </div>
        </div>

        {/* Controles do criador (se tiver hostToken) */}
        {hostToken && (
          <HostControlsSheet
            onExtend={handleExtend}
            onCloseRoom={handleClose}
          />
        )}
      </header>

      {/* Centro (Herói): Termômetro de humor */}
      <main className="flex-1 flex flex-col items-center justify-center py-4 my-auto">
        <Thermometer
          summary={activeSummary}
          windowLabel={currentWindow}
          className="my-auto"
        />

        {/* Seletor de janela de tempo */}
        <div className="mt-4 mb-3">
          <WindowSelector
            currentWindow={currentWindow}
            onChangeWindow={setCurrentWindow}
          />
        </div>

        {/* Ranking curto dos 3 emojis mais usados na janela */}
        {activeSummary && activeSummary.ranking.length > 0 && (
          <RankingList
            ranking={activeSummary.ranking}
            limit={3}
            className="mt-2"
          />
        )}
      </main>

      {/* Rodapé fixo com a paleta de emojis */}
      <EmojiPalette
        emojis={room.allowedEmojis}
        onReact={handleReact}
        cooldownTotalSeconds={room.reactionCooldownSeconds}
        nextAllowedAt={nextAllowedAt}
        disabled={showJoinModal}
      />

      {/* Modal / Sheet amigável para entrar na sala (RNF-021: <= 2 toques e sem campo obrigatório) */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-termo-navy/15 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-termo-yellow/20 rounded-full flex items-center justify-center mx-auto text-2xl">
              👋
            </div>
            <div>
              <h2 className="font-display font-semibold text-xl text-termo-navy">
                {i18n.room.nicknamePromptTitle}
              </h2>
              <p className="text-xs text-termo-navy/60 font-body mt-1">
                {i18n.room.nicknamePromptSubtitle}
              </p>
            </div>

            <form onSubmit={handleJoin} className="space-y-3">
              <input
                type="text"
                maxLength={30}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={i18n.room.nicknamePlaceholder}
                className="w-full px-4 py-3 rounded-2xl bg-[#FFF6EA]/60 border border-termo-navy/15 text-sm font-body text-termo-navy placeholder:text-termo-navy/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-coral"
              />
              <button
                type="submit"
                disabled={isJoining}
                className="w-full min-h-[48px] py-3 px-6 rounded-2xl bg-gradient-to-r from-termo-yellow to-termo-coral text-white font-display font-semibold text-sm shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-navy disabled:opacity-50"
              >
                {isJoining ? 'Entrando...' : i18n.room.nicknameSubmit}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
