import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';

const AboutPage = () => {
  const colors = useColors();

  return (
    <View style={styles.about}>
      <AppText
        style={[styles.title, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_7}
        text={'Lorem ipsum dolor sit'}
      />
      <AppText
        style={[styles.text, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporincididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
        }
      />
    </View>
  );
};

export const Wrapper = memo(AboutPage);

const styles = StyleSheet.create({
  about: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'left',
  },
  title: {
    marginBottom: verticalScale(40),
  },
  text: {},
});
