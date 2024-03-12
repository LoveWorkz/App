import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {Profile} from '@src/entities/Profile';
import {windowHeight} from '@src/app/styles/GlobalStyle';

const SetUpPage = () => {
  return (
    <View style={styles.SetUpPage}>
      <Profile isSetUp={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  SetUpPage: {
    height: windowHeight * 0.9,
  },
});

export default memo(SetUpPage);
