/* eslint-disable react-native/no-inline-styles */
import React, {memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import {AppText, TextSize, TextType} from '@src/shared/ui/AppText/AppText';
import {StyleType} from '@src/shared/types/types';
import {AlignType, TextWeight} from '@src/shared/types/textTypes';

interface GradientTextProps {
  text: string;
  size?: TextSize;
  weight?: TextWeight;
  type?: TextType;
  style?: StyleType;
  align?: AlignType;
  lineHeight?: number;
}

export const GradientText = memo((props: GradientTextProps) => {
  return (
    <MaskedView maskElement={<AppText {...props} />}>
      <LinearGradient
        colors={['#847AED', '#83C0F8']}
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}>
        <AppText align="justify" {...props} style={{opacity: 0}} />
      </LinearGradient>
    </MaskedView>
  );
});
