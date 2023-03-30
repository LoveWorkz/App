import {ColorType} from '@src/app/styles/themeStyle';
import React from 'react';

export const ColorContext = React.createContext<
  Record<'light' | 'dark', ColorType>
>({} as Record<'light' | 'dark', ColorType>);
