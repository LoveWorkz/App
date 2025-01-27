import React, {ReactElement, useEffect, useMemo, useState} from 'react';

import {themeStorage} from '@src/shared/lib/storage/adapters/themeAdapter';
import {THEME_STORAGE_KEY} from '@src/shared/consts/storage';
import {Theme, ThemeContext} from '../lib/ThemeContext';
import {useColorScheme} from 'react-native';

interface ThemeProviderProps {
  children: ReactElement;
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  const colorScheme = useColorScheme();
  const {children} = props;

  const defaultThemeOnFirstAppLaunch =
    colorScheme === 'dark' ? Theme.Dark : Theme.LIGHT;

  const [theme, setTheme] = useState(defaultThemeOnFirstAppLaunch);

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