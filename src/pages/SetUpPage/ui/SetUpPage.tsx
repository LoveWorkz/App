import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {Profile} from '@src/entities/Profile';

const SetUpPage = () => {
  return (
    <View style={styles.setUp}>
      <Profile isSetUp={true} />;
    </View>
  );
};

export const Wrapper = memo(SetUpPage);

const styles = StyleSheet.create({
  setUp: {
    paddingTop: 20,
  },
});
