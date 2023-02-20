import React, {memo, useCallback} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Input} from '@src/shared/ui/Input/Input';
import {CountrySelect} from '@src/entities/Country';
import {RelationshipStatusSelect} from '@src/entities/RelationshipStatus';
import profileStore from '../../model/store/profileStore';
import {Wrapper as Rubrics} from '../Rubrics/Rubrics';

const ProfileForm = () => {
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

  const onRubricChangeHandler = useCallback((value: string) => {
    profileStore.setRubric(value);
  }, []);

  return (
    <SafeAreaView style={styles.profileForm}>
      <View style={styles.item}>
        <Input
          isSpaceAllowed
          initialValue={profileStore.profileData?.name}
          label={'Name'}
          value={profileStore.profileForm.name}
          onChange={onNameChangeHandler}
          placeholder={'Enter Name'}
          error={profileStore.errorInfo.nameError}
        />
      </View>
      <View style={styles.item}>
        <Input
          keyboardType={'numeric'}
          initialValue={profileStore.profileData?.age}
          label={'Age'}
          value={profileStore.profileForm.age}
          onChange={onAgeChangeHandler}
          placeholder={'Enter Age'}
          error={profileStore.errorInfo.ageError}
        />
      </View>
      <View style={styles.item}>
        <CountrySelect
          initialValue={profileStore.profileData?.country}
          country={profileStore.profileForm.country}
          changeCountry={onCountryChangeHandler}
        />
      </View>
      <View style={styles.item}>
        <RelationshipStatusSelect
          initialValue={profileStore.profileData?.relationshipStatus}
          status={profileStore.profileForm.relationshipStatus}
          changeStatus={onStatusChangeHandler}
        />
      </View>
      <View style={styles.rubrics}>
        <Rubrics
          initialValue={profileStore.profileData?.rubric}
          error={profileStore.errorInfo.rubricError}
          changeRubric={onRubricChangeHandler}
          rubric={profileStore.profileForm.rubric}
        />
      </View>
    </SafeAreaView>
  );
};

export const Wrapper = memo(observer(ProfileForm));

const styles = StyleSheet.create({
  profileForm: {
    width: '100%',
  },
  item: {
    marginBottom: 15,
  },
  rubrics: {
    marginTop: 15,
  },
});
