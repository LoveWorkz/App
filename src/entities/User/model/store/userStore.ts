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
  HAS_COMPLETED_ONBOARDING_KEY,
  RATE_TYPE_KEY,
  THEME_STORAGE_KEY,
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
import {ToastType} from '@src/shared/ui/Toast/Toast';
import {challengesStore} from '@src/pages/ChallengesPage';
import {quotesStore} from '@src/widgets/Quotes';
import {wowThatWasFastModalStore} from '@src/widgets/WowThatWasFastModal';
import {CurrentCategory} from '@src/entities/Category';
import { onboardingStorage } from '@src/shared/lib/storage/adapters/onboardingAdapter';
import {
  User,
  AuthMethod,
  AuthUserInfo,
  Notification,
} from '../types/userSchema';

class UserStore {
  user: null | User = null;
  userId: string = '';
  authMethod: AuthMethod | string = '';
  isDialogOpen: boolean = false;
  isFirstUserVisit: boolean = true;
  isAccountDeleted: boolean = false;
  currentCategory: CurrentCategory | null = null;
  hasUserSubscription: boolean = false;
  inited: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setFirstUserVisit = () => {
    this.updateUser({
      field: 'isFirstUserVisit',
      data: false,
    });
  };

  setCurrentCategory = (category: CurrentCategory) => {
    this.currentCategory = category;
  };

  setInited = (inited: boolean) => {
    if (!this.inited) {
      this.inited = inited;
    }
  };

  setNotification = async ({
    field,
    value,
  }: {
    field: keyof Notification;
    value: string | Date;
  }) => {
    if (this.user) {
      await this.updateUser({
        field: `notification.${field}`,
        data: value,
      });

      this.user.notification = {
        ...this.user.notification,
        [field]: value,
      };
    }
  };

  setHasUserSubscription = (hasUserSubscription: boolean) => {
    this.hasUserSubscription = hasUserSubscription;
  };

  toggleDialog = (isOpen: boolean) => {
    this.isDialogOpen = isOpen;
  };

  setIsFirstUserVisit = async (isFirstUserVisit: boolean) => {
    this.isFirstUserVisit = isFirstUserVisit;
  };

  getUserHasSubscription = () => {
    return this.hasUserSubscription;
  };

  initAuthUser = async () => {
    try {
      crashlytics().log('Initializing user.');

      const isOffline = await this.getIsUserOffline();
      if (!isOffline) {
        await auth().currentUser?.reload();
      }

      await this.checkAndSetUserVisitStatus({isSplash: true});

      const hasCompletedOnboarding = await this.checkOnboardingStatus();
      if(!hasCompletedOnboarding) {
        return navigation.replace(AppRouteNames.WELCOME);
      }

      const user = auth().currentUser;
      if (!user) {
        return navigation.replace(AppRouteNames.AUTH);
      }

      const authMethod = await authStorage.getAuthData(AUTH_METHOD_STORAGE_KEY);

      this.setAuthUserInfo({
        userId: user.uid,
        authMethod: authMethod || '',
      });

      navigation.replace(AppRouteNames.TAB_ROUTE);
    } catch (e: unknown) {
      this.errorHandler(e);
    }
  };

  checkOnboardingStatus = async () => {
    const valueFromStorage = await onboardingStorage.getOnboardingData(HAS_COMPLETED_ONBOARDING_KEY);
    if(!valueFromStorage) {
      return false;
    }
    
    if(JSON.parse(valueFromStorage)) {
      return true;
    }

    return false;
  }

  fetchUser = async () => {
    try {
      crashlytics().log('Fetching current user.');

      const source = await this.checkIsUserOfflineAndReturnSource();
      const userId = this.userId;

      if (userId) {
        const data = await firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .get({source});

        runInAction(() => {
          const user = data.data() as User;
          if (!data) {
            return;
          }

          this.user = user;

          this.setCurrentCategory(user.category);
          challengesStore.setChallengeCategory(user.challengeCategory);
          quotesStore.setIsQuoteInfo(user.quote);
          wowThatWasFastModalStore.setIsThatWasFastModalForbidden(
            user.isWowThatWasFastModalForbidden,
          );
        });
      }
    } catch (e) {
      errorHandler({error: e});
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

  setAuthUserInfo({userId, authMethod}: AuthUserInfo) {
    try {
      runInAction(() => {
        this.userId = userId;
        this.authMethod = authMethod;
      });

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
          await GoogleSignin.signIn();
          const tokens = await GoogleSignin.getTokens();

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

      await this.setDocuments(userId);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setDocuments = async (userId: string) => {
    try {
      const document1 = userCategoryStore.setUserCategory(userId);
      const document2 = userRubricStore.setUserRubric(userId);
      const document3 =
        userChallengeCategoryStore.setUserChallengeCategories(userId);

      await Promise.all([document1, document2, document3]);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  clearUserInfo = async () => {
    try {
      crashlytics().log('clearing user information.');

      this.setAuthUserInfo({
        userId: '',
        authMethod: '',
      });
      profileStore.clearProfileData();

      await authStorage.removeAuthData(AUTH_METHOD_STORAGE_KEY);
      await authStorage.removeAuthData(USER_VISITED_STATUS);
      await themeStorage.removeTheme(THEME_STORAGE_KEY);
      await themeStorage.removeTheme(RATE_TYPE_KEY);
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
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateUser = async ({data, field}: {data: any; field: string}) => {
    try {
      crashlytics().log('Updating user data.');

      const isOffline = await this.getIsUserOffline();
      const userId = this.userId;
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
