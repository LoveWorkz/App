import {makeAutoObservable, runInAction} from 'mobx';
import Share, {ShareOptions} from 'react-native-share';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import queryString from 'query-string';
import crashlytics from '@react-native-firebase/crashlytics';

import {userStore} from '@src/entities/User';
import {questionStore} from '@src/entities/QuestionCard';
import {categoryStore} from '@src/entities/Category';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {domainUriPrefix} from '@src/app/config/shareConfig';
import {appBundleId, appPackageName} from '@src/app/config/appConfig';
import {DocumentType} from '@src/shared/types/types';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {StorageServices} from '@src/shared/lib/firebase/storageServices';
import {CloudStoragePaths} from '@src/shared/types/firebase';
import {sessionStore} from '@src/entities/Session';

class shareStore {
  isUploadingQuestionImageToStorage: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  share = async (options: ShareOptions) => {
    try {
      crashlytics().log('Sharing app link.');

      const isOffline = await userStore.checkIfUserOfflineAndShowMessage();
      if (isOffline) {
        return;
      }

      await Share.open(options);
    } catch (e) {
      errorHandler({error: e, withCrashlytics: false, withToast: false});
    }
  };

  shareQuestion = async () => {
    try {
      crashlytics().log('Sharing question page link.');

      const isOffline = await userStore.checkIfUserOfflineAndShowMessage();
      if (isOffline) {
        return;
      }

      runInAction(() => {
        this.isUploadingQuestionImageToStorage = true;
      });

      const questionCardScreenshot = questionStore.questionCardScreenshot;
      const imageUrl = await this.uploadImageToFirebase(questionCardScreenshot);

      const link = await this.createDynamicLink(imageUrl);

      const options = {
        url: link,
      };

      // added some delay because we need to close the spinner modal first and then open the share modal
      setTimeout(() => {
        this.share(options);
      }, 100);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isUploadingQuestionImageToStorage = false;
      });
    }
  };

  shareQuestionHandler = async (language: LanguageValueType) => {
    try {
      const link = await dynamicLinks().getInitialLink();
      const linkUrl = link?.url;
      if (!linkUrl) {
        return;
      }

      const splitedUrl = linkUrl.split('?');
      const params = queryString.parse(splitedUrl[1]);

      const categoryId = params.categoryId as string;
      const questionId = params.questionId as string;
      const sessionId = params.sessionId as string;

      if (!(categoryId && questionId && sessionId)) {
        return;
      }

      const category = categoryStore.getCategory(categoryId);
      if (!category) {
        return;
      }

      const isCategoryBlocked = category.isBlocked;

      if (isCategoryBlocked) {
        navigation.navigate(AppRouteNames.CATEGORY_DETAILS, {
          title: category.displayName[language],
          id: categoryId,
        });
      } else {
        navigation.navigate(AppRouteNames.QUESTIONS, {
          type: DocumentType.CATEGORY,
          id: categoryId,
          initialQuestionId: questionId,
          sessionId: sessionId,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  uploadImageToFirebase = async (questionCardScreenshot: string) => {
    const userId = userStore.userId;
    const cloudStorage = new StorageServices({
      folderName: CloudStoragePaths.QUESTIONS_SCREENSHOTS,
      fileName: userId,
    });

    await cloudStorage.upload(questionCardScreenshot);
    const url = await cloudStorage.download();

    return url;
  };

  createDynamicLink = async (imageUrl: string) => {
    crashlytics().log('Building deep link for question page.');

    const question = questionStore.question;
    const category = categoryStore.category;
    const session = sessionStore.session;

    if (!(question && category && session)) {
      return;
    }

    const link = await dynamicLinks().buildShortLink({
      link: `https://www.google.com?questionId=${question.id}&categoryId=${category.id}&sessionId=${session.id}`,
      domainUriPrefix: domainUriPrefix,
      android: {
        packageName: appPackageName,
      },
      ios: {
        appStoreId: 'app store id',
        bundleId: appBundleId,
      },
      navigation: {
        forcedRedirectEnabled: false,
      },
      social: {
        title: 'Question Card',
        imageUrl,
      },
    });

    return link;
  };
}

export default new shareStore();
