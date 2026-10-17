import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ProductFormData, ThemeMode } from './types';
import { DEFAULT_OPENING_PHRASE } from './data/phrases';
import { Header } from './components/Header';
import { ProductForm } from './components/ProductForm';
import { WhatsAppPreview } from './components/WhatsAppPreview';
import { ShareFallbackModal } from './components/ShareFallbackModal';
import { Toast, ToastMessage } from './components/Toast';
import { buildWhatsAppMessage } from './utils/messageFormatter';
import { shareToWhatsApp, copyToClipboard } from './utils/share';
import { Edit3, MessageCircle, Share2, Copy, Sparkles, Check } from 'lucide-react';

const STORAGE_KEY_DRAFT = 'compartilha_produto_draft_v1';
const STORAGE_KEY_THEME = 'compartilha_produto_theme_v1';

export default function App() {
  // Estado do formulário
  const [formData, setFormData] = useState<ProductFormData>(() => {
    const defaultData: ProductFormData = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      openingPhrase: DEFAULT_OPENING_PHRASE,
      productName: '',
      description: '',
      price: '',
      oldPrice: '',
      affiliateUrl: '',
      videoFile: null,
      videoUrl: null,
      videoFileName: '',
      videoFileSize: 0,
    };

    // Restaurar rascunho anterior de texto se existir
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY_DRAFT);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        return {
          ...defaultData,
          ...parsed,
          videoFile: null,
          videoUrl: null,
          videoFileName: '',
          videoFileSize: 0,
        };
      }
    } catch (e) {
      console.warn('Erro ao carregar rascunho:', e);
    }
    return defaultData;
  });

  // Tema Claro / Escuro
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    } catch (e) {
      console.warn('Erro ao ler tema salvo:', e);
    }
    return 'light';
  });

  // Alternador de tema direto
  const handleToggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Efeito para sincronizar a classe 'dark' no elemento raiz <html>
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, themeMode);
    } catch (e) {
      console.warn('Erro ao salvar tema:', e);
    }
  }, [themeMode]);

  // Modais e UI states
  const [isFallbackModalOpen, setIsFallbackModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Sistema de Toast
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Salvar rascunho de texto automaticamente para conveniência
  useEffect(() => {
    try {
      const draftToSave = {
        openingPhrase: formData.openingPhrase,
        productName: formData.productName,
        description: formData.description,
        price: formData.price,
        oldPrice: formData.oldPrice,
        affiliateUrl: formData.affiliateUrl,
      };
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(draftToSave));
    } catch (e) {
      console.warn('Erro ao salvar rascunho:', e);
    }
  }, [
    formData.openingPhrase,
    formData.productName,
    formData.description,
    formData.price,
    formData.oldPrice,
    formData.affiliateUrl,
  ]);

  // Atualizar dados do formulário
  const handleFormChange = useCallback((patch: Partial<ProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  }, []);

  // Compartilhar no WhatsApp
  const handleShare = async () => {
    const formattedText = buildWhatsAppMessage(formData);

    if (!formattedText.trim() && !formData.videoFile) {
      showToast('Preencha os dados do produto ou selecione um vídeo antes de compartilhar!', 'error');
      return;
    }

    setIsSharing(true);
    try {
      const result = await shareToWhatsApp(
        formattedText,
        formData.videoFile,
        formData.productName || 'Oferta imperdível'
      );

      if (result.cancelled) {
        setIsSharing(false);
        return;
      }

      if (result.method === 'wa_me_fallback') {
        if (result.needsManualVideo) {
          setIsFallbackModalOpen(true);
        } else {
          showToast('WhatsApp aberto com a mensagem pronta!', 'success');
        }
      } else {
        showToast('Oferta compartilhada com sucesso!', 'success');
      }
    } catch (err) {
      console.error('Erro no compartilhamento:', err);
      showToast('Ocorreu um erro ao abrir o compartilhamento.', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  // Copiar mensagem
  const handleCopy = async () => {
    const formattedText = buildWhatsAppMessage(formData);
    if (!formattedText.trim()) {
      showToast('Nenhum texto para copiar. Preencha os campos da oferta!', 'error');
      return;
    }

    const success = await copyToClipboard(formattedText);
    if (success) {
      setIsCopied(true);
      showToast('Mensagem copiada no formato do WhatsApp!', 'success');
      setTimeout(() => setIsCopied(false), 2500);
    } else {
      showToast('Não foi possível copiar automaticamente.', 'error');
    }
  };

  // Limpar formulário
  const handleClear = () => {
    if (formData.videoUrl && formData.videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formData.videoUrl);
    }
    setFormData({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      openingPhrase: DEFAULT_OPENING_PHRASE,
      productName: '',
      description: '',
      price: '',
      oldPrice: '',
      affiliateUrl: '',
      videoFile: null,
      videoUrl: null,
      videoFileName: '',
      videoFileSize: 0,
    });
    localStorage.removeItem(STORAGE_KEY_DRAFT);
    showToast('Formulário limpo com sucesso!', 'info');
  };

  const formattedWhatsAppText = useMemo(() => buildWhatsAppMessage(formData), [formData]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans pb-24 lg:pb-12 transition-colors duration-200">
      {/* Top Header Simplificado */}
      <Header
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 md:py-6">
        {/* Banner Informativo Limpo */}
        <div className="mb-5 p-4 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-white/20 backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-emerald-200" />
              </span>
              <h2 className="font-bold text-sm sm:text-base">
                Monte sua oferta de afiliado para o WhatsApp em segundos
              </h2>
            </div>
            <p className="text-xs text-emerald-100 max-w-2xl">
              Adicione seu vídeo vertical 9:16, seu link de afiliado e envie direto para contatos ou grupos com o texto formatado profissionalmente.
            </p>
          </div>
        </div>

        {/* Alternador de visualização no Mobile (Tab Switcher) */}
        <div className="lg:hidden flex items-center p-1 bg-zinc-200 dark:bg-zinc-800/80 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => setMobileTab('form')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mobileTab === 'form'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Edit3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Editar Formulário</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mobileTab === 'preview'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Ver no WhatsApp</span>
            {formData.videoUrl && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {/* Layout Grid: Desktop 2 colunas / Mobile alternado por tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Coluna do Formulário */}
          <div className={`lg:col-span-7 ${mobileTab === 'form' ? 'block' : 'hidden lg:block'}`}>
            <ProductForm
              formData={formData}
              onChange={handleFormChange}
              onShare={handleShare}
              onCopy={handleCopy}
              onClear={handleClear}
              isSharing={isSharing}
              isCopied={isCopied}
              onShowToast={showToast}
            />
          </div>

          {/* Coluna da Prévia do WhatsApp */}
          <div className={`lg:col-span-5 lg:sticky lg:top-20 ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <WhatsAppPreview
              formData={formData}
              onShare={handleShare}
              onCopy={handleCopy}
              isCopied={isCopied}
              onSelectVideoClick={() => setMobileTab('form')}
            />
          </div>
        </div>
      </main>

      {/* Barra Fixa Flutuante no Mobile para fácil acesso */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 p-3 px-4 shadow-2xl flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 min-h-[46px] py-2.5 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
        >
          {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-500" />}
          <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          disabled={isSharing}
          className="flex-2 min-h-[46px] py-2.5 px-4 rounded-xl bg-[#25D366] active:bg-[#1caa4f] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          <Share2 className="w-4 h-4 stroke-[2.5]" />
          <span>{isSharing ? 'Enviando...' : 'Compartilhar no WhatsApp'}</span>
        </button>
      </div>

      {/* Modal de Fallback para WhatsApp caso necessite anexo manual de vídeo */}
      <ShareFallbackModal
        isOpen={isFallbackModalOpen}
        onClose={() => setIsFallbackModalOpen(false)}
        videoUrl={formData.videoUrl}
        videoFileName={formData.videoFileName}
        formattedText={formattedWhatsAppText}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
