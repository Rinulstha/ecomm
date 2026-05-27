import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved) return saved
  // fallback to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),

  toggleTheme: () => {
    const newTheme: Theme = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', newTheme)
    set({ theme: newTheme })
  },
}))

export default useThemeStore