import React from 'react';
import { MessageSquare, Download, Check, ExternalLink, Paperclip, X } from 'lucide-react';

interface ShareFallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  videoFileName: string;
  formattedText: string;
}

export const ShareFallbackModal: React.FC<ShareFallbackModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  videoFileName,
  formattedText,
}) => {
  if (!isOpen) return null;

  const handleDownloadVideo = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = videoFileName || 'video-produto.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenWhatsAppAgain = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(formattedText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 overflow-hidden">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Mensagem no WhatsApp</h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Texto codificado pronto para envio!
            </span>
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
          O WhatsApp foi aberto com o texto da oferta pronto. Como este navegador não possui permissão para anexar arquivos de vídeo automaticamente, siga estes passos simples:
        </p>

        {/* Passos visuais */}
        <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/50 mb-5 text-sm">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <p className="text-zinc-700 dark:text-zinc-300">
              No chat do WhatsApp aberto, toque no ícone de anexo{' '}
              <Paperclip className="inline w-3.5 h-3.5 text-zinc-500" /> ou <strong>+</strong>.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <p className="text-zinc-700 dark:text-zinc-300">
              Escolha <strong>Fotos e Vídeos</strong> e selecione o vídeo do seu produto.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <p className="text-zinc-700 dark:text-zinc-300">
              Aperte o botão de enviar do WhatsApp!
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-2.5">
          {videoUrl && (
            <button
              onClick={handleDownloadVideo}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-semibold text-sm transition-colors text-zinc-800 dark:text-zinc-200"
            >
              <Download className="w-4 h-4 text-emerald-500" />
              Baixar Arquivo de Vídeo no Dispositivo
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={handleOpenWhatsAppAgain}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Reabrir WhatsApp
            </button>

            <button
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 font-semibold text-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Entendi, obrigado!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
