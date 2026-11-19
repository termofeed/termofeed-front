import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Clock, AlertTriangle, Check } from 'lucide-react';
import { i18n } from '../i18n/pt-BR';

interface HostControlsSheetProps {
  onExtend: (extraMinutes: number) => Promise<void>;
  onCloseRoom: () => Promise<void>;
  isExtending?: boolean;
  isClosing?: boolean;
}

export const HostControlsSheet: React.FC<HostControlsSheetProps> = ({
  onExtend,
  onCloseRoom,
  isExtending = false,
  isClosing = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [extendSuccess, setExtendSuccess] = useState<number | null>(null);

  const handleExtendClick = async (minutes: number) => {
    try {
      await onExtend(minutes);
      setExtendSuccess(minutes);
      setTimeout(() => setExtendSuccess(null), 2500);
    } catch (err) {
      console.error('Erro ao estender sala:', err);
    }
  };

  const handleCloseClick = async () => {
    if (!confirmClose) {
      setConfirmClose(true);
      return;
    }
    try {
      await onCloseRoom();
      setIsOpen(false);
    } catch (err) {
      console.error('Erro ao encerrar sala:', err);
    }
  };

  return (
    <>
      {/* Botão discreto de menu para o criador */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setConfirmClose(false);
        }}
        aria-label={i18n.host.menuButton}
        title={i18n.host.menuButton}
        className="min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-termo-navy/15 text-termo-navy/80 hover:text-termo-navy hover:bg-white shadow-xs transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-coral"
      >
        <Settings className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Folha inferior / Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop escuro suave */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Conteúdo da folha */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="host-controls-title"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-[#FFF6EA] rounded-t-3xl sm:rounded-3xl p-6 border-t sm:border border-termo-navy/15 shadow-2xl z-10"
            >
              {/* Cabeçalho */}
              <div className="flex items-center justify-between pb-4 border-b border-termo-navy/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-termo-coral/10 text-termo-coral flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <h2
                    id="host-controls-title"
                    className="font-display font-semibold text-lg text-termo-navy"
                  >
                    {i18n.host.menuTitle}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Fechar controles"
                  className="min-w-[44px] min-h-[44px] p-2 text-termo-navy/60 hover:text-termo-navy rounded-full transition-colors flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Seção Estender */}
              <div className="py-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-termo-navy mb-3">
                  <Clock className="w-4 h-4 text-termo-navy/70" />
                  <span>{i18n.host.extendTitle}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[5, 15, 30].map((min) => (
                    <button
                      key={min}
                      type="button"
                      disabled={isExtending}
                      onClick={() => handleExtendClick(min)}
                      className="min-h-[44px] px-3 py-2.5 rounded-xl bg-white border border-termo-navy/20 text-termo-navy font-display font-semibold text-sm hover:border-termo-coral hover:bg-termo-yellow/10 transition-all flex items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-coral disabled:opacity-50"
                    >
                      {extendSuccess === min ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        `+${min} min`
                      )}
                    </button>
                  ))}
                </div>
                {extendSuccess && (
                  <p className="text-xs text-emerald-700 font-medium mt-1.5 text-center">
                    +{extendSuccess} minutos adicionados com sucesso!
                  </p>
                )}
              </div>

              {/* Seção Encerrar sala (em duas etapas) */}
              <div className="pt-3 pb-2 border-t border-termo-navy/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-termo-coral-dark mb-2">
                  <AlertTriangle className="w-4 h-4 text-termo-coral" />
                  <span>{i18n.host.closeTitle}</span>
                </div>
                <p className="text-xs text-termo-navy/70 font-body mb-3">
                  {i18n.host.closeWarning}
                </p>

                {confirmClose ? (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      disabled={isClosing}
                      onClick={handleCloseClick}
                      className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-termo-coral text-white font-display font-semibold text-sm hover:bg-termo-coral-dark shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-navy"
                    >
                      {isClosing ? i18n.host.closing : i18n.host.closeConfirmButton}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClose(false)}
                      className="w-full min-h-[44px] py-2 text-xs font-body text-termo-navy/70 hover:text-termo-navy"
                    >
                      {i18n.host.closeCancel}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClose(true)}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-termo-coral/40 text-termo-coral-dark font-display font-semibold text-sm hover:bg-termo-coral/10 transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-coral"
                  >
                    {i18n.host.closeButton}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
