import React, { useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Phone,
  Video as VideoIcon,
  MoreVertical,
  CheckCheck,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Maximize2,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { ProductFormData } from '../types';
import { buildWhatsAppMessage, isValidUrl } from '../utils/messageFormatter';

interface WhatsAppPreviewProps {
  formData: ProductFormData;
  onShare: () => void;
  onCopy: () => void;
  isCopied: boolean;
  onSelectVideoClick?: () => void;
}

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  formData,
  onShare,
  onCopy,
  isCopied,
  onSelectVideoClick,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showRawText, setShowRawText] = useState(false);

  const formattedMessage = buildWhatsAppMessage(formData);
  const hasValidLink = formData.affiliateUrl && isValidUrl(formData.affiliateUrl);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Hora atual fictícia do chat
  const currentTime = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col space-y-4">
      {/* Header do card de preview */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Pré-visualização ao Vivo
          </h2>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400">
          Estilo WhatsApp
        </span>
      </div>

      {/* Mockup do WhatsApp */}
      <div className="rounded-3xl overflow-hidden shadow-xl border border-zinc-200/80 dark:border-zinc-800 bg-[#efeae2] dark:bg-[#0b141a] transition-all">
        {/* Top bar do WhatsApp */}
        <div className="bg-[#008069] dark:bg-[#202c33] text-white px-4 py-3 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#128C7E] dark:bg-[#111b21] flex items-center justify-center text-white ring-2 ring-white/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight flex items-center gap-1.5">
                Ofertas & Achadinhos 🔥
              </p>
              <p className="text-[11px] text-emerald-100/80 dark:text-zinc-400 leading-tight">
                online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-emerald-100/90 dark:text-zinc-300">
            <VideoIcon className="w-4 h-4 cursor-pointer hover:text-white" />
            <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
            <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* Área de mensagens com wallpaper suave */}
        <div className="p-4 md:p-5 min-h-[380px] flex flex-col justify-end bg-repeat relative overflow-hidden"
             style={{
               backgroundImage: `radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)`,
               backgroundSize: '16px 16px',
             }}>
          
          {/* Tag de data */}
          <div className="flex justify-center mb-3">
            <span className="bg-white/80 dark:bg-[#182229]/90 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 px-3 py-1 rounded-lg shadow-2xs backdrop-blur-xs uppercase tracking-wide">
              Hoje
            </span>
          </div>

          {/* Balão de mensagem enviada (estilo WhatsApp) */}
          <div className="flex justify-end">
            <div className="relative max-w-[94%] sm:max-w-[88%] md:max-w-[420px] rounded-2xl rounded-tr-xs bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] p-2 sm:p-2.5 shadow-md shadow-black/10 border border-[#b8e5b2] dark:border-[#004e40]">
              
              {/* Rabinho do balão de mensagem do WhatsApp */}
              <div 
                className="absolute -top-[1px] -right-[7px] w-0 h-0 border-t-[8px] border-t-[#d9fdd3] dark:border-t-[#005c4b] border-r-[8px] border-r-transparent" 
                aria-hidden="true" 
              />

              {/* 1. VÍDEO 9:16 VERTICAL NO TOPO */}
              <div className="relative w-full aspect-[9/16] max-h-[380px] rounded-xl overflow-hidden bg-black mb-2 shadow-xs group mx-auto">
                {formData.videoUrl ? (
                  <>
                    <video
                      ref={videoRef}
                      src={formData.videoUrl}
                      playsInline
                      loop
                      onEnded={() => setIsPlaying(false)}
                      onClick={handleTogglePlay}
                      className="w-full h-full object-cover cursor-pointer"
                    />

                    {/* Botão Play central quando pausado */}
                    {!isPlaying && (
                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-transform hover:scale-110 active:scale-95"
                        aria-label="Reproduzir vídeo"
                      >
                        <Play className="w-5 h-5 fill-white translate-x-0.5" />
                      </button>
                    )}

                    {/* Controles de vídeo discretos */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={handleToggleMute}
                        className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                        title={isMuted ? 'Ativar som' : 'Silenciar'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={handleFullscreen}
                        className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                        title="Tela cheia"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-xs text-[10px] text-white font-bold px-2 py-0.5 rounded-md">
                      9:16
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={onSelectVideoClick}
                    className="w-full h-full flex flex-col items-center justify-center p-4 bg-zinc-900/90 text-zinc-300 hover:text-white transition-colors cursor-pointer text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                      <Play className="w-5 h-5 fill-emerald-400" />
                    </div>
                    <span className="text-xs font-bold text-white">Vídeo do Produto (9:16)</span>
                    <span className="text-[11px] text-zinc-400 mt-1 max-w-[200px]">
                      Formato vertical padrão para Stories, Reels e WhatsApp
                    </span>
                  </button>
                )}
              </div>

              {/* 2. TEXTO DA MENSAGEM */}
              <div className="px-1 text-sm space-y-2 leading-relaxed">
                {/* Frase de abertura */}
                {formData.openingPhrase && (
                  <p className="font-normal text-zinc-900 dark:text-zinc-100">
                    {formData.openingPhrase}
                  </p>
                )}

                {/* Nome do produto & Descrição */}
                {(formData.productName || formData.description) && (
                  <div className="space-y-0.5">
                    {formData.productName && (
                      <p className="font-bold text-zinc-950 dark:text-white">
                        {formData.productName}
                      </p>
                    )}
                    {formData.description && (
                      <p className="text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm whitespace-pre-wrap">
                        {formData.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Bloco de Preço */}
                {(formData.price || formData.oldPrice) && (
                  <div className="bg-white/50 dark:bg-black/20 p-2 rounded-xl border border-emerald-500/20 my-1">
                    <p className="text-sm font-medium flex items-baseline flex-wrap gap-1">
                      <span>💰 Por apenas</span>
                      {formData.price && (
                        <span className="font-black text-emerald-700 dark:text-emerald-300 text-base">
                          R$ {formData.price}
                        </span>
                      )}
                      {formData.oldPrice && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 line-through decoration-rose-500">
                          (de R$ {formData.oldPrice})
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Link de afiliado */}
                {formData.affiliateUrl && (
                  <div className="pt-0.5">
                    <p className="text-xs sm:text-sm font-medium">
                      👉 Compre aqui:{' '}
                      <span className="text-sky-600 dark:text-sky-400 underline font-mono break-all cursor-pointer">
                        {formData.affiliateUrl}
                      </span>
                    </p>

                    {/* Simulação de Preview Card de Link do WhatsApp */}
                    {hasValidLink && (
                      <div className="mt-2 rounded-xl border border-zinc-300/70 dark:border-zinc-700 bg-white/70 dark:bg-black/30 p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {formData.productName || 'Ver produto na loja'}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                            {new URL(formData.affiliateUrl).hostname}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Timestamp e Visto Azul do WhatsApp */}
              <div className="flex items-center justify-end gap-1 mt-1.5 px-1 text-[11px] text-zinc-500 dark:text-zinc-300 select-none">
                <span>{currentTime}</span>
                <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações e Visualizador de Mensagem Formatada */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Formato Exato do WhatsApp
          </span>
          <button
            type="button"
            onClick={() => setShowRawText(!showRawText)}
            className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-semibold"
          >
            {showRawText ? 'Ocultar código' : 'Ver texto formatado com *negrito*'}
          </button>
        </div>

        {showRawText && (
          <pre className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap border border-zinc-200 dark:border-zinc-700 max-h-40 overflow-y-auto">
            {formattedMessage || '(Preencha os campos ao lado para ver a mensagem)'}
          </pre>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onCopy}
            className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isCopied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
            <span>Copiar Texto</span>
          </button>

          <button
            type="button"
            onClick={onShare}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
