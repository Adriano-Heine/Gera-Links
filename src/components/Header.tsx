import React from 'react';
import { Share2, Moon, Sun } from 'lucide-react';
import { ThemeMode } from '../types';

interface HeaderProps {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  themeMode,
  onToggleTheme,
}) => {
  const isDark = themeMode === 'dark';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <Share2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base md:text-lg tracking-tight text-zinc-900 dark:text-white leading-none">
                Compartilha Produto
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-300/40 dark:border-emerald-700/50">
                Afiliados
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Vídeo 9:16 + mensagem formatada para WhatsApp
            </p>
          </div>
        </div>

        {/* Botão de Alternar Tema (Claro / Escuro) */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 transition-all active:scale-95 cursor-pointer shadow-2xs"
          title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          aria-label="Alternar tema claro e escuro"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span className="hidden sm:inline">Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-zinc-700 fill-zinc-700/10" />
              <span className="hidden sm:inline">Modo Escuro</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
