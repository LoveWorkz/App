import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {CloudStoragePaths, Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {StorageServices} from '@src/shared/lib/firebase/storageServices';
import {favoriteStore} from '@src/entities/Favorite';
import {challengesStore} from '@src/pages/ChallengesPage';
import {CurrentCategory} from '@src/entities/Category';
import {quotesStore} from '@src/widgets/Quotes';
import {wowThatWasFastModalStore} from '@src/widgets/WowThatWasFastModal';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {
  Profile,
  ProfileErrorInfo,
  ProfilePhotoActionType,
} from '../types/profileSchema';
import {validateFields} from '../services/validation/validateFields';

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
  currentCategory: CurrentCategory | null = null;

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

  setPreferences(preference: string) {
    const preferences = this.profileForm.preferences || [];
    if (preferences.includes(preference)) {
      this.profileForm.preferences = preferences.filter(
        item => item !== preference,
      );
    } else {
      this.profileForm.preferences = [...preferences, preference];
    }
  }

  clearPreferences() {
    if (!this.profileData) {
      return;
    }

    this.profileForm.preferences = this.profileData.preferences;
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

  setCurrentCategory(category: CurrentCategory) {
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
          crashlytics().log('Uploading profile photo to firebase.');

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
      errorHandler({error: e});
    }
  };

  resetForm() {
    this.setName('');
    this.setAge('');
    this.setCountry('');
    this.setRelationshipStatus('');
    this.clearPreferences();
    this.setTempAvatar(this.avatar);
    this.clearErrors();
  }

  fetchProfile = async () => {
    try {
      crashlytics().log('Fetching user profile.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();
      const userId = userStore.authUser?.id;
      if (userId) {
        const authUser = await firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .get({source});

        runInAction(() => {
          const data = authUser.data() as Profile;
          if (!data) {
            return;
          }

          this.setProfileData(data);
          this.setProfileForm(data);
          this.setAvatar(data.photo);
          this.setCurrentCategory(data.category);
          challengesStore.setChallengeCategory(data.challengeCategory);
          favoriteStore.setFavorites(data.favorites);
          quotesStore.setIsQuoteInfo(data.quote);
          wowThatWasFastModalStore.setIsThatWasFastModalForbidden(
            data.isWowThatWasFastModalForbidden,
          );
        });
      }
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.initialFetching = false;
      });
    }
  };

  updateProfile = async ({isSetUp}: {isSetUp: boolean}) => {
    try {
      crashlytics().log('User tried to update profile.');

      const isOffline = await userStore.getIsUserOffline();
      this.clearErrors();

      const {isError, errorInfo} = validateFields(this.profileForm);

      if (isError) {
        this.setValidationError(errorInfo);
        return;
      }

      runInAction(() => {
        this.isLoading = true;
      });

      const userId = userStore.authUser?.id;
      if (!userId) {
        return;
      }

      // deleting await if user is offline
      if (isOffline) {
        firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .update({
            ...this.profileForm,
          });
      } else {
        const uploadedPhotoUrl = await this.profilePhotoAction(
          ProfilePhotoActionType.UPLOAD,
        );

        // if the user is trying to set the profile for the first time, chose the account photo (google, apple)
        const photoUrl = isSetUp ? this.avatar : uploadedPhotoUrl;

        await firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .update({
            ...this.profileForm,
            photo: photoUrl ?? '',
          });
      }

      await this.fetchProfile();
      navigation.replace(AppRouteNames.TAB_ROUTE);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  deletePhoto = async () => {
    try {
      crashlytics().log('User tried to delete profile photo.');

      const isOffline = await userStore.checkIfUserOfflineAndShowMessage();
      if (isOffline) {
        return;
      }

      const userId = this.profileData?.id;
      if (!userId) {
        return;
      }

      this.setAvatar('');

      await userStore.updateUser({
        field: 'photo',
        data: null,
      });
      await this.profilePhotoAction(ProfilePhotoActionType.DELETE);

      await this.fetchProfile();
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new ProfileStore();
