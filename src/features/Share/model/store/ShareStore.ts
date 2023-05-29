import {makeAutoObservable} from 'mobx';
import Share, {ShareOptions} from 'react-native-share';
import Toast from 'react-native-toast-message';
import {t} from 'i18next';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import queryString from 'query-string';

import {userStore} from '@src/entities/User';
import {ToastType} from '@src/shared/ui/Toast/Toast';
import {questionStore} from '@src/entities/QuestionCard';
import {categoryStore} from '@src/entities/Category';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {shareQuestionDomainUri} from '@src/app/config/shareConfig';
import {appPackageName} from '@src/app/config/appConfig';
import {DocumentType} from '@src/shared/types/types';

class shareStore {
  constructor() {
    makeAutoObservable(this);
  }

  share = async (options: ShareOptions) => {
    try {
      const isOffline = await userStore.getIsUserOffline();

      if (isOffline) {
        Toast.show({
          type: ToastType.WARNING,
          text1: t('you_are_offline') || '',
        });
        return;
      }

      await Share.open(options);
    } catch (err) {
      console.log(err);
    }
  };

  shareQuestion = async () => {
    try {
      const link = await this.buildLink();
      if (!link) {
        return;
      }

      const options = {
        message: link,
      };

      this.share(options);
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }
  };

  buildLink = async () => {
    try {
      const question = questionStore.question;
      const category = categoryStore.category;
      if (!(question && category)) {
        return;
      }

      const link = await dynamicLinks().buildShortLink({
        link: `https://www.google.com?questionId=${question.id}&categoryId=${category.id}`,
        domainUriPrefix: shareQuestionDomainUri,
        android: {
          packageName: appPackageName,
        },
        navigation: {
          forcedRedirectEnabled: true,
        },
      });

      return link;
    } catch (e) {
      console.log(e);
    }
  };
}

export default new shareStore();
