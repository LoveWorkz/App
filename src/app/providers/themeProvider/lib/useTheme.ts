import {useContext} from 'react';

import {Theme, ThemeContext} from './ThemeContext';

interface UseThemeResult {
  theme: Theme;
  toggleTheme: () => void;
}

export const useTheme = (): UseThemeResult => {
  const {setTheme, theme} = useContext(ThemeContext);

  const toggleTheme = () => {
    let newTheme;

    if (theme === Theme.Dark) {
      newTheme = Theme.LIGHT;
    } else {
      newTheme = Theme.Dark;
    }
    setTheme?.(newTheme);
  };

  return {
    theme: theme || Theme.LIGHT,
    toggleTheme,
  };
};
