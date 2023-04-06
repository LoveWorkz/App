import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

const PrivacyPolicyPage = () => {
  const colors = useColors();

  return (
    <View style={styles.privacyPolicy}>
      <AppText
        style={[styles.text, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
        }
      />
    </View>
  );
};

export const Wrapper = memo(PrivacyPolicyPage);

const styles = StyleSheet.create({
  privacyPolicy: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'left',
  },
});
