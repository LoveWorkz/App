import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

const Categories = () => {
  return (
    <View style={styles.container}>
      <Text>Categories</Text>
    </View>
  );
};

export const ComponentWrapper = memo(Categories);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
