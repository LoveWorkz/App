import React, {memo} from 'react';
import {StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface HowToUseItemProps {
  id: number;
  title: string;
  text: string;
}

export const HowToUseItem = (props: HowToUseItemProps) => {
  const {text, title} = props;

  return (
    <SafeAreaView style={styles.howToUseItem}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  howToUseItem: {
    paddingTop: 100,
    height: 350,
  },
  title: {
    fontSize: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
  },
});

export const Wrapper = memo(HowToUseItem);
