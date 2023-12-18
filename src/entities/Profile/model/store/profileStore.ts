import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {CloudStoragePaths, Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {StorageServices} from '@src/shared/lib/firebase/storageServices';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {PartnerType} from '@src/entities/Partner';
import {
  Profile,
  ProfileErrorInfo,
  ProfilePhotoActionType,
} from '../types/profileSchema';
import {validateFields} from '../services/validation/validateFields';

const errorInitData: ProfileErrorInfo = {
  countryError: '',
  nameError: '',
  preferenceError: '',
  emailError: '',
  genderError: '',
};

class ProfileStore {
  profileData = null as Profile | null;
  profileForm = {} as Profile;
  errorInfo = errorInitData;
  avatar: string = '';
  tempAvatar: string = '';
  partner: PartnerType | null = null;

  isLoading: boolean = false;
  isFetchingProfile: boolean = true;
  isDeletingPhoto: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setName(name: string) {
    this.profileForm.name = name;
  }

  setGender(gender: string) {
    this.profileForm.gender = gender;
  }

  setEmail(email: string) {
    this.profileForm.email = email;
  }

  setCountry(country: string) {
    this.profileForm.country = country;
  }

  setPartner(partner: PartnerType) {
    this.partner = partner;
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

  setTempAvatar(avatar: string) {
    this.tempAvatar = avatar;
  }

  clearProfileData() {
    this.setProfileData(null);
    this.setProfileForm({} as Profile);
    this.setAvatar('');
  }

  clearErrors() {
    this.setValidationError(errorInitData);
  }

  profilePhotoAction = async (type: ProfilePhotoActionType) => {
    try {
      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      const cloudStorage = new StorageServices({
        folderName: CloudStoragePaths.AVATARS,
        fileName: userId,
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
          try {
            await cloudStorage.detete();
          } catch (e) {
            errorHandler({error: e, withCrashlytics: false, withToast: false});
          }

          break;
        default:
          break;
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  resetForm() {
    if (!this.profileData) {
      return;
    }

    this.setProfileForm(this.profileData);

    this.setTempAvatar(this.avatar);
    this.clearErrors();
  }

  fetchProfile = async () => {
    try {
      crashlytics().log('Fetching user profile.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();
      const userId = userStore.userId;

      runInAction(() => {
        this.isFetchingProfile = true;
      });

      if (userId) {
        const data = await firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .get({source});

        runInAction(() => {
          const user = data.data() as Profile;
          if (!user) {
            return;
          }

          this.setProfileData(user);
          this.setProfileForm(user);
          this.setAvatar(user.photo);
          this.setPartner(user.partner);
        });
      }
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isFetchingProfile = false;
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

      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      const profileForm = this.profileForm;

      const newProfileData = {
        name: profileForm.name,
        country: profileForm.country,
        preferences: profileForm.preferences,
        gender: profileForm.gender,
        email: profileForm.email,
      };

      // deleting await if user is offline
      if (isOffline) {
        firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .update({
            ...newProfileData,
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
            ...newProfileData,
            photo: photoUrl ?? '',
          });
      }

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

      runInAction(() => {
        this.isDeletingPhoto = true;
      });

      if (!this.tempAvatar) {
        return;
      }

      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      await userStore.updateUser({
        field: 'photo',
        data: '',
      });
      await this.profilePhotoAction(ProfilePhotoActionType.DELETE);
      await userStore.fetchUser();

      this.setAvatar('');
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isDeletingPhoto = false;
      });
    }
  };
}

export default new ProfileStore();
