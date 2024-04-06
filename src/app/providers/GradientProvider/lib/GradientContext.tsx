import React from 'react';

export interface GradientContextProps {
  isGradient: boolean;
  setIsGradient: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GradientContext = React.createContext<GradientContextProps>({
  isGradient: false,
  setIsGradient: () => {},
});
