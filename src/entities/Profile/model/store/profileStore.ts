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
import {navigation} from '@src/shared/lib/navigation/navigation';
import {StorageServices} from '@src/shared/lib/firebase/storageServices/storageServices';
import {favoriteStore} from '@src/entities/Favorite';

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
  avatar: string = '';
  tempAvatar: string = '';
  currentCategory: string = '';

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

  setAvatar(avatar: string) {
    this.avatar = avatar;
    this.setTempAvatar(avatar);
  }

  setCurrentCategory(category: string) {
    this.currentCategory = category;
  }

  setTempAvatar(avatar: string) {
    this.tempAvatar = avatar;
  }

  clearProfileData() {
    this.setProfileData(null);
    this.setProfileForm({} as Profile);
    this.setAvatar('');
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
          if (!this.tempAvatar) {
            return '';
          }

          const isFileFromDevice = this.tempAvatar.startsWith('file://');

          if (isFileFromDevice) {
            await cloudStorage.upload(this.tempAvatar);
            const url = await cloudStorage.download();
            return url;
          } else {
            return this.avatar;
          }

        case ProfilePhotoActionType.DELETE:
          await cloudStorage.detete();
          break;
        default:
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
    this.setTempAvatar(this.avatar);
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
          const data = authUser.data() as Profile;
          if (!data) {
            return;
          }
          this.setProfileData(data);
          this.setProfileForm(data);
          this.setAvatar(data.photo);
          this.setCurrentCategory(data.category.currentCategory);
        });
        favoriteStore.setFavorites();
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
        const photoUrl = await this.profilePhotoAction(
          ProfilePhotoActionType.UPLOAD,
        );

        await firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .update({
            ...this.profileForm,
            photo: photoUrl ?? null,
          });

        await this.fetchProfile();

        navigation.replace(AppRouteNames.TAB_ROUTE);
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
      const userId = this.profileData?.id;

      if (!userId) {
        return;
      }

      this.setAvatar('');

      await firestore().collection(Collections.USERS).doc(userId).update({
        photo: null,
      });
      await this.profilePhotoAction(ProfilePhotoActionType.DELETE);

      await this.fetchProfile();
    } catch (e) {
      console.log(e);
    }
  };
}

export default new ProfileStore();
