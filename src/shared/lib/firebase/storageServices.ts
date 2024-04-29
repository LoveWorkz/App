import storage from '@react-native-firebase/storage';

interface FirebaseStorageError extends Error {
  code: string;
  message: string;
  name: string;
}

export class StorageServices {
  storageRef = storage().ref();

  constructor({folderName, fileName}: {folderName: string; fileName: string}) {
    const ref = storage().ref();
    this.storageRef = ref.child(folderName).child(fileName);
  }

  async fileExists(): Promise<boolean> {
    try {
      // Attempt to get the download URL, which only succeeds if the file exists
      await this.storageRef.getDownloadURL();
      return true;
    } catch (error) {
      const storageError = error as FirebaseStorageError;

      if (storageError.code === 'storage/object-not-found') {
        return false;
      }
      throw error;
    }
  }

  async upload(file: string) {
    try {
      const response = await this.storageRef.putFile(file);
      console.log('File uploaded successfully:', response);
      return response;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async download() {
    try {
      const url = await this.storageRef.getDownloadURL();
      console.log('Download URL:', url);
      return url;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  async delete() {
    try {
      const exists = await this.fileExists();
      if (!exists) {
        console.log('No file exists at the specified reference.');
        return;
      }

      await this.storageRef.delete();
      console.log('File deleted successfully.');
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}
