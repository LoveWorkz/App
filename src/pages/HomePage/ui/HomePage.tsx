import React, {memo, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {profileStore} from '@src/entities/Profile';
import {ComponentWrapper as Header} from './Header/Header';
import {HomeCategory} from '@src/widgets/HomeCategory';
import {Loader, LoaderSize} from '@src/shared/ui/Loader/Loader';
import {ComponentWrapper as CategoriesCarousel} from './CategoriesCarousel/CategoriesCarousel';
import {ComponentWrapper as Challanges} from './Challanges/Challanges';
import {userStore} from '@src/entities/User';

const HomePage = () => {
  useFocusEffect(
    React.useCallback(() => {
      profileStore.fetchProfile();
    }, []),
  );

  const verifyEmailHandler = useCallback(async () => {
    userStore.verifyEmail();
  }, []);

  if (!profileStore.profileData) {
    return (
      <View style={styles.loader}>
        <Loader size={LoaderSize.LARGE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header
          name={profileStore.profileData.name || ''}
          imageUrl={profileStore.profileData.photo || ''}
        />
      </View>
      <View style={styles.homeCategoryWrapper}>
        <HomeCategory />
      </View>
      <CategoriesCarousel />
      <View style={styles.challangesWrapper}>
        <Challanges />
      </View>
      {!profileStore.profileData.emailVerified && (
        <Button
          style={styles.confirmEmail}
          theme={ButtonTheme.OUTLINED}
          onPress={verifyEmailHandler}>
          <Text>Confirm email</Text>
        </Button>
      )}
    </View>
  );
};

export const ComponentWrapper = memo(observer(HomePage));

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerWrapper: {
    marginBottom: 20,
  },
  confirmEmail: {
    marginTop: 10,
  },
  homeCategoryWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  challangesWrapper: {
    marginTop: 10,
    width: '100%',
  },
});
