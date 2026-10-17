/**
 * Lógica para compartilhamento via Web Share API e fallbacks para WhatsApp
 */

export interface ShareResult {
  success: boolean;
  method: 'native_file_and_text' | 'native_text_only' | 'wa_me_fallback' | 'clipboard';
  needsManualVideo: boolean;
  message?: string;
  cancelled?: boolean;
}

/**
 * Verifica se o dispositivo/navegador suporta compartilhar arquivos
 */
export function canShareFiles(file: File | null): boolean {
  if (!file) return false;
  if (typeof navigator === 'undefined' || !navigator.share || !navigator.canShare) {
    return false;
  }
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

/**
 * Tenta compartilhar o produto no WhatsApp via Web Share API com arquivo + texto,
 * ou recorre ao fallback wa.me/?text= caso não suporte compartilhamento de arquivos.
 */
export async function shareToWhatsApp(
  formattedText: string,
  videoFile: File | null,
  productTitle?: string
): Promise<ShareResult> {
  // 1. Tentar compartilhar com arquivo + texto nativamente
  if (videoFile && canShareFiles(videoFile)) {
    try {
      await navigator.share({
        files: [videoFile],
        text: formattedText,
        title: productTitle || 'Oferta imperdível',
      });
      return {
        success: true,
        method: 'native_file_and_text',
        needsManualVideo: false,
      };
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        return {
          success: false,
          method: 'native_file_and_text',
          needsManualVideo: false,
          cancelled: true,
        };
      }
      // Se deu outro erro na API nativa, prosseguir para fallback
      console.warn('Erro ao compartilhar com arquivo via Web Share:', err);
    }
  }

  // 2. Se não tem vídeo ou navegador não suporta arquivos, mas suporta texto via navigator.share
  if (!videoFile && typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        text: formattedText,
        title: productTitle || 'Oferta imperdível',
      });
      return {
        success: true,
        method: 'native_text_only',
        needsManualVideo: false,
      };
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        return {
          success: false,
          method: 'native_text_only',
          needsManualVideo: false,
          cancelled: true,
        };
      }
    }
  }

  // 3. Fallback: Abrir direto o WhatsApp com a mensagem codificada
  const encodedText = encodeURIComponent(formattedText);
  const waUrl = `https://wa.me/?text=${encodedText}`;

  // Abre em nova aba/aplicativo WhatsApp
  const opened = window.open(waUrl, '_blank', 'noopener,noreferrer');
  if (!opened) {
    // Caso popup bloqueador impeça window.open, usa location.href
    window.location.href = waUrl;
  }

  return {
    success: true,
    method: 'wa_me_fallback',
    needsManualVideo: !!videoFile,
    message: videoFile
      ? 'O WhatsApp foi aberto com o texto da oferta pronto. Como este navegador não suporta envio automático de arquivos de vídeo, anexe o vídeo manualmente no chat do WhatsApp.'
      : 'O WhatsApp foi aberto com sua mensagem pronta para envio!',
  };
}

/**
 * Abre o link direto no WhatsApp
 */
export function openDirectWhatsApp(formattedText: string) {
  const encodedText = encodeURIComponent(formattedText);
  const waUrl = `https://wa.me/?text=${encodedText}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Copia texto para a área de transferência com suporte a fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('Falha na Clipboard API, tentando execCommand:', err);
  }

  // Fallback antigo com textarea invisível
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

/**
 * Lê texto da área de transferência
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText();
      return text.trim();
    }
  } catch (err) {
    console.warn('Não foi possível ler da área de transferência:', err);
  }
  return null;
}
