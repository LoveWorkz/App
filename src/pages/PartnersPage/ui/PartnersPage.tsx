import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';

const PartnersPage = () => {
  const colors = useColors();

  return (
    <View style={styles.partners}>
      <View
        style={[styles.block, {backgroundColor: colors.secondaryTextColor}]}
      />
      <AppText
        style={[styles.title, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_7}
        text={'Lorem ipsum dolor sit'}
      />
      <AppText
        style={[styles.title, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporincididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
        }
      />
    </View>
  );
};

export const Wrapper = memo(PartnersPage);

const styles = StyleSheet.create({
  partners: {
    flex: 1,
  },
  block: {
    marginTop: 30,
    marginBottom: 30,
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  title: {
    marginBottom: 40,
  },
});
