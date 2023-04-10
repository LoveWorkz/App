import {View, StyleSheet} from 'react-native';
import React, {memo} from 'react';

const Categories = () => {
  return <View style={styles.container} />;
};

export const ComponentWrapper = memo(Categories);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
