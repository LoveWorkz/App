import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {Partner} from '@src/entities/Partner';

const PartnerEditPage = () => {
  return (
    <View style={styles.PartnerEditPage}>
      <Partner />
    </View>
  );
};

export default memo(PartnerEditPage);

const styles = StyleSheet.create({
  PartnerEditPage: {
    flex: 1,
  },
});
