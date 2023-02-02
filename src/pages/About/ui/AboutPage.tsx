import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

const AboutPage = () => {
  return (
    <View style={styles.about}>
      <Text style={styles.title}>Lorem ipsum dolor sit</Text>
      <Text style={styles.text}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem
        ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt
      </Text>
    </View>
  );
};

export const Wrapper = memo(AboutPage);

const styles = StyleSheet.create({
  about: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
  },
  text: {
    fontSize: 16,
  },
});
