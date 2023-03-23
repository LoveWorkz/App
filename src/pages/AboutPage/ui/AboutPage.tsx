import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

const AboutPage = () => {
  return (
    <View style={styles.about}>
      <AppText
        style={styles.title}
        size={TextSize.LEVEL_7}
        text={'Lorem ipsum dolor sit'}
      />
      <AppText
        style={styles.text}
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
    marginBottom: 40,
  },
  text: {},
});
