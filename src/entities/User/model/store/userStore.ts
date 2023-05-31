import {makeAutoObservable, runInAction} from 'mobx';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import appleAuth from '@invertase/react-native-apple-authentication';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {t} from 'i18next';
import crashlytics from '@react-native-firebase/crashlytics';

import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {
  AUTH_METHOD_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
  THEME_STORAGE_KEY,
  USER_LANGUAGE_STORAGE_KEY,
  USER_VISITED_STATUS,
} from '@src/shared/consts/storage';
import {profileStore} from '@src/entities/Profile';
import {Collections, FirebaseErrorCodes} from '@src/shared/types/firebase';
import {ProfilePhotoActionType} from '@src/entities/Profile/model/types/profileSchema';
import {userRubricStore} from '@src/entities/UserRubric';
import {userCategoryStore} from '@src/entities/UserCategory';
import {userChallengeCategoryStore} from '@src/entities/UserChallengeCategory';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {themeStorage} from '@src/shared/lib/storage/adapters/themeAdapter';
import {lngStorage} from '@src/shared/lib/storage/adapters/lngAdapter';
import {ToastType} from '@src/shared/ui/Toast/Toast';
import {
  User,
  InitlUserInfo,
  AuthMethod,
  AuthUserInfo,
} from '../types/userSchema';
import {userFormatter} from '../../lib/userForamtter';

class UserStore {
  authUser: null | User = null;
  authUserId: string = '';
  authMethod: AuthMethod | string = '';
  isDialogOpen: boolean = false;
  isFirstUserVisit: boolean = true;
  isAccountDeleted: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setFirstUserVisit = () => {
    this.updateUser({
      field: 'isFirstUserVisit',
      data: false,
    });
  };

  toggleDialog = (isOpen: boolean) => {
    this.isDialogOpen = isOpen;
  };

  setIsFirstUserVisit = async (isFirstUserVisit: boolean) => {
    this.isFirstUserVisit = isFirstUserVisit;
  };

  initAuthUser = async () => {
    try {
      crashlytics().log('Initializing user.');

      const isOffline = await this.getIsUserOffline();
      if (!isOffline) {
        await auth().currentUser?.reload();
      }

      await this.checkAndSetUserVisitStatus({isSplash: true});

      const user = auth().currentUser;
      if (!user) {
        return navigation.replace(AppRouteNames.AUTH);
      }

      const formattedUser = userFormatter(user as InitlUserInfo);
      const authMethod = await authStorage.getAuthData(AUTH_METHOD_STORAGE_KEY);

      this.setAuthUserInfo({
        user: formattedUser,
        authMethod: authMethod || '',
      });

      navigation.navigate(AppRouteNames.TAB_ROUTE);
    } catch (e: unknown) {
      this.errorHandler(e);
    }
  };

