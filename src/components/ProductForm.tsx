import React, { useRef, useState } from 'react';
import {
  Upload,
  Video,
  Trash2,
  ClipboardPaste,
  ExternalLink,
  RefreshCw,
  Sparkles,
  DollarSign,
  Tag,
  Share2,
  Copy,
  Check,
  AlertCircle,
  FileVideo,
  Play,
  RotateCcw
} from 'lucide-react';
import { ProductFormData } from '../types';
import { OPENING_PHRASES } from '../data/phrases';
import { formatCurrencyInput, calculateDiscount } from '../utils/currency';
import { isValidUrl } from '../utils/messageFormatter';
import { readFromClipboard } from '../utils/share';

interface ProductFormProps {
  formData: ProductFormData;
  onChange: (data: Partial<ProductFormData>) => void;
  onShare: () => void;
  onCopy: () => void;
  onClear: () => void;
  isSharing: boolean;
  isCopied: boolean;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  onChange,
  onShare,
  onCopy,
  onClear,
  isSharing,
  isCopied,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Manipulação de upload de arquivo de vídeo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const processVideoFile = (file: File) => {
    // Validar se é arquivo de vídeo ou extensão comum
    const validExtensions = ['mp4', 'mov', 'webm', 'm4v', 'quicktime'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const isVideoType = file.type.startsWith('video/') || validExtensions.includes(extension);

    if (!isVideoType) {
      onShowToast('Por favor, selecione um arquivo de vídeo válido (.mp4, .mov, .webm)', 'error');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onChange({
      videoFile: file,
      videoUrl: previewUrl,
      videoFileName: file.name,
      videoFileSize: file.size,
    });
    onShowToast('Vídeo do produto carregado com sucesso!', 'success');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const handleRemoveVideo = () => {
    if (formData.videoUrl && formData.videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formData.videoUrl);
    }
    onChange({
      videoFile: null,
      videoUrl: null,
      videoFileName: '',
      videoFileSize: 0,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onShowToast('Vídeo removido.', 'info');
  };

  // Botão Colar Link
  const handlePasteLink = async () => {
    const text = await readFromClipboard();
    if (text) {
      onChange({ affiliateUrl: text });
      if (isValidUrl(text)) {
        onShowToast('Link de afiliado colado com sucesso!', 'success');
      } else {
        onShowToast('Link colado! Verifique se a URL está completa (https://...)', 'info');
      }
    } else {
      onShowToast('Não foi possível ler da área de transferência. Cole manualmente no campo.', 'error');
    }
  };

  // Alternar frase de abertura entre a lista
  const handleCyclePhrase = () => {
    const currentIndex = OPENING_PHRASES.indexOf(formData.openingPhrase);
    const nextIndex = (currentIndex + 1) % OPENING_PHRASES.length;
    onChange({ openingPhrase: OPENING_PHRASES[nextIndex] });
  };

  // Máscaras de valor
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    onChange({ price: formatted });
  };

  const handleOldPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    onChange({ oldPrice: formatted });
  };

  // Limite de 150 caracteres na descrição
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 150) {
      onChange({ description: text });
    }
  };

  // Desconto calculado
  const discount = calculateDiscount(formData.price, formData.oldPrice);
  const isUrlFormatValid = formData.affiliateUrl ? isValidUrl(formData.affiliateUrl) : true;

  // Formatação amigável do tamanho do arquivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 md:p-6 shadow-sm border border-zinc-200/80 dark:border-zinc-800 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Dados da Oferta
        </h2>
        <span className="text-xs text-zinc-400 font-medium">Preencha e veja a prévia ao vivo</span>
      </div>

