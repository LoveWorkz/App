import {observer} from 'mobx-react-lite';
import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Asset} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';

import {Avatar, AvatarTheme} from '@src/shared/ui/Avatar/Avatar';
import {UploadPhoto} from '@src/widgets/UploadPhoto';
import {DeleteAccount} from '@src/features/DeleteAccount';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AuthMethod, userStore} from '@src/entities/User';
import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Wrapper as ChangePassword} from './ChangePassword/ChangePassword';
import ProfileForm from './ProfileForm/ProfileForm';
import profileStore from '../model/store/profileStore';

interface ProfileProps {
  isSetUp?: boolean;
}

const Profile = (props: ProfileProps) => {
  const {isSetUp = false} = props;
  const colors = useColors();
  const {t} = useTranslation();

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
      <View style={styles.profile}>
        <View style={styles.profileFormWrapper}>
          <ProfileForm />
        </View>
        <Button
          disabled={profileStore.isLoading}
          onPress={onSaveHandler}
          theme={ButtonTheme.GRADIENT}
          style={styles.nextButton}>
          <AppText
            text={t('next')}
            size={TextSize.LEVEL_4}
            style={{color: colors.bgQuinaryColor}}
          />
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.profile}>
      <Avatar
        theme={AvatarTheme.LARGE}
        imageUrl={profileStore.tempAvatar || profileStore.avatar || ''}
        borderRadius={100}
      />
      <View style={styles.uploadPhotoWrapper}>
        <UploadPhoto
          style={styles.uploadPhoto}
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
          theme={ButtonTheme.GRADIENT}
          style={styles.saveBtn}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
            size={TextSize.LEVEL_4}
            text={t('profile.save_changes')}
          />
        </Button>
        <DeleteAccount />
      </View>
    </View>
  );
};

export const Wrapper = memo(observer(Profile));

const styles = StyleSheet.create({
  profile: {
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
  },
  nextButton: {
    width: '100%',
    marginTop: 20,
  },
  uploadPhoto: {
    width: 180,
  },
});
