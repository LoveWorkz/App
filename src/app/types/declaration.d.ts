declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.svg' {
  import React from 'react';

  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}
declare module 'react-native-flags';
