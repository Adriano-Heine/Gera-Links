import { ProductFormData } from '../types';

/**
 * Monta a mensagem de texto no formato aceito pelo WhatsApp:
 * 
 * {frase de abertura}
 * 
 * *{nome do produto}*
 * {descrição}
 * 
 * 💰 Por apenas *R$ {valor}* (de ~R$ {valor antigo}~)
 * 
 * 👉 Compre aqui: {link de afiliado}
 * 
 * Omite linhas de campos vazios e limpa quebras excessivas.
 */
export function buildWhatsAppMessage(data: Partial<ProductFormData>): string {
  const sections: string[] = [];

  // 1. Frase de abertura
  const opening = data.openingPhrase?.trim();
  if (opening) {
    sections.push(opening);
  }

  // 2. Nome do produto e Descrição (ficam no mesmo bloco com quebra simples)
  const productLines: string[] = [];
  const name = data.productName?.trim();
  if (name) {
    productLines.push(`*${name}*`);
  }
  const desc = data.description?.trim();
  if (desc) {
    productLines.push(desc);
  }
  if (productLines.length > 0) {
    sections.push(productLines.join('\n'));
  }

  // 3. Preço
  const price = data.price?.trim();
  const oldPrice = data.oldPrice?.trim();

  if (price && oldPrice) {
    sections.push(`💰 Por apenas *R$ ${price}* (de ~R$ ${oldPrice}~)`);
  } else if (price) {
    sections.push(`💰 Por apenas *R$ ${price}*`);
  } else if (oldPrice) {
    sections.push(`💰 Valor anterior: ~R$ ${oldPrice}~`);
  }

  // 4. Link de afiliado
  const link = data.affiliateUrl?.trim();
  if (link) {
    sections.push(`👉 Compre aqui: ${link}`);
  }

  return sections.join('\n\n');
}

/**
 * Valida se uma string aparenta ser uma URL válida
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
