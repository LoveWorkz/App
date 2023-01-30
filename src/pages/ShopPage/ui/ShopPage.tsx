import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

const ShopPage = () => {
  return (
    <View style={styles.container}>
      <Text>Shop Page</Text>
    </View>
  );
};

export const ComponentWrapper = memo(ShopPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
