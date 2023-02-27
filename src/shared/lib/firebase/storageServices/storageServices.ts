import storage from '@react-native-firebase/storage';

export class StorageServices {
  storageRef = storage().ref();

  constructor({folderName, fileName}: {folderName: string; fileName: string}) {
    this.storageRef = storage().ref(`${folderName}/${fileName}`);
  }

  async upload(file: string) {
    await this.storageRef.putFile(file);
  }

  async download() {
    return await this.storageRef.getDownloadURL();
  }

  async detete() {
    await this.storageRef.delete();
  }
}
