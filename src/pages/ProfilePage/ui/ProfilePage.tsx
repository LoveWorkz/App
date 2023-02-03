import {observer} from 'mobx-react-lite';
import React, {memo} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {profileStore} from '@src/entities/Profile';
import {Avatar, AvatarTheme} from '@src/shared/ui/Avatar/Avatar';
import {UploadPhoto} from '@src/widgets/UploadPhoto';
import {DeleteUserAccount} from '@src/features/DeleteAccount';
import {Wrapper as ChangePassword} from './ChangePassword/ChangePassword';
import {Wrapper as ProfileForm} from './ProfileForm/ProfileForm';

const ProfilePage = () => {
  return (
    <FlatList
      data={[1]}
      renderItem={() => (
        <View style={styles.profile}>
          <Avatar
            theme={AvatarTheme.LARGE}
            imageUrl={profileStore.profileData?.photo || ''}
            borderRadius={100}
          />
          <View style={styles.uploadPhotoWrapper}>
            <UploadPhoto />
          </View>
          <View style={styles.changePasswordWrapper}>
            <ChangePassword />
          </View>
          <View style={styles.profileFormWrapper}>
            <ProfileForm />
          </View>
          <View style={styles.deleteUserWrapper}>
            <DeleteUserAccount />
          </View>
        </View>
      )}
      onEndReachedThreshold={50}
    />
  );
};

export const Wrapper = memo(observer(ProfilePage));

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    alignItems: 'center',
  },
  uploadPhotoWrapper: {
    marginTop: -20,
  },
  changePasswordWrapper: {
    marginTop: 30,
    marginBottom: 30,
    width: '100%',
  },
  profileFormWrapper: {
    width: '100%',
  },
  deleteUserWrapper: {
    width: '100%',
    marginTop: 20,
  },
});
