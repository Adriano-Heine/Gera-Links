export interface ProductFormData {
  id: string;
  openingPhrase: string;
  productName: string;
  description: string;
  price: string; // e.g. "89,90"
  oldPrice: string; // e.g. "149,90"
  affiliateUrl: string;
  videoFile: File | null;
  videoUrl: string | null;
  videoFileName: string;
  videoFileSize: number; // in bytes
}

export type ThemeMode = 'light' | 'dark';
