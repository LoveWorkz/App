import {makeAutoObservable} from 'mobx';
import Toast from 'react-native-toast-message';
import {t} from 'i18next';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {userStore} from '@src/entities/User';
import {ToastType} from '@src/shared/ui/Toast/Toast';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {UploadPhotoType} from '../types/uploadPhoto';

class UploadPhotoStore {
  constructor() {
    makeAutoObservable(this);
  }

  uploadPhoto = async (
    type: UploadPhotoType,
  ): Promise<ImagePickerResponse | undefined> => {
    try {
      crashlytics().log('Uploading profile photo.');

      const isOffline = await userStore.getIsUserOffline();
      if (isOffline) {
        Toast.show({
          type: ToastType.WARNING,
          text1: t('you_are_offline') || '',
        });
        return;
      }

      const options: CameraOptions | ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: true,
        cameraType: 'front',
        saveToPhotos: true,
        quality: 1,
      };

      let result: ImagePickerResponse;

      if (type === UploadPhotoType.CAMERA) {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }

      return result;
    } catch (e) {
      errorHandler({error: e});
      return;
    }
  };
}

export default new UploadPhotoStore();
