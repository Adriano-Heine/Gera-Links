import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Se já estiver instalado como PWA em tela cheia / standalone, oculta o botão
  if (isInstalled) {
    return null;
  }

  // Fluxo Android / Chrome / Edge / Desktop
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={`flex items-center gap-1.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer ${
          compact ? 'px-2.5 py-2' : 'px-3 py-2'
        }`}
        title="Instalar o aplicativo no seu dispositivo"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Instalar App</span>
      </button>
    );
  }

  // Fluxo iOS Safari (WebKit não suporta beforeinstallprompt nativo)
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer ${
            compact ? 'px-2.5 py-2' : 'px-3 py-2'
          }`}
          title="Instalar no iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Instalar no iPhone / iPad</h3>
                  <p className="text-xs text-zinc-500">Sem precisar da App Store</p>
                </div>
              </div>

              <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-2xl text-xs leading-relaxed mb-4 border border-zinc-200/60 dark:border-zinc-700/50">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <p>
                    No Safari, toque no botão de <strong>Compartilhar</strong>{' '}
                    <Share className="inline w-3.5 h-3.5 text-sky-500 -mt-0.5" /> na barra inferior.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <p>
                    Role as opções e toque em <strong>Adicionar à Tela de Início</strong>{' '}
                    <PlusSquare className="inline w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300 -mt-0.5" />.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <p>
                    Confirme tocando em <strong>Adicionar</strong> no canto superior direito.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 py-3 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback geral (se navegador ainda não disparou o evento beforeinstallprompt, mas usuário quer ver instruções)
  return (
    <button
      type="button"
      onClick={() => setShowIOSGuide(true)}
      className={`flex items-center gap-1.5 rounded-xl font-bold text-xs bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-xs transition-all active:scale-95 cursor-pointer ${
        compact ? 'px-2.5 py-2' : 'px-3 py-2'
      }`}
      title="Instalar como aplicativo no celular ou computador"
    >
      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
      <span>Instalar App</span>
    </button>
  );
};
