import React, {ReactElement, useState} from 'react';
import { GradientContext } from '../lib/GradientContext';

interface GradientProviderProps {
  children: ReactElement | ReactElement[];
}

export const GradientProvider = (props: GradientProviderProps) => {
  const {children} = props;

  const [isGradient, setIsGradient] = useState(false);

  return (
    <GradientContext.Provider value={{isGradient, setIsGradient}}>{children}</GradientContext.Provider>
  );
};