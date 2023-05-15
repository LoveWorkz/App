import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {InAppPurchase} from '@src/features/InAppPurchase';

const ShopPage = () => {
  return (
    <View style={styles.container}>
      <InAppPurchase />
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
