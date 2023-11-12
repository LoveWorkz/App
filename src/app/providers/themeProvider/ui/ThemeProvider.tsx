import React, {ReactElement, useEffect, useMemo, useState} from 'react';

import {themeStorage} from '@src/shared/lib/storage/adapters/themeAdapter';
import {THEME_STORAGE_KEY} from '@src/shared/consts/storage';
import {Theme, ThemeContext} from '../lib/ThemeContext';

interface ThemeProviderProps {
  children: ReactElement;
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  const {children} = props;

  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

  useEffect(() => {
    const getDefaultTheme = async () => {
      const defaultTheme = await themeStorage.getTheme(THEME_STORAGE_KEY);
      defaultTheme && setTheme(defaultTheme as Theme);
    };

    getDefaultTheme();
  }, []);

  const defaultProps = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={defaultProps}>
      {children}
    </ThemeContext.Provider>
  );
};
