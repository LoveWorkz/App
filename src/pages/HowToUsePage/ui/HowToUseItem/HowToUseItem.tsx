import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';

interface HowToUseItemProps {
  id: number;
  title: string;
  text: string;
}

export const HowToUseItem = (props: HowToUseItemProps) => {
  const {text, title} = props;
  const colors = useColors();

  return (
    <SafeAreaView style={styles.howToUseItem}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  howToUseItem: {
    paddingTop: 100,
    height: 350,
    paddingBottom: 20,
  },
  title: {
    alignItems: 'center',
    marginBottom: 20,
  },
});

export const Wrapper = memo(HowToUseItem);
