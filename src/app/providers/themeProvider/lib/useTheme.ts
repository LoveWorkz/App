import {useContext} from 'react';

import {THEME_STORAGE_KEY} from '@src/shared/consts/storage';
import {themeStorage} from '@src/shared/lib/storage/adapters/themeAdapter';

import {Theme, ThemeContext} from './ThemeContext';

interface UseThemeResult {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

export const useTheme = (): UseThemeResult => {
  const {setTheme, theme} = useContext(ThemeContext);
  const isDark = theme === Theme.Dark;

  const toggleTheme = () => {
    let newTheme;

    if (theme === Theme.Dark) {
      newTheme = Theme.LIGHT;
    } else {
      newTheme = Theme.Dark;
    }
    setTheme?.(newTheme);
    themeStorage.setTheme(THEME_STORAGE_KEY, newTheme);
  };

  return {
    theme: theme || Theme.LIGHT,
    toggleTheme,
    isDark,
  };
};
