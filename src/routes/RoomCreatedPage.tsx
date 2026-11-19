import React, { useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Copy, Check, ArrowRight, ShieldCheck, Share2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { i18n } from '../i18n/pt-BR';

export const RoomCreatedPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state as {
    hostToken?: string;
    joinUrl?: string;
  } | null;

  // Carrega hostToken do state ou do localStorage
  const hostToken =
    stateData?.hostToken ||
    (code ? localStorage.getItem(`termofeed_host_${code}`) : '') ||
    '';

  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedAdmin, setCopiedAdmin] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareLink = `${baseUrl}/r/${code}`;
  const adminLink = `${baseUrl}/r/${code}?adminToken=${encodeURIComponent(hostToken)}`;

  const handleCopy = async (text: string, isShare: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isShare) {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      } else {
        setCopiedAdmin(true);
        setTimeout(() => setCopiedAdmin(false), 2500);
      }
    } catch {
      // Fallback simples
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      if (isShare) {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      } else {
        setCopiedAdmin(true);
        setTimeout(() => setCopiedAdmin(false), 2500);
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 max-w-lg mx-auto">
      <header className="mb-6 text-center">
        <Logo size="lg" />
      </header>

      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-termo-navy/10 shadow-soft space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <h1 className="font-display font-semibold text-2xl text-termo-navy">
            {i18n.created.title}
          </h1>
          <p className="text-xs sm:text-sm text-termo-navy/60 font-body mt-1">
            Código da sala: <span className="font-mono font-semibold text-termo-navy">{code}</span>
          </p>
        </div>

        {/* Link de compartilhamento com os participantes */}
        <div className="p-4 rounded-2xl bg-[#FFF6EA]/60 border border-termo-navy/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-termo-navy">
            <Share2 className="w-4 h-4 text-termo-coral" />
            <span>{i18n.created.shareLinkTitle}</span>
          </div>
          <p className="text-xs text-termo-navy/60 font-body">
            {i18n.created.shareLinkHelp}
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-termo-navy/15 text-xs font-mono text-termo-navy select-all"
            />
            <button
              type="button"
              onClick={() => handleCopy(shareLink, true)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-termo-navy text-white text-xs font-display font-semibold hover:bg-termo-navy/90 transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-coral"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{i18n.created.copiedSuccess}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{i18n.created.copyLink}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Link de administração para o criador */}
        {hostToken && (
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>{i18n.created.adminLinkTitle}</span>
            </div>
            <p className="text-xs text-amber-900/80 font-body leading-relaxed">
              {i18n.created.adminLinkHelp}
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={adminLink}
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-mono text-termo-navy select-all"
              />
              <button
                type="button"
                onClick={() => handleCopy(adminLink, false)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-600 text-white text-xs font-display font-semibold hover:bg-amber-700 transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-termo-navy"
              >
                {copiedAdmin ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>{i18n.created.adminCopiedSuccess}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Botão herói "Entrar na sala" */}
        <button
          type="button"
          onClick={() => navigate(`/r/${code}`)}
          className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-termo-yellow to-termo-coral text-white font-display font-semibold text-base shadow-glow hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-3 focus-visible:ring-termo-navy"
        >
          <span>{i18n.created.enterRoomButton}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-termo-navy/60 hover:text-termo-navy underline font-body"
          >
            {i18n.errors.backToHome}
          </Link>
        </div>
      </div>
    </main>
  );
};
