import {observer} from 'mobx-react-lite';
import React, {useEffect, memo} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';

import {AppRouteNames} from '@src/shared/config/configRoute';
import {userFormatter, userStore} from '@src/entities/User';
import {navigate} from '@src/shared/config/navigation/navigation';
import {InitlUserInfo} from '@src/features/authByEmail';

export const SplashPage = () => {
  useEffect(() => {
    const onAuthStateChanged = async () => {
      await auth().currentUser?.reload();

      setTimeout(() => {
        const user = auth().currentUser;
        if (user) {
          const formattedUser = userFormatter(user as InitlUserInfo);
          userStore.setAuthUser(formattedUser);
          navigate(AppRouteNames.MAIN);
        } else {
          navigate(AppRouteNames.AUTH);
        }
      }, 1000);
    };

    onAuthStateChanged();
  }, []);

  return (
    <View style={styles.SplashPage}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export const ComponentWrapper = memo(observer(SplashPage));

const styles = StyleSheet.create({
  SplashPage: {
    padding: 15,
  },
});