      {/* 1. VÍDEO DO PRODUTO */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            1. Vídeo do Produto (9:16 vertical)
          </label>
          {formData.videoUrl && (
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              {formData.videoFileName.slice(0, 20)} ({formatFileSize(formData.videoFileSize)})
            </span>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/mp4,video/quicktime,video/webm,video/x-m4v,video/*,.mp4,.mov,.webm"
          className="hidden"
        />

        {formData.videoUrl ? (
          <div className="relative group rounded-2xl overflow-hidden border-2 border-emerald-500/30 bg-black aspect-[9/16] max-h-[380px] w-full max-w-[240px] mx-auto flex items-center justify-center shadow-inner">
            <video
              src={formData.videoUrl}
              controls
              playsInline
              className="w-full h-full object-cover rounded-2xl"
            />
            {/* Overlay com opções */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-xl bg-black/75 hover:bg-black text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1 transition-all"
                title="Trocar vídeo"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                Trocar
              </button>
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="p-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white backdrop-blur-xs transition-all"
                title="Remover vídeo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-[10px] text-white font-bold px-2 py-0.5 rounded-md pointer-events-none">
              9:16
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all text-center flex flex-col items-center justify-center gap-2 aspect-[9/16] max-h-[320px] max-w-[240px] mx-auto w-full ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 scale-[0.99]'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-emerald-500/60 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-emerald-50/20'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Escolher vídeo vertical (9:16)
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                MP4 ou MOV (padrão Reels / Status / TikTok)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. LINK DE AFILIADO */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            2. Link de Afiliado
          </span>
          <span className="text-[11px] text-zinc-400 font-normal lowercase">Shopee, Amazon, Magalu, etc.</span>
        </label>

        <div className="relative flex items-center">
          <input
            type="url"
            value={formData.affiliateUrl}
            onChange={(e) => onChange({ affiliateUrl: e.target.value })}
            placeholder="https://s.shopee.com.br/... ou amzn.to/..."
            className={`w-full py-3 pl-3.5 pr-24 rounded-2xl border text-sm font-mono bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
              !isUrlFormatValid && formData.affiliateUrl
                ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                : 'border-zinc-300 dark:border-zinc-700 focus:border-emerald-500'
            }`}
          />
          <div className="absolute right-1.5 flex items-center gap-1">
            {formData.affiliateUrl && isValidUrl(formData.affiliateUrl) && (
              <a
                href={formData.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors"
                title="Testar link em nova aba"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              type="button"
              onClick={handlePasteLink}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
              title="Colar texto da área de transferência"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              Colar
            </button>
          </div>
        </div>

        {!isUrlFormatValid && formData.affiliateUrl && (
          <p className="text-xs text-rose-500 flex items-center gap-1 font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Por favor, insira uma URL válida iniciando com http:// ou https://
          </p>
        )}
      </div>

      {/* 3. FRASE DE ABERTURA */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            3. Frase de Abertura
          </label>
          <button
            type="button"
            onClick={handleCyclePhrase}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 px-2.5 py-1 rounded-xl transition-colors active:scale-95"
            title="Alternar entre sugestões de frases de alta conversão"
          >
            <RefreshCw className="w-3 h-3" />
            Trocar frase
          </button>
        </div>

        <input
          type="text"
          value={formData.openingPhrase}
          onChange={(e) => onChange({ openingPhrase: e.target.value })}
          placeholder="Ex: Olha o que encontrei para você! 👀"
          className="w-full py-3 px-3.5 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
        />

        {/* Pílulas rápidas de sugestões */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {OPENING_PHRASES.slice(0, 4).map((phrase) => {
            const isSelected = formData.openingPhrase === phrase;
            return (
              <button
                key={phrase}
                type="button"
                onClick={() => onChange({ openingPhrase: phrase })}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-emerald-400 hover:bg-emerald-50/50'
                }`}
              >
                {phrase}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. NOME DO PRODUTO (OPCIONAL) */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            4. Nome do Produto (opcional)
          </span>
          <span className="text-[11px] text-zinc-400 font-normal">Aparece em *negrito*</span>
        </label>
        <input
          type="text"
          value={formData.productName}
          onChange={(e) => onChange({ productName: e.target.value })}
          placeholder="Ex: Fone Bluetooth Sem Fio TWS com Cancelamento de Ruído"
          className="w-full py-3 px-3.5 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
      </div>

      {/* 5. BREVE DESCRIÇÃO */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            5. Breve Descrição
          </label>
          <span
            className={`text-xs font-bold ${
              formData.description.length >= 140
                ? formData.description.length >= 150
                  ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                  : 'text-amber-500'
                : 'text-zinc-400'
            }`}
          >
            {formData.description.length}/150
          </span>
        </div>
        <textarea
          value={formData.description}
          onChange={handleDescriptionChange}
          maxLength={150}
          rows={3}
          placeholder="Ex: Bateria dura até 28 horas, resistente à água e com graves potentes. Aproveita que o estoque tá voando!"
          className="w-full py-2.5 px-3.5 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
        />
      </div>

      {/* 6. VALORES (PREÇO ATUAL E VALOR ANTIGO) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          6. Preço da Oferta
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Valor da oferta (atual) */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Valor Promocional (R$) *
            </span>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                R$
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={formData.price}
                onChange={handlePriceChange}
                placeholder="89,90"
                className="w-full py-2.5 pl-10 pr-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 font-bold text-base focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          {/* Valor antigo (riscado) */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Valor Antigo (de ~R$~) opcional
            </span>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-sm font-semibold text-zinc-400">
                R$
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={formData.oldPrice}
                onChange={handleOldPriceChange}
                placeholder="149,90"
                className="w-full py-2.5 pl-10 pr-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all line-through decoration-rose-500/70"
              />
            </div>
          </div>
        </div>

        {/* Badge de economia automática */}
        {discount && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[11px]">
              {discount.percent}% OFF
            </span>
            <span>Economia de R$ {discount.savings} para quem comprar pelo seu link!</span>
          </div>
        )}
      </div>

      {/* AÇÕES PRINCIPAIS */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
        {/* Botão principal de Compartilhar no WhatsApp */}
        <button
          type="button"
          onClick={onShare}
          disabled={isSharing}
          className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa4f] text-white font-bold text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        >
          <Share2 className="w-5 h-5 stroke-[2.5]" />
          <span>{isSharing ? 'Preparando envio...' : 'Compartilhar no WhatsApp'}</span>
        </button>

        {/* Linha com Copiar e Limpar */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCopy}
            className={`min-h-[46px] py-2.5 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isCopied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-zinc-300/80 dark:border-zinc-700'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span>Copiar Mensagem</span>
              </>
            )}
          </button>

          {showClearConfirm ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setShowClearConfirm(false);
                }}
                className="flex-1 min-h-[46px] py-2 px-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all"
              >
                Sim, Limpar
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="min-h-[46px] py-2 px-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
              >
                Não
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="min-h-[46px] py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-rose-300 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-zinc-600 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 text-sm font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Limpar Formulário</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
