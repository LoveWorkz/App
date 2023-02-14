import {observer} from 'mobx-react-lite';
import React, {useEffect, memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {userStore} from '@src/entities/User';
import {SPLASH_PAGE_DURATION} from '@src/shared/consts/common';

export const SplashPage = () => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      userStore.initAuthUser();
    }, SPLASH_PAGE_DURATION);

    return () => clearTimeout(timerId);
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
