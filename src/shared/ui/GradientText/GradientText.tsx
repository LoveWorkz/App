import React, {memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import {
  AppText,
  TextSize,
  TextWeight,
  TextType,
} from '@src/shared/ui/AppText/AppText';
import {StyleType} from '@src/shared/types/types';

interface GradientTextProps {
  text: string;
  size?: TextSize;
  weight?: TextWeight;
  type?: TextType;
  style?: StyleType;
}

export const GradientText = memo((props: GradientTextProps) => {
  return (
    <MaskedView maskElement={<AppText {...props} />}>
      <LinearGradient
        colors={['#8CBBE9', '#ECB7FF']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <AppText {...props} style={{opacity: 0}} />
      </LinearGradient>
    </MaskedView>
  );
});
