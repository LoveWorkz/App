import {useColors} from '@src/app/providers/colorsProvider';
import * as React from 'react';
import Svg, {G, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

type Props = {
  tintColor?: string;
} & React.ComponentProps<typeof Svg>;

export const RightLeaf = ({tintColor, ...props}: Props) => {
  const colors = useColors();
  const baseColor = colors.white;
  return (
    <Svg width={44} height={37} fill="none" {...props}>
      <G filter="url(#a)">
        <Path
          fill="url(#b)"
          fillOpacity={0.2}
          d="M42.876 19.798a2.39 2.39 0 0 0 0-3.379L30.123 3.665c-4.147-4.147-10.87-4.147-15.017 0L1.32 17.45a1.593 1.593 0 0 0 0 2.252L14.638 33.02c4.147 4.147 10.87 4.147 15.017 0l13.221-13.221Z"
        />
      </G>
      <G filter="url(#c)">
        <Path
          fill="url(#d)"
          fillOpacity={0.2}
          d="M40.02 19.948a2.39 2.39 0 0 0 0-3.379L28.726 5.276c-4.147-4.147-10.87-4.147-15.017 0l-12.3 12.3a1.593 1.593 0 0 0 0 2.252l11.857 11.857c4.147 4.146 10.87 4.146 15.017 0L40.02 19.948Z"
        />
      </G>
      <G filter="url(#e)">
        <Path
          fill="url(#f)"
          fillOpacity={0.2}
          d="M37.774 20.065a2.39 2.39 0 0 0 0-3.379L27.218 6.13c-4.147-4.147-10.87-4.147-15.017 0L1.082 17.25a1.593 1.593 0 0 0 0 2.252l11.12 11.119c4.146 4.146 10.87 4.146 15.016 0l10.556-10.556Z"
        />
      </G>
      <Path
        stroke="#fff"
        strokeOpacity={0.1}
        strokeWidth={0.5}
        d="m39.89 15.412.008.013.01.013c.931 1.136 1.429 1.955 1.495 2.733.065.756-.275 1.54-1.213 2.617l-11.014 9.507-.013.012-.011.013c-2.85 3.259-5.89 4.67-8.877 4.467-2.994-.205-6.002-2.037-8.769-5.413l-.009-.01L3.66 20.8c-.233-.284-.458-.548-.67-.795-.213-.25-.41-.481-.59-.702-.36-.444-.63-.828-.787-1.2-.154-.362-.197-.708-.103-1.087.096-.381.338-.816.794-1.341l10.474-8.158.035-.027.024-.038c2.881-4.62 6.14-5.986 8.977-5.852 2.86.135 5.354 1.797 6.672 3.343 1.167 1.369 3.006 2.81 4.891 4.287.328.257.657.514.984.773 2.23 1.764 4.377 3.572 5.528 5.408Z"
      />
      <G filter="url(#g)" opacity={0.7}>
        <Path
          fill="url(#h)"
          d="M32.871 20.465a3.717 3.717 0 0 0 0-5.256L27.32 9.657c-5.184-5.184-13.588-5.184-18.771 0L1.494 16.71a1.593 1.593 0 0 0 0 2.252l7.054 7.054c5.183 5.184 13.587 5.184 18.77 0l5.553-5.552Z"
        />
      </G>
      <Defs>
        <LinearGradient
          id="b"
          x1={43.576}
          x2={0.855}
          y1={18.342}
          y2={18.342}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0.57} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="d"
          x1={40.72}
          x2={0.943}
          y1={18.48}
          y2={18.48}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0.45} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="f"
          x1={38.474}
          x2={0.616}
          y1={18.375}
          y2={18.375}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={0.805} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="h"
          x1={35.499}
          x2={0.999}
          y1={19}
          y2={18}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0.5} stopColor={tintColor ?? baseColor} />
          <Stop offset={1} stopColor={tintColor ?? baseColor} stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
