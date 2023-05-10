import React, {ReactElement} from 'react';

import colors from '@src/app/styles/themeStyle';
import {ColorContext} from '../lib/ColorContext';

interface ColorsProviderProps {
  children: ReactElement | ReactElement[];
}

export const ColorsProvider = (props: ColorsProviderProps) => {
  const {children} = props;

  return (
    <ColorContext.Provider value={colors}>{children}</ColorContext.Provider>
  );
};