  checkAndSetUserVisitStatus = async ({
    isSignUp,
    isSplash,
  }: {
    isSplash?: boolean;
    isSignUp?: boolean;
  }) => {
    try {
      crashlytics().log('Setting user visite status.');

      if (isSplash) {
        const isUserVisitFirstTime = await authStorage.getAuthData(
          USER_VISITED_STATUS,
        );

        // return if user never visited the project
        if (!isUserVisitFirstTime) {
          return;
        }

        const value = JSON.stringify(isUserVisitFirstTime);
        if (value) {
          // user second visit
          await authStorage.setAuthData(
            USER_VISITED_STATUS,
            JSON.stringify(false),
          );

          this.setIsFirstUserVisit(false);
        } else {
          this.setIsFirstUserVisit(false);
        }

        return;
      }

      if (isSignUp) {
        await authStorage.setAuthData(
          USER_VISITED_STATUS,
          JSON.stringify(true),
        );
        this.setIsFirstUserVisit(true);
      } else {
        await authStorage.setAuthData(
          USER_VISITED_STATUS,
          JSON.stringify(false),
        );
        this.setIsFirstUserVisit(false);
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setAuthUserInfo({user, authMethod}: AuthUserInfo) {
    try {
      this.authUser = user;
      if (user?.id) {
        this.authUserId = user.id;
      }
      this.authMethod = authMethod;

      authStorage.setAuthData(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
      authStorage.setAuthData(AUTH_METHOD_STORAGE_KEY, authMethod);
    } catch (e) {
      errorHandler({error: e});
    }
  }

  getIsUserOffline = async () => {
    try {
      crashlytics().log('Checking user offline status.');

      const network = await NetInfo.fetch();
      return !network.isConnected;
    } catch (e: unknown) {
      errorHandler({error: e});
    }
  };

  checkIfUserOfflineAndShowMessage = async () => {
    try {
      const isOffline = await this.getIsUserOffline();

      if (isOffline) {
        Toast.show({
          type: ToastType.WARNING,
          text1: t('you_are_offline') || '',
        });
      }
      return isOffline;
    } catch (e: unknown) {
      errorHandler({error: e});

      return false;
    }
  };

  checkIsUserOfflineAndReturnSource = async (): Promise<'cache' | 'server'> => {
    try {
      const isOffline = await this.getIsUserOffline();
      const source = isOffline ? 'cache' : 'server';
      return source;
    } catch (e: unknown) {
      errorHandler({error: e});

      return 'server';
    }
  };

  errorHandler = async (e: unknown) => {
    if (!(e instanceof Error)) {
      return;
    }

    const isUserNotFound = e.message.includes(
      FirebaseErrorCodes.AUTH_USER_NOT_FOUND,
    );
    const isUserDisabled = e.message.includes(
      FirebaseErrorCodes.AUTH_USER_DISABLED,
    );

    // this works when the account has been deleted
    if (isUserNotFound) {
      await this.clearUserInfo();
      navigation.navigate(AppRouteNames.AUTH);

      runInAction(() => {
        this.isAccountDeleted = true;
      });
      this.toggleDialog(true);
    } else if (isUserDisabled) {
      await this.clearUserInfo();
      navigation.navigate(AppRouteNames.AUTH);
      this.toggleDialog(true);
    } else {
      errorHandler({error: e});
    }
  };

  reauthenticateWithCredential = async ({
    email,
    password,
    erorHandler,
  }: {
    email?: string;
    password?: string;
    erorHandler?: (e: unknown) => void;
  }) => {
    try {
      crashlytics().log('Reauthenticating user credentials.');

      let credential;

      switch (this.authMethod) {
        case AuthMethod.AUTH_BY_EMAIL:
          if (email && password) {
            credential = auth.EmailAuthProvider.credential(email, password);
          }
          break;
        case AuthMethod.AUTH_BY_GOOGLE:
          // using sign in and sign out for refresh id token
          // without it reauthenticateWithCredential not working
          await GoogleSignin.signInSilently();
          const tokens = await GoogleSignin.getTokens();
          await GoogleSignin.signOut();

          credential = auth.GoogleAuthProvider.credential(tokens.idToken);
          break;
        default:
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          });
          const {identityToken, nonce} = appleAuthRequestResponse;
          credential = auth.AppleAuthProvider.credential(identityToken, nonce);
      }

      const currentUser = auth().currentUser;
      credential &&
        (await currentUser?.reauthenticateWithCredential(credential));
      return true;
    } catch (e) {
      erorHandler?.(e);
      return false;
    }
  };

  addUserToFirestore = async (user: User) => {
    try {
      crashlytics().log('Adding user info to firestore.');

      const userId = user.id;

      await firestore()
        .collection(Collections.USERS)
        .doc(userId)
        .set({
          ...user,
          isAuth: true,
        });

      await userRubricStore.setUserRubric(userId);
      await userCategoryStore.setUserCategory(userId);
      await userChallengeCategoryStore.setUserChallengeCategory(userId);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  clearUserInfo = async () => {
    try {
      crashlytics().log('clearing user information.');

      this.setAuthUserInfo({
        user: null,
        authMethod: '',
      });
      profileStore.clearProfileData();

      await authStorage.removeAuthData(AUTH_USER_STORAGE_KEY);
      await authStorage.removeAuthData(AUTH_METHOD_STORAGE_KEY);
      await themeStorage.removeTheme(THEME_STORAGE_KEY);
      await lngStorage.removeLanguage(USER_LANGUAGE_STORAGE_KEY);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  clearFirebaseUserInfo = async (id: string) => {
    try {
      crashlytics().log('Clearing user info from firestore.');

      await firestore().collection(Collections.USERS).doc(id).delete();

      await userRubricStore.deleteUserRubric(id);
      await userCategoryStore.deleteUserCategory(id);
      await userChallengeCategoryStore.deleteUserChallengeCategory(id);

      await profileStore.profilePhotoAction(ProfilePhotoActionType.DELETE);

      await authStorage.removeAuthData(USER_VISITED_STATUS);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateUser = async ({data, field}: {data: any; field: string}) => {
    try {
      crashlytics().log('Updating user data.');

      const isOffline = await this.getIsUserOffline();
      const userId = this.authUserId;
      if (!userId) {
        return;
      }

      if (isOffline) {
        firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .update({
            [field]: data,
          });
      } else {
        await firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .update({
            [field]: data,
          });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new UserStore();
