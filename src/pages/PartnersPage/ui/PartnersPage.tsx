import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

const PartnersPage = () => {
  return (
    <View style={styles.partners}>
      <View style={styles.block} />
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
    borderColor: '#ECEFF1',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#ECEFF1',
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
  },
  text: {
    fontSize: 16,
  },
});
