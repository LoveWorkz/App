import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {CloudStoragePaths, Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {
  Profile,
  ProfileErrorInfo,
  ProfilePhotoActionType,
} from '../types/profileSchema';
import {validateFields} from '../services/validation/validateFields';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/config/navigation/navigation';
import {StorageServices} from '@src/shared/lib/firebase/storageServices/storageServices';

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
  initialAvatar: string = '';
  chosenAvatar: string = '';
  isLoading: boolean = false;
  initialFetching: boolean = true;

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

  setPhoto(avatar: string) {
    this.chosenAvatar = avatar;
  }

  clearProfileData() {
    this.setProfileData(null);
    this.setProfileForm({} as Profile);
    this.setPhoto('');
    this.initialAvatar = '';
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

  profilePhotoAction = async (type: ProfilePhotoActionType) => {
    try {
      if (!this.profileData?.id) {
        return;
      }

      const cloudStorage = new StorageServices({
        folderName: CloudStoragePaths.AVATARS,
        fileName: this.profileData?.id,
      });

      switch (type) {
        case ProfilePhotoActionType.UPLOAD:
          if (!this.chosenAvatar) {
            return;
          }

          const isSelectedNewPhoto = this.chosenAvatar !== this.initialAvatar;
          if (!isSelectedNewPhoto) {
            return;
          }

          await cloudStorage.upload(this.chosenAvatar);
          break;
        case ProfilePhotoActionType.DOWNLOAD:
          const avatar = await cloudStorage.download();

          runInAction(() => {
            this.chosenAvatar = avatar;
            this.initialAvatar = avatar;
          });
          break;
        case ProfilePhotoActionType.DELETE:
          await cloudStorage.detete();
          break;
      }
    } catch (e) {
      console.log(e);
    }
  };

  resetForm() {
    this.setName('');
    this.setAge('');
    this.setCountry('');
    this.setRelationshipStatus('');
    this.setRubric('');
    this.setPhoto('');
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

        await this.profilePhotoAction(ProfilePhotoActionType.DOWNLOAD);
      }
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.initialFetching = false;
      });
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

      this.isLoading = true;

      const userId = userStore.authUser?.id;

      if (userId) {
        await firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .update({
            ...this.profileForm,
          });

        await this.profilePhotoAction(ProfilePhotoActionType.UPLOAD);

        navigation.replace(AppRouteNames.MAIN);
      }
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  deletePhoto = async () => {
    try {
      this.setPhoto('');
      await this.profilePhotoAction(ProfilePhotoActionType.DELETE);

      await this.fetchProfile();
    } catch (e) {
      console.log(e);
    }
  };
}

export default new ProfileStore();
