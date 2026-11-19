import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';
import { api } from '../api/client';
import { i18n, DEFAULT_EMOJIS, AVAILABLE_EMOJIS } from '../i18n/pt-BR';

export const CreateRoomPage: React.FC = () => {
  const navigate = useNavigate();

  // Campos do formulário
  const [name, setName] = useState('');
  const [durationPreset, setDurationPreset] = useState<number | 'custom'>(60);
  const [customDuration, setCustomDuration] = useState<number>(60);
  const [cooldown, setCooldown] = useState<number>(5);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>(DEFAULT_EMOJIS);

  // Estados da interface
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Campo "Já tem um link?"
  const [pasteLink, setPasteLink] = useState('');
  const [pasteError, setPasteError] = useState<string | null>(null);

  const durationMinutes = durationPreset === 'custom' ? customDuration : durationPreset;

  const handleToggleEmoji = (emoji: string) => {
    if (selectedEmojis.includes(emoji)) {
      if (selectedEmojis.length <= 2) {
        setFormError('A sala precisa ter pelo menos 2 emojis.');
        return;
      }
      setSelectedEmojis(selectedEmojis.filter((e) => e !== emoji));
      setFormError(null);
    } else {
      if (selectedEmojis.length >= 12) {
        setFormError('A sala pode ter no máximo 12 emojis.');
        return;
      }
      setSelectedEmojis([...selectedEmojis, emoji]);
      setFormError(null);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validações
    if (name.length > 80) {
      setFormError(i18n.validation.nameMaxLength);
      return;
    }
    if (durationMinutes < 5 || durationMinutes > 240) {
      setFormError(i18n.validation.durationRange);
      return;
    }
    if (cooldown < 1 || cooldown > 60) {
      setFormError(i18n.validation.cooldownRange);
      return;
    }
    if (selectedEmojis.length < 2 || selectedEmojis.length > 12) {
      setFormError(i18n.validation.paletteRange);
      return;
    }

    try {
      setIsSubmitting(true);
      const resp = await api.createRoom({
        name: name.trim() || undefined,
        durationMinutes,
        reactionCooldownSeconds: cooldown,
        allowedEmojis: selectedEmojis,
      });

      // Salva hostToken no localStorage (RF-033)
      try {
        localStorage.setItem(`termofeed_host_${resp.room.code}`, resp.hostToken);
      } catch (err) {
        console.warn('Não foi possível salvar no localStorage:', err);
      }

      // Navega para a tela de sala criada, passando os dados
      navigate(`/created/${resp.room.code}`, {
        state: {
          room: resp.room,
          hostToken: resp.hostToken,
          joinUrl: resp.joinUrl,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : i18n.errors.generic;
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasteError(null);

    const input = pasteLink.trim();
    if (!input) return;

    // Extrai o código caso o usuário cole a URL completa
    const match = input.match(/([a-z]{3}-[a-z]{4}-[a-z]{3})/i);
    if (match) {
      navigate(`/r/${match[1].toLowerCase()}`);
    } else {
      setPasteError(i18n.validation.invalidRoomCode);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 max-w-lg mx-auto">
      {/* Logo com slogan */}
      <header className="mb-6 sm:mb-8 text-center">
        <Logo size="xl" showSlogan />
      </header>

      {/* Cartão principal "Criar sala" */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-termo-navy/10 shadow-soft">
        <h1 className="font-display font-semibold text-2xl text-termo-navy mb-5">
          {i18n.home.createCardTitle}
        </h1>

        <form onSubmit={handleCreateRoom} className="space-y-5">
          {/* Nome da sala (opcional) */}
          <div>
            <label
              htmlFor="room-name"
              className="block font-body text-xs font-semibold text-termo-navy/80 mb-1.5"
            >
              {i18n.home.roomNameLabel}
            </label>
            <input
              id="room-name"
              type="text"
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={i18n.home.roomNamePlaceholder}
              className="w-full px-4 py-3 rounded-2xl bg-[#FFF6EA]/50 border border-termo-navy/15 text-termo-navy placeholder:text-termo-navy/40 font-body text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-coral focus:border-termo-coral transition-all"
            />
          </div>

          {/* Duração inicial (seleção rápida) */}
          <div>
            <label className="block font-body text-xs font-semibold text-termo-navy/80 mb-1.5">
              {i18n.home.durationLabel}
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[
                { label: '15 min', value: 15 },
                { label: '30 min', value: 30 },
                { label: '1 h', value: 60 },
                { label: '2 h', value: 120 },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setDurationPreset(item.value)}
                  className={`min-h-[44px] py-2 px-1 rounded-xl font-display font-semibold text-xs sm:text-sm border transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-coral ${
                    durationPreset === item.value
                      ? 'bg-termo-navy text-white border-termo-navy shadow-xs'
                      : 'bg-white border-termo-navy/15 text-termo-navy/80 hover:border-termo-coral/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Opção duração personalizada */}
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setDurationPreset('custom')}
                className={`text-xs font-body font-medium underline underline-offset-2 ${
                  durationPreset === 'custom' ? 'text-termo-coral font-bold' : 'text-termo-navy/60'
                }`}
              >
                {i18n.home.customDurationLabel}
              </button>
              {durationPreset === 'custom' && (
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={customDuration}
                  onChange={(e) => setCustomDuration(Number(e.target.value))}
                  aria-label={i18n.home.customDurationLabel}
                  className="w-24 px-2 py-1 rounded-lg bg-[#FFF6EA]/50 border border-termo-navy/20 text-xs font-body text-termo-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-coral"
                />
              )}
            </div>
          </div>

          {/* Opções avançadas (dobradas por padrão) */}
          <div className="pt-2 border-t border-termo-navy/10">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full min-h-[44px] text-xs font-body font-semibold text-termo-navy/70 hover:text-termo-navy"
            >
              <span>{i18n.home.advancedOptions}</span>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-4 pt-2">
                {/* Intervalo entre reações (slider 1 a 60s) */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="cooldown-range"
                      className="font-body text-xs font-semibold text-termo-navy/80"
                    >
                      {i18n.home.reactionCooldownLabel.replace('{seconds}', cooldown.toString())}
                    </label>
                  </div>
                  <input
                    id="cooldown-range"
                    type="range"
                    min={1}
                    max={60}
                    value={cooldown}
                    onChange={(e) => setCooldown(Number(e.target.value))}
                    className="w-full h-2 bg-[#FFF6EA] rounded-lg appearance-none cursor-pointer accent-termo-coral"
                  />
                  <div className="flex justify-between text-[10px] text-termo-navy/50 font-body">
                    <span>1s</span>
                    <span>30s</span>
                    <span>60s</span>
                  </div>
                </div>

                {/* Paleta de emojis (2 a 12) */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-body text-xs font-semibold text-termo-navy/80">
                      {i18n.home.paletteLabel.replace('{count}', selectedEmojis.length.toString())}
                    </span>
                    <span className="text-[10px] text-termo-navy/50 font-body">
                      {i18n.home.paletteHelp}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-2 bg-[#FFF6EA]/60 rounded-2xl border border-termo-navy/10 max-h-36 overflow-y-auto">
                    {AVAILABLE_EMOJIS.map((emoji) => {
                      const isSelected = selectedEmojis.includes(emoji);
                      return (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleToggleEmoji(emoji)}
                          aria-pressed={isSelected}
                          aria-label={`Emoji ${emoji}`}
                          className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center text-xl transition-transform ${
                            isSelected
                              ? 'bg-white border-2 border-termo-coral shadow-xs scale-105'
                              : 'bg-transparent border border-transparent opacity-60 hover:opacity-100 hover:bg-white/50'
                          }`}
                        >
                          <span role="img" aria-hidden="true">
                            {emoji}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Erro de validação ao lado do formulário */}
          {formError && (
            <p className="text-xs text-termo-coral-dark font-medium bg-termo-coral/10 p-2.5 rounded-xl border border-termo-coral/20">
              {formError}
            </p>
          )}

          {/* Botão herói "Criar sala" com gradiente amarelo -> coral */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-termo-yellow to-termo-coral text-white font-display font-semibold text-base sm:text-lg shadow-glow hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-3 focus-visible:ring-termo-navy disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>{i18n.home.creating}</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-white/90" />
                <span>{i18n.home.createButton}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Campo pequeno "Já tem um link? Cole aqui" */}
      <div className="w-full mt-6 bg-white/70 backdrop-blur-xs rounded-2xl p-4 border border-termo-navy/10">
        <form onSubmit={handlePasteSubmit} className="flex flex-col sm:flex-row gap-2 items-center">
          <label htmlFor="paste-link" className="sr-only">
            {i18n.home.hasLinkPrompt}
          </label>
          <input
            id="paste-link"
            type="text"
            value={pasteLink}
            onChange={(e) => setPasteLink(e.target.value)}
            placeholder={i18n.home.hasLinkPrompt}
            className="flex-1 w-full px-3.5 py-2.5 rounded-xl bg-white border border-termo-navy/15 text-xs sm:text-sm font-body text-termo-navy placeholder:text-termo-navy/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-coral"
          />
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-termo-navy text-white font-display font-semibold text-xs sm:text-sm hover:bg-termo-navy/90 transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-coral"
          >
            <span>{i18n.home.enterRoom}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        {pasteError && (
          <p className="text-xs text-termo-coral-dark font-medium mt-2">
            {pasteError}
          </p>
        )}
      </div>
    </main>
  );
};
