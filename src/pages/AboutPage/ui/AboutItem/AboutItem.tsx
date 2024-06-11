import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';

interface AboutItemProps {
  id: number;
  title: string;
  text: string;
}

export const AboutItem = (props: AboutItemProps) => {
  const {text, title} = props;
  const colors = useColors();

  return (
    <View style={styles.aboutItem}>
      <AppText
        size={TextSize.LEVEL_7}
        style={[styles.title, {color: colors.primaryTextColor}]}
        text={title}
      />
      <AppText
        style={{color: colors.primaryTextColor}}
        size={TextSize.LEVEL_4}
        text={text}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  aboutItem: {
    paddingTop: 100,
    height: 350,
    paddingBottom: 20,
  },
  title: {
    alignItems: 'center',
    marginBottom: 20,
  },
});

export const Wrapper = memo(AboutItem);
