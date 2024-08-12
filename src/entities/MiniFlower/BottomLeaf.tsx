import {useColors} from '@src/app/providers/colorsProvider';
import * as React from 'react';
import Svg, {G, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

type Props = {
  tintColor?: string;
} & React.ComponentProps<typeof Svg>;

export const BottomLeaf = ({tintColor, ...props}: Props) => {
  const colors = useColors();
  const baseColor = colors.white;
  return (
    <Svg width={36} height={44} fill="none" {...props}>
      <G filter="url(#a)">
        <Path
          fill="url(#b)"
          fillOpacity={0.2}
          d="M16.639 43.123a2.39 2.39 0 0 0 3.379 0l12.754-12.754c4.147-4.147 4.147-10.87 0-15.017L18.987 1.567a1.593 1.593 0 0 0-2.252 0L3.418 14.884c-4.147 4.147-4.147 10.87 0 15.017l13.221 13.222Z"
        />
      </G>
      <G filter="url(#c)">
        <Path
          fill="url(#d)"
          fillOpacity={0.2}
          d="M16.489 40.266a2.389 2.389 0 0 0 3.379 0L31.16 28.972c4.147-4.146 4.147-10.87 0-15.017l-12.3-12.3a1.593 1.593 0 0 0-2.252 0L4.752 13.514c-4.146 4.146-4.147 10.87 0 15.016L16.49 40.267Z"
        />
      </G>
      <G filter="url(#e)">
        <Path
          fill="url(#f)"
          fillOpacity={0.2}
          d="M16.372 38.02a2.39 2.39 0 0 0 3.379 0l10.556-10.556c4.147-4.147 4.147-10.87 0-15.017L19.187 1.328a1.593 1.593 0 0 0-2.252 0L5.816 12.448c-4.146 4.146-4.146 10.87 0 15.016L16.372 38.02Z"
        />
      </G>
      <Path
        stroke="#fff"
        strokeOpacity={0.1}
        strokeWidth={0.5}
        d="m21.025 40.135-.013.009-.013.01c-1.136.931-1.955 1.429-2.733 1.495-.756.065-1.54-.275-2.616-1.213L6.142 29.422l-.012-.013-.013-.011c-3.259-2.85-4.67-5.89-4.467-8.877.205-2.994 2.037-6.002 5.413-8.769l.01-.009 8.563-7.837c.284-.233.548-.458.795-.67.25-.213.481-.41.702-.59.444-.36.829-.63 1.2-.787.362-.154.708-.197 1.087-.102.381.095.815.337 1.341.793l8.158 10.474.027.035.038.024c4.62 2.881 5.986 6.14 5.852 8.977-.135 2.86-1.797 5.354-3.343 6.672-1.369 1.167-2.81 3.006-4.287 4.891-.257.328-.514.657-.773.984-1.764 2.23-3.572 4.377-5.408 5.528Z"
      />
      <G filter="url(#g)" opacity={0.7}>
        <Path
          fill="url(#h)"
          d="M15.372 32.517a3.717 3.717 0 0 0 5.256 0l5.552-5.552c5.184-5.184 5.184-13.588 0-18.771L19.126 1.14a1.593 1.593 0 0 0-2.252 0L9.82 8.194c-5.184 5.183-5.184 13.587 0 18.77l5.552 5.553Z"
        />
      </G>
      <Defs>
        <LinearGradient
          id="b"
          x1={18.095}
          x2={18.095}
          y1={43.822}
          y2={1.101}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0.57} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="d"
          x1={17.957}
          x2={17.957}
          y1={40.966}
          y2={1.189}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0.45} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="f"
          x1={18.062}
          x2={18.062}
          y1={38.72}
          y2={0.862}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0.805} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="h"
          x1={18}
          x2={18}
          y1={33.606}
          y2={0.673}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0.5} stopColor={tintColor ?? baseColor} />
          <Stop offset={1} stopColor={tintColor ?? baseColor} stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
