import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

const PrivacyPolicyPage = () => {
  return (
    <View style={styles.privacyPolicy}>
      <Text style={styles.text}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem
        ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
        do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt
      </Text>
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
  },
});
