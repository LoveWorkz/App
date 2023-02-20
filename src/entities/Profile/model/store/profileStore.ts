import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {Collections} from '@src/shared/types/types';
import {userStore} from '@src/entities/User';
import {Profile, ProfileErrorInfo} from '../types/profileSchema';
import {validateFields} from '../services/validation/validateFields';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/config/navigation/navigation';

class ProfileStore {
  profileData = null as Profile | null;
  profileForm = {} as Profile;
  errorInfo: ProfileErrorInfo = {
    ageError: '',
    countryError: '',
    nameError: '',
    relationshipStatusError: '',
    rubricError: '',
  };
  fileName: string = '';
  isLoading: boolean = false;

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

  setProfileForm(data: Profile) {
    this.profileForm = data;
  }

  setPhoto(photo: string) {
    this.profileForm.photo = photo;
  }

  setFileName(name: string) {
    this.fileName = name;
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  clearProfileData() {
    this.setProfileData(null);
    this.setProfileForm({} as Profile);
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

  putFileToStorage = async () => {
    if (this.fileName && this.profileForm.photo) {
      const reference = storage().ref(this.fileName);
      await reference.putFile(this.profileForm.photo);
    }
  };

  resetForm() {
    this.setName('');
    this.setAge('');
    this.setCountry('');
    this.setRelationshipStatus('');
    this.setRubric('');
    this.setPhoto('');
    this.setFileName('');
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
          this.setProfileData(authUser.data() as Profile);
          this.setProfileForm(authUser.data() as Profile);
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

      this.setIsLoading(true);

      const userId = userStore.authUser?.id;

      if (userId) {
        await firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .update({
            ...this.profileForm,
          });

        await this.putFileToStorage();

        await this.fetchProfile();
        navigation.replace(AppRouteNames.MAIN);
      }
      this.setIsLoading(false);
    } catch (e) {
      this.setIsLoading(false);
      console.log(e);
    }
  };

  deletePhoto = async () => {
    try {
      this.setPhoto('');
      this.setFileName('');

      const userId = userStore.authUser?.id;
      await firestore()
        .collection(Collections.USERS)
        .doc(userId)
        .update({
          ...this.profileForm,
          photo: '',
        });

      await this.fetchProfile();
    } catch (e) {
      console.log(e);
    }
  };
}

export default new ProfileStore();
