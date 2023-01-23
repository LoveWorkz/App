import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const configureGoogleSignin = () => {
  GoogleSignin.configure({
    webClientId:
      '470642156929-4a86lh5s44dthrf439p3l1nrfrt2u56l.apps.googleusercontent.com',
    offlineAccess: true,
  });
};
