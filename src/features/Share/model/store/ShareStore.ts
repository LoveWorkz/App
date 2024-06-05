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
import {challengeStore} from '@src/entities/Challenge';
import {challengeGroupStore} from '@src/entities/ChallengeGroup';

const getOptions = (link: string) => ({
  url: link,
  failOnCancel: false,
});

class shareStore {
  isUploadingImageToStorage: boolean = false;

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
        this.isUploadingImageToStorage = true;
      });

      const questionCardScreenshot = questionStore.questionCardScreenshot;
      const imageUrl = await this.uploadImageToFirebase({
        screenshot: questionCardScreenshot,
        folderName: CloudStoragePaths.QUESTIONS_SCREENSHOTS,
      });
      const link = await this.createDynamicLink({
        imageUrl,
        type: 'question',
        title: 'Question Card',
      });

      // added some delay because we need to close the spinner modal first and then open the share modal
      setTimeout(() => {
        this.share(getOptions(link));
      }, 100);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isUploadingImageToStorage = false;
      });
    }
  };

  shareCoreChallenge = async () => {
    try {
      crashlytics().log('Sharing core challenge page link.');

      const isOffline = await userStore.checkIfUserOfflineAndShowMessage();
      if (isOffline) {
        return;
      }

      runInAction(() => {
        this.isUploadingImageToStorage = true;
      });

      const coreChallengeCardScreenshot =
        challengeStore.coreChallengeCardScreenshot;
      const imageUrl = await this.uploadImageToFirebase({
        screenshot: coreChallengeCardScreenshot,
        folderName: CloudStoragePaths.CORE_CHALLENGES_SCREENSHOTS,
      });
      const link = await this.createDynamicLink({
        imageUrl,
        type: 'coreChallenge',
        title: 'Core Challenge Card',
      });

      // added some delay because we need to close the spinner modal first and then open the share modal
      setTimeout(() => {
        this.share(getOptions(link));
      }, 100);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isUploadingImageToStorage = false;
      });
    }
  };

  shareSpecialChallenge = async () => {
    try {
      crashlytics().log('Sharing special challenge page link.');

      const isOffline = await userStore.checkIfUserOfflineAndShowMessage();
      if (isOffline) {
        return;
      }

      runInAction(() => {
        this.isUploadingImageToStorage = true;
      });

      const specialChallengeCardScreenshot =
        challengeStore.specialChallengeCardScreenshot;
      const imageUrl = await this.uploadImageToFirebase({
        screenshot: specialChallengeCardScreenshot,
        folderName: CloudStoragePaths.SPECIAL_CHALLENGES_SCREENSHOTS,
      });
      const link = await this.createDynamicLink({
        imageUrl,
        type: 'specialChallenge',
        title: 'Special Challenge Card',
      });

      // added some delay because we need to close the spinner modal first and then open the share modal
      setTimeout(() => {
        this.share(getOptions(link));
      }, 100);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isUploadingImageToStorage = false;
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

  shareCoreChallengeHandler = async () => {
    try {
      const link = await dynamicLinks().getInitialLink();
      const linkUrl = link?.url;
      if (!linkUrl) {
        return;
      }

      const splitedUrl = linkUrl.split('?');
      const params = queryString.parse(splitedUrl[1]);

      const coreChallengeId = params.coreChallengeId as string;
      const coreChallengeGroupId = params.coreChallengeGroupId as string;

      if (!(coreChallengeId && coreChallengeGroupId)) {
        return;
      }

      await challengeGroupStore.fetchChallengeGroupById({
        groupId: coreChallengeGroupId,
        isCore: true,
      });
      await challengeStore.fetchChallengeById({
        challengeId: coreChallengeId,
        isCore: true,
      });

      navigation.navigate(AppRouteNames.CORE_CHALLENGE_INTRO, {
        title: 'Challenges',
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  shareSpecialChallengeHandler = async () => {
    try {
      const link = await dynamicLinks().getInitialLink();
      const linkUrl = link?.url;
      if (!linkUrl) {
        return;
      }

      const splitedUrl = linkUrl.split('?');
      const params = queryString.parse(splitedUrl[1]);

      const specialChallengeId = params.specialChallengeId as string;
      const specialChallengeGroupId = params.specialChallengeGroupId as string;

      if (!(specialChallengeId && specialChallengeGroupId)) {
        return;
      }

      await challengeGroupStore.fetchChallengeGroupById({
        groupId: specialChallengeGroupId,
        isCore: false,
      });
      await challengeStore.fetchChallengeById({
        challengeId: specialChallengeId,
        isCore: false,
      });

      navigation.navigate(AppRouteNames.SPECIAL_CHALLENGE_INTRO);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  uploadImageToFirebase = async ({
    screenshot,
    folderName,
  }: {
    screenshot: string;
    folderName: CloudStoragePaths;
  }) => {
    const userId = userStore.userId;
    const cloudStorage = new StorageServices({
      folderName,
      fileName: userId,
    });

    await cloudStorage.upload(screenshot);
    const url = await cloudStorage.download();

    return url;
  };

  createDynamicLink = async ({
    imageUrl,
    type,
    title,
  }: {
    imageUrl: string;
    type: 'question' | 'coreChallenge' | 'specialChallenge';
    title: string;
  }) => {
    crashlytics().log('Building deep link.');

    let link = '';

    switch (type) {
      case 'question':
        const question = questionStore.question;
        const category = categoryStore.category;
        const session = sessionStore.session;

        if (question && category && session) {
          console.log(question.id, session.id);
          link = `https://www.google.com?questionId=${question.id}&categoryId=${category.id}&sessionId=${session.id}`;
        }
        break;
      case 'coreChallenge':
        const coreChallenge = challengeStore.coreChallenge;
        const currentCoreChallengeGroup =
          challengeGroupStore.currentCoreChallengeGroup;
        if (coreChallenge && currentCoreChallengeGroup) {
          console.log(coreChallenge.id, currentCoreChallengeGroup.id);
          link = `https://www.google.com?coreChallengeId=${coreChallenge.id}&coreChallengeGroupId=${currentCoreChallengeGroup.id}`;
        }
        break;
      case 'specialChallenge':
        const specialChallenge = challengeStore.specialChallenge;
        const currentSpecialChallengeGroup =
          challengeGroupStore.currentSpecialChallengeGroup;
        if (specialChallenge && currentSpecialChallengeGroup) {
          console.log(specialChallenge.id, currentSpecialChallengeGroup.id);
          link = `https://www.google.com?specialChallengeId=${specialChallenge.id}&specialChallengeGroupId=${currentSpecialChallengeGroup.id}`;
        }
        break;
    }

    const dynamicLink = await dynamicLinks().buildShortLink({
      link,
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
        title,
        imageUrl,
      },
    });

    return dynamicLink;
  };
}

export default new shareStore();
