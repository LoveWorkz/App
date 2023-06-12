import {makeAutoObservable} from 'mobx';
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
import {shareQuestionDomainUri} from '@src/app/config/shareConfig';
import {appPackageName} from '@src/app/config/appConfig';
import {DocumentType} from '@src/shared/types/types';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {StorageServices} from '@src/shared/lib/firebase/storageServices';
import {CloudStoragePaths} from '@src/shared/types/firebase';

class shareStore {
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

      const link = await this.buildLink();
      if (!link) {
        return;
      }

      const options = {
        message: link,
      };

      this.share(options);
    } catch (e) {
      errorHandler({error: e});
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

      if (!(categoryId && questionId)) {
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
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getQuestionCardUrl = async (questionCardScreenshot: string) => {
    try {
      const userId = userStore.authUserId;
      const cloudStorage = new StorageServices({
        folderName: CloudStoragePaths.QUESTIONS_SCREENSHOTS,
        fileName: userId,
      });
      // add file to storage for getting url
      await cloudStorage.upload(questionCardScreenshot);
      const url = await cloudStorage.download();

      return url;
    } catch (e) {
      errorHandler({error: e});
    }
  };

  buildLink = async () => {
    try {
      crashlytics().log('Building deep link for question page.');

      const question = questionStore.question;
      const questionCardScreenshot = questionStore.questionCardScreenshot;
      const category = categoryStore.category;
      if (!(question && category && questionCardScreenshot)) {
        return;
      }

      const imageUrl = await this.getQuestionCardUrl(questionCardScreenshot);

      const link = await dynamicLinks().buildShortLink({
        link: `https://www.google.com?questionId=${question.id}&categoryId=${category.id}`,
        domainUriPrefix: shareQuestionDomainUri,
        android: {
          packageName: appPackageName,
        },
        navigation: {
          forcedRedirectEnabled: true,
        },
        social: {
          title: 'love is not Enough',
          imageUrl,
        },
      });

      return link;
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new shareStore();
