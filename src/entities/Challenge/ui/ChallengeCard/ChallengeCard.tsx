import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import {
  getShadowOpacity,
  windowHeight,
  windowWidth,
} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';

interface ChallengeCardProps {
  image: number;
}

export const ChallengeCard = (props: ChallengeCardProps) => {
  const {image} = props;
  const {theme} = useTheme();

  return (
    <View style={{...getShadowOpacity(theme).shadowOpacity_level_2}}>
      <FastImage
        resizeMode="stretch"
        source={image as number} // image number
        style={styles.ChallengeCard}>
        <AppText weight={'600'} size={TextSize.LEVEL_7} text={'text'} />
      </FastImage>
    </View>
  );
};

export default memo(observer(ChallengeCard));

const styles = StyleSheet.create({
  ChallengeCard: {
    height: windowHeight * 0.75,
    width: windowWidth * 0.88,
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(40),
  },
});
