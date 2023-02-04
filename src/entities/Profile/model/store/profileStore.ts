import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/types';
import {userStore} from '@src/entities/User';
import {Profile, ProfileErrorInfo} from '../types/profileSchema';
import {validateFields} from '../services/validation/validateFields';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigate} from '@src/shared/config/navigation/navigation';

class ProfileStore {
  profileData = {} as Profile | null;
  profileForm = {} as Profile;
  errorInfo: ProfileErrorInfo = {
    ageError: '',
    countryError: '',
    nameError: '',
    relationshipStatusError: '',
    rubricError: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  setName(name: string) {
    this.profileForm.name = name;
  }

  setAge(age: string) {
    this.profileForm.age = age;
  }

  setCountry(country: string) {
    this.profileForm.country = country;
  }

  setRelationshipStatus(staus: string) {
    this.profileForm.relationshipStatus = staus;
  }

  setRubric(rubric: string) {
    this.profileForm.rubric = rubric;
  }

  setValidationError(errorInfo: ProfileErrorInfo) {
    this.errorInfo = errorInfo;
  }

  setServerError(errorInfo: ProfileErrorInfo) {
    this.errorInfo = errorInfo;
  }

  setProfileData(data: Profile | null) {
    this.profileData = data;
  }

  clearErrors() {
    this.setValidationError({
      ageError: '',
      countryError: '',
      nameError: '',
      relationshipStatusError: '',
      rubricError: '',
    });
  }

  resetForm() {
    this.setName('');
    this.setAge('');
    this.setCountry('');
    this.setRelationshipStatus('');
    this.setRubric('');
    this.clearErrors();
  }

  fetchProfile = async () => {
    try {
      const userId = userStore.authUser?.id;
      if (userId) {
        const authUser = await firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .get();

        runInAction(() => {
          this.profileData = authUser.data() as Profile;
          this.profileForm = authUser.data() as Profile;
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  updateProfile = async () => {
    try {
      this.clearErrors();

      const {isError, errorInfo} = validateFields(this.profileForm);

      if (isError) {
        this.setValidationError(errorInfo);
        return;
      }

      const userId = userStore.authUser?.id;

      if (userId) {
        await firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .update({
            ...this.profileForm,
          });

        await this.fetchProfile();
        navigate(AppRouteNames.MAIN);
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export default new ProfileStore();
