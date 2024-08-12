import {useColors} from '@src/app/providers/colorsProvider';
import * as React from 'react';
import Svg, {G, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

type Props = {
  tintColor?: string;
} & React.ComponentProps<typeof Svg>;

export const TopLeaf = ({tintColor, ...props}: Props) => {
  const colors = useColors();
  const baseColor = colors.white;
  return (
    <Svg width={36} height={44} fill="none" {...props}>
      <G filter="url(#a)">
        <Path
          fill="url(#b)"
          fillOpacity={0.2}
          d="M19.551 1.561a2.39 2.39 0 0 0-3.378 0L3.419 14.315c-4.147 4.147-4.147 10.87 0 15.017l13.784 13.785c.622.622 1.63.622 2.253 0L32.773 29.8c4.146-4.147 4.146-10.87 0-15.017L19.55 1.56Z"
        />
      </G>
      <G filter="url(#c)">
        <Path
          fill="url(#d)"
          fillOpacity={0.2}
          d="M19.702 4.418a2.39 2.39 0 0 0-3.379 0L5.03 15.71c-4.147 4.147-4.147 10.87 0 15.017l12.3 12.3c.621.622 1.63.622 2.252 0l11.857-11.857c4.146-4.146 4.146-10.87 0-15.017L19.702 4.418Z"
        />
      </G>
      <G filter="url(#e)">
        <Path
          fill="url(#f)"
          fillOpacity={0.2}
          d="M19.818 6.664a2.39 2.39 0 0 0-3.379 0L5.884 17.22c-4.147 4.147-4.147 10.87 0 15.017l11.119 11.119c.622.622 1.63.622 2.252 0l11.12-11.12c4.146-4.146 4.146-10.87-.001-15.016L19.818 6.664Z"
        />
      </G>
      <Path
        stroke="#fff"
        strokeOpacity={0.1}
        strokeWidth={0.5}
        d="m15.16 4.548.013-.008.012-.01c1.137-.932 1.955-1.43 2.733-1.496.757-.065 1.54.275 2.617 1.214l9.508 11.013.011.013.013.012c3.26 2.849 4.671 5.89 4.468 8.877-.205 2.994-2.037 6.001-5.413 8.768l-.01.009-8.563 7.837c-.284.233-.548.459-.795.67h-.001c-.25.213-.48.411-.701.59-.444.36-.829.63-1.2.788-.362.153-.709.197-1.087.102-.381-.096-.816-.337-1.341-.794L7.266 31.66l-.028-.035-.037-.023c-4.62-2.882-5.986-6.14-5.852-8.977.134-2.861 1.796-5.355 3.343-6.673 1.369-1.166 2.81-3.005 4.286-4.89.257-.329.515-.658.774-.985 1.763-2.23 3.571-4.376 5.407-5.528Z"
      />
      <G filter="url(#g)" opacity={0.7}>
        <Path
          fill="url(#h)"
          d="M15.372 11.966a3.717 3.717 0 0 1 5.256 0l5.552 5.552c5.184 5.183 5.184 13.587 0 18.77l-7.053 7.055a1.593 1.593 0 0 1-2.253 0L9.82 36.289c-5.183-5.184-5.183-13.588 0-18.771l5.552-5.553Z"
        />
      </G>
      <Defs>
        <LinearGradient
          id="b"
          x1={18.096}
          x2={18.096}
          y1={0.862}
          y2={43.583}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0.57} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="d"
          x1={18.234}
          x2={18.234}
          y1={3.718}
          y2={43.495}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0.45} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="f"
          x1={18.129}
          x2={18.129}
          y1={5.964}
          y2={43.822}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0.805} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="h"
          x1={18}
          x2={18}
          y1={10.877}
          y2={43.809}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0.5} stopColor={tintColor ?? baseColor} />
          <Stop offset={1} stopColor={tintColor ?? baseColor} stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
