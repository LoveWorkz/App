import {useColors} from '@src/app/providers/colorsProvider';
import * as React from 'react';
import Svg, {G, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

type Props = {
  tintColor?: string;
} & React.ComponentProps<typeof Svg>;

export const LeftLeaf = ({tintColor, ...props}: Props) => {
  const colors = useColors();
  const baseColor = colors.white;
  return (
    <Svg width={44} height={37} fill="none" {...props}>
      <G filter="url(#a)">
        <Path
          fill="url(#b)"
          fillOpacity={0.2}
          d="M1.314 16.887a2.39 2.39 0 0 0 0 3.378L14.068 33.02c4.147 4.147 10.87 4.147 15.017 0l13.784-13.784a1.593 1.593 0 0 0 0-2.253L29.552 3.665c-4.146-4.147-10.87-4.147-15.017 0L1.314 16.887Z"
        />
      </G>
      <G filter="url(#c)">
        <Path
          fill="url(#d)"
          fillOpacity={0.2}
          d="M4.17 16.736a2.39 2.39 0 0 0 0 3.38l11.294 11.293c4.147 4.147 10.87 4.147 15.017 0l12.3-12.3a1.593 1.593 0 0 0 0-2.252L30.924 5C26.777.853 20.054.853 15.907 5L4.17 16.736Z"
        />
      </G>
      <G filter="url(#e)">
        <Path
          fill="url(#f)"
          fillOpacity={0.2}
          d="M6.417 16.62a2.39 2.39 0 0 0 0 3.379l10.555 10.556c4.147 4.146 10.87 4.146 15.017 0l11.12-11.12a1.593 1.593 0 0 0 0-2.252l-11.12-11.12c-4.146-4.146-10.87-4.146-15.017.001L6.417 16.62Z"
        />
      </G>
      <Path
        stroke="#fff"
        strokeOpacity={0.1}
        strokeWidth={0.5}
        d="m4.301 21.273-.008-.014-.01-.012c-.932-1.137-1.43-1.955-1.496-2.733-.065-.757.275-1.54 1.214-2.617l11.013-9.508.013-.011.012-.013c2.85-3.259 5.89-4.671 8.877-4.467 2.994.204 6.001 2.037 8.768 5.412l.009.01 7.837 8.563c.233.284.459.548.67.796.214.25.411.48.59.702.36.444.631.828.788 1.199.153.362.197.709.102 1.087-.096.382-.337.816-.794 1.342l-10.474 8.157-.035.028-.023.037c-2.881 4.621-6.14 5.986-8.977 5.852-2.861-.134-5.355-1.796-6.673-3.343-1.166-1.368-3.005-2.81-4.89-4.286-.328-.257-.658-.515-.985-.774-2.23-1.763-4.376-3.571-5.528-5.407Z"
      />
      <G filter="url(#g)">
        <Path
          fill="url(#h)"
          d="M11.319 20.465a3.716 3.716 0 0 1 0-5.256l5.552-5.552c5.184-5.184 13.588-5.184 18.771 0l7.054 7.054c.622.622.622 1.63 0 2.252l-7.054 7.054c-5.183 5.184-13.587 5.184-18.77 0l-5.553-5.552Z"
        />
      </G>
      <Defs>
        <LinearGradient
          id="b"
          x1={0.614}
          x2={43.336}
          y1={18.342}
          y2={18.342}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0.57} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="d"
          x1={3.471}
          x2={43.247}
          y1={18.204}
          y2={18.204}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0.45} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="f"
          x1={5.717}
          x2={43.575}
          y1={18.309}
          y2={18.309}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0.805} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="h"
          x1={44.702}
          x2={10.202}
          y1={19}
          y2={18}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={tintColor ?? baseColor} stopOpacity={0} />
          <Stop offset={0.53} stopColor={tintColor ?? baseColor} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
