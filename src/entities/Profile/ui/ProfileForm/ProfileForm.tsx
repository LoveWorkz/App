import React, {memo, useCallback} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Input} from '@src/shared/ui/Input/Input';
import {CountrySelect} from '@src/entities/Country';
import {RelationshipStatusSelect} from '@src/entities/RelationshipStatus';
import {PartnerSelect} from '@src/entities/Partner';
import {userStore} from '@src/entities/User';
import profileStore from '../../model/store/profileStore';
import Preferences from '../Preferences/Preferences';

interface ProfileFormProps {
  isSetup?: boolean;
  isLoading?: boolean;
}

const ProfileForm = (props: ProfileFormProps) => {
  const {isSetup = false, isLoading = false} = props;
  const profileData = profileStore.profileData;
  const partner = profileStore.partner;
  const user = userStore.user;

  // if the user is trying to set the profile for the first time, chose the account name (google, apple)
  const userName = isSetup ? user?.name : profileData?.name;

  const {t} = useTranslation();

  const onNameChangeHandler = useCallback((value: string) => {
    profileStore.setName(value);
  }, []);

  const onAgeChangeHandler = useCallback((value: string) => {
    profileStore.setAge(value);
  }, []);

  const onCountryChangeHandler = useCallback((value: string) => {
    profileStore.setCountry(value);
  }, []);

  const onStatusChangeHandler = useCallback((value: string) => {
    profileStore.setRelationshipStatus(value);
  }, []);

  const onPreferenceChangeHandler = useCallback((value: string) => {
    profileStore.setPreferences(value);
  }, []);

  return (
    <SafeAreaView style={styles.profileForm}>
      <View style={styles.item}>
        <Input
          isLoading={isLoading}
          isSpaceAllowed
          initialValue={userName || ''}
          label={t('profile.name') || ''}
          value={profileStore.profileForm.name}
          onChange={onNameChangeHandler}
          placeholder={t('profile.enter_name') || ''}
          error={t(profileStore.errorInfo.nameError) || ''}
        />
      </View>
      <View style={styles.item}>
        <Input
          isLoading={isLoading}
          keyboardType={'numeric'}
          initialValue={profileData?.age}
          label={t('profile.age') || ''}
          value={profileStore.profileForm.age}
          onChange={onAgeChangeHandler}
          placeholder={t('profile.enter_age') || ''}
          error={
            profileStore.errorInfo.ageError &&
            t(`${profileStore.errorInfo.ageError}`)
          }
        />
      </View>
      <View style={styles.item}>
        <CountrySelect
          isLoading={isLoading}
          initialValue={profileData?.country}
          country={profileStore.profileForm.country}
          changeCountry={onCountryChangeHandler}
        />
      </View>
      <View style={styles.item}>
        <RelationshipStatusSelect
          isLoading={isLoading}
          initialValue={profileData?.relationshipStatus}
          status={profileStore.profileForm.relationshipStatus}
          changeStatus={onStatusChangeHandler}
        />
      </View>
      {!isSetup && (
        <View style={styles.item}>
          <PartnerSelect isLoading={isLoading} partner={partner} />
        </View>
      )}
      <View style={styles.preferences}>
        <Preferences
          isLoading={isLoading}
          error={t(profileStore.errorInfo.preferenceError) || ''}
          changePreference={onPreferenceChangeHandler}
          selectedPreferences={profileStore.profileForm.preferences || []}
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
  preferences: {
    marginTop: 15,
  },
});
