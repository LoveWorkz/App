import {observer} from 'mobx-react-lite';
import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Asset} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';

import {Avatar} from '@src/shared/ui/Avatar/Avatar';
import {UploadPhoto} from '@src/widgets/UploadPhoto';
import {DeleteAccount} from '@src/features/DeleteAccount';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AuthMethod, userStore} from '@src/entities/User';
import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {isPlatformIos} from '@src/shared/consts/common';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {Wrapper as ChangePassword} from './ChangePassword/ChangePassword';
import ProfileForm from './ProfileForm/ProfileForm';
import profileStore from '../model/store/profileStore';
import {useTheme} from '@src/app/providers/themeProvider';

interface ProfileProps {
  isSetUp?: boolean;
}

const uploadPhotoWidth = horizontalScale(180);

const Profile = (props: ProfileProps) => {
  const {isSetUp = false} = props;
  const userAvatar = userStore.user?.photo;
  const isLoading = profileStore.isFetchingProfile;
  const isAuthMethodEmail = userStore.authMethod === AuthMethod.AUTH_BY_EMAIL;

  const colors = useColors();
  const {t} = useTranslation();
  const {isDark} = useTheme();

  useEffect(() => {
    profileStore.fetchProfile();

    return () => profileStore.resetForm();
  }, []);

  useEffect(() => {
    if (isSetUp && userAvatar) {
      // if the user is trying to set the profile for the first time, chose the account photo (google, apple)
      profileStore.setAvatar(userAvatar);
    }
  }, [userAvatar, isSetUp]);

  const onSaveHandler = () => {
    profileStore.updateProfile({isSetUp});
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
          <ProfileForm isLoading={isLoading} isSetup />
        </View>
        <Button
          disabled={profileStore.isLoading}
          onPress={onSaveHandler}
          theme={ButtonTheme.GRADIENT}
          style={styles.nextButton}>
          <AppText
            text={t('common.next')}
            size={TextSize.LEVEL_4}
            style={{color: colors.bgQuinaryColor}}
          />
        </Button>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.profile}>
        <Avatar
          imageUrl={profileStore.tempAvatar || profileStore.avatar || ''}
          borderRadius={100}
          size={200}
        />
        <View style={styles.uploadPhotoWrapper}>
          <Skeleton width={uploadPhotoWidth} height={40} borderRadius={10} />
        </View>

        <View style={styles.profileFormWrapper}>
          <ProfileForm isLoading={isLoading} />
        </View>
        {isAuthMethodEmail && (
          <View style={styles.changePasswordWrapper}>
            <Skeleton width={100} height={20} />
          </View>
        )}
        <View style={styles.btns}>
          <View style={styles.btnSkeleton}>
            <Button isLoading={isLoading}>
              <></>
            </Button>
          </View>
          <Skeleton width={100} height={15} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.profile}>
      <Avatar
        size={200}
        imageUrl={profileStore.tempAvatar || profileStore.avatar || ''}
        borderRadius={100}
      />
      <View style={styles.uploadPhotoWrapper}>
        <UploadPhoto
          style={styles.uploadPhoto}
          deletePhoto={onDeletePhotoHandler}
          setPhtotData={onUploadPhotoHandler}
          isDeletingPhoto={profileStore.isDeletingPhoto}
        />
      </View>

      <View style={styles.profileFormWrapper}>
        <ProfileForm />
      </View>

      {isAuthMethodEmail && (
        <View style={styles.changePasswordWrapper}>
          <ChangePassword />
        </View>
      )}

      <View style={styles.btns}>
        <Button
          disabled={profileStore.isLoading}
          onPress={onSaveHandler}
          theme={ButtonTheme.GRADIENT}
          style={styles.saveBtn}>
          <AppText
            style={{color: isDark ? colors.white : colors.bgQuinaryColor}}
            size={TextSize.LEVEL_4}
            text={t('common.save')}
          />
        </Button>
        <DeleteAccount />
      </View>
    </View>
  );
};

export default memo(observer(Profile));

const styles = StyleSheet.create({
  profile: {
    alignItems: 'center',
    flex: 1,
  },
  uploadPhotoWrapper: {
    marginTop: verticalScale(-20),
  },
  changePasswordWrapper: {
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
    width: '100%',
  },
  profileFormWrapper: {
    width: '100%',
    marginTop: verticalScale(20),
  },
  deleteUserWrapper: {
    width: '100%',
    marginTop: verticalScale(20),
  },
  btns: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    alignItems: 'center',
    width: '100%',
  },
  saveBtn: {
    width: '100%',
  },
  nextButton: {
    width: '100%',
    position: 'absolute',
    bottom: verticalScale(isPlatformIos ? 0 : 10),
  },
  uploadPhoto: {
    width: horizontalScale(180),
  },

  btnSkeleton: {
    marginBottom: 10,
  },
});
