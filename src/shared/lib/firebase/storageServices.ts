import storage from '@react-native-firebase/storage';

export class StorageServices {
  storageRef = storage().ref();

  constructor({folderName, fileName}: {folderName: string; fileName: string}) {
    const ref = storage().ref();
    this.storageRef = ref.child(folderName).child(fileName);
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
