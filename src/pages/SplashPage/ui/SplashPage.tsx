import {observer} from 'mobx-react-lite';
import React, {useEffect, memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {userStore} from '@src/entities/User';

export const SplashPage = () => {
  useEffect(() => {
    userStore.initAuthUser();
  }, []);

  return (
    <View style={styles.SplashPage}>
      <Text style={styles.text}>Splash Page</Text>
    </View>
  );
};

export const ComponentWrapper = memo(observer(SplashPage));

const styles = StyleSheet.create({
  SplashPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
  },
});
