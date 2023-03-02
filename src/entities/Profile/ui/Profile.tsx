import {observer} from 'mobx-react-lite';
import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {Asset} from 'react-native-image-picker';

import {Avatar, AvatarTheme} from '@src/shared/ui/Avatar/Avatar';
import {UploadPhoto} from '@src/widgets/UploadPhoto';
import {DeleteAccount} from '@src/features/DeleteAccount';
import {Wrapper as ChangePassword} from './ChangePassword/ChangePassword';
import {Wrapper as ProfileForm} from './ProfileForm/ProfileForm';
import profileStore from '../model/store/profileStore';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AuthMethod, userStore} from '@src/entities/User';

interface ProfileProps {
  isSetUp?: boolean;
}

const Profile = (props: ProfileProps) => {
  const {isSetUp = false} = props;

  useEffect(() => {
    return () => profileStore.resetForm();
  }, []);

  const onSaveHandler = () => {
    profileStore.updateProfile();
  };

  const onUploadPhotoHandler = useCallback((photoData: Asset) => {
    photoData.uri && profileStore.setTempAvatar(photoData.uri || '');
  }, []);

  const onDeletePhotoHandler = useCallback(() => {
    profileStore.deletePhoto();
  }, []);

  if (isSetUp) {
    return (
      <ScrollView>
        <View style={styles.profile}>
          <View>
            <Text style={styles.logo}>LOGO</Text>
          </View>
          <View style={styles.profileFormWrapper}>
            <ProfileForm />
          </View>
          <Button
            disabled={profileStore.isLoading}
            onPress={onSaveHandler}
            theme={ButtonTheme.OUTLINED}
            style={styles.nextButton}>
            <Text>next</Text>
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView>
      <View style={styles.profile}>
        <Avatar
          theme={AvatarTheme.LARGE}
          imageUrl={profileStore.tempAvatar || profileStore.avatar || ''}
          borderRadius={100}
        />
        <View style={styles.uploadPhotoWrapper}>
          <UploadPhoto
            deletePhoto={onDeletePhotoHandler}
            setPhtotData={onUploadPhotoHandler}
          />
        </View>
        {userStore.authMethod === AuthMethod.AUTH_BY_EMAIL && (
          <View style={styles.changePasswordWrapper}>
            <ChangePassword />
          </View>
        )}
        <View style={styles.profileFormWrapper}>
          <ProfileForm />
        </View>

        <View style={styles.btns}>
          <Button
            disabled={profileStore.isLoading}
            onPress={onSaveHandler}
            theme={ButtonTheme.OUTLINED}
            style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save changes</Text>
          </Button>
          <DeleteAccount />
        </View>
      </View>
    </ScrollView>
  );
};

export const Wrapper = memo(observer(Profile));

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    fontSize: 30,
    marginBottom: 30,
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
    marginBottom: 20,
  },
  deleteUserWrapper: {
    width: '100%',
    marginTop: 20,
  },
  btns: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  saveBtn: {
    width: '100%',
    backgroundColor: 'black',
  },
  saveBtnText: {
    color: 'white',
  },
  nextButton: {
    width: '100%',
    marginBottom: 20,
  },
});
