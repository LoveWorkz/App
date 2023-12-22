import React, {memo, useCallback} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Input} from '@src/shared/ui/Input/Input';
import {CountrySelect} from '@src/entities/Country';
import {Gender} from '@src/entities/Gender';
import {userStore} from '@src/entities/User';
import {CustomDatePicker} from '@src/shared/ui/CustomDatePicker/CustomDatePicker';
import profileStore from '../../model/store/profileStore';

interface ProfileFormProps {
  isSetup?: boolean;
  isLoading?: boolean;
}

const ProfileForm = (props: ProfileFormProps) => {
  const {isSetup = false, isLoading = false} = props;
  const profileData = profileStore.profileData;
  const user = userStore.user;

  // if the user is trying to set the profile for the first time, chose the account name (google, apple)
  const userName = isSetup ? user?.name : profileData?.name;

  const {t} = useTranslation();

  const onNameChangeHandler = useCallback((value: string) => {
    profileStore.setName(value);
  }, []);

  const onGenderChangeHandler = useCallback((value: string) => {
    profileStore.setGender(value);
  }, []);

  const onEmailChangeHandler = useCallback((value: string) => {
    profileStore.setEmail(value);
  }, []);

  const onCountryChangeHandler = useCallback((value: string) => {
    profileStore.setCountry(value);
  }, []);

  const onBirthDateChangeHandler = useCallback((date: string) => {
    profileStore.setBirthDate(date);
  }, []);

  return (
    <SafeAreaView style={styles.profileForm}>
      <View style={styles.item}>
        <Input
          isLoading={isLoading}
          isSpaceAllowed
          initialValue={userName}
          label={t('profile.name')}
          value={profileStore.profileForm.name}
          onChange={onNameChangeHandler}
          placeholder={t('profile.enter_name')}
          error={t(profileStore.errorInfo.nameError)}
        />
      </View>
      <View style={styles.item}>
        <Input
          isLoading={isLoading}
          initialValue={profileData?.email}
          label={t('auth.email')}
          value={profileStore.profileForm.email}
          onChange={onEmailChangeHandler}
          placeholder={t('auth.enter_email')}
          error={t(profileStore.errorInfo.emailError)}
        />
      </View>
      <View style={styles.item}>
        <CustomDatePicker
          label={t('profile.date_of_birth')}
          isLoading={isLoading}
          selectedDate={profileStore.profileForm.birthDate}
          setSelectedDate={onBirthDateChangeHandler}
          error={t(profileStore.errorInfo.birthDateError) || ''}
        />
      </View>
      <View style={styles.item}>
        <CountrySelect
          isLoading={isLoading}
          initialValue={profileData?.country}
          country={profileStore.profileForm.country}
          changeCountry={onCountryChangeHandler}
          error={t(profileStore.errorInfo.countryError)}
        />
      </View>
      <View style={styles.item}>
        <Gender
          isLoading={isLoading}
          initialValue={profileData?.gender}
          gender={profileStore.profileForm.gender}
          changeGender={onGenderChangeHandler}
          error={t(profileStore.errorInfo.genderError)}
        />
      </View>
    </SafeAreaView>
  );
};

export default memo(observer(ProfileForm));

const styles = StyleSheet.create({
  profileForm: {
    width: '100%',
  },
  item: {
    marginBottom: 15,
  },
});
