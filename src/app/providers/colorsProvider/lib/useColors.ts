import {useContext} from 'react';

import {ColorType} from '@src/app/styles/themeStyle';
import {ColorContext} from './ColorContext';
import {Theme, useTheme} from '@src/app/providers/themeProvider';

export const useColors = (): ColorType => {
  const {theme} = useTheme();
  const colors = useContext(ColorContext);

  const isDarkMode = theme === Theme.Dark;

  return isDarkMode ? colors.dark : colors.light;
};
