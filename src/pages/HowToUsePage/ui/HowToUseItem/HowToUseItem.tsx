import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

interface HowToUseItemProps {
  id: number;
  title: string;
  text: string;
}

export const HowToUseItem = (props: HowToUseItemProps) => {
  const {text, title} = props;

  return (
    <SafeAreaView style={styles.howToUseItem}>
      <AppText size={TextSize.LEVEL_7} style={styles.title} text={title} />
      <AppText size={TextSize.LEVEL_4} text={text} />
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
