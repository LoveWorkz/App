import {makeAutoObservable} from 'mobx';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {UploadPhotoType} from '../types/uploadPhoto';

class UploadPhotoStore {
  constructor() {
    makeAutoObservable(this);
  }

  uploadPhoto = async (
    type: UploadPhotoType,
  ): Promise<ImagePickerResponse | undefined> => {
    try {
      const options: CameraOptions | ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: true,
        cameraType: 'front',
      };

      let result: ImagePickerResponse;

      if (type === UploadPhotoType.CAMERA) {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }

      return result;
    } catch (e) {
      console.log(e, '????');
      return;
    }
  };
}

export default new UploadPhotoStore();
