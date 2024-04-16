import {makeAutoObservable} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {userCategoryStore} from '@src/entities/UserCategory';
import {DocumentType} from '@src/shared/types/types';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {categoryStore} from '@src/entities/Category';
import {inAppPurchaseStore} from '@src/features/InAppPurchase';

class CategoryDetailsStore {
  isCategoryDetailsPageLoading: boolean = true;
  isLockedPopupVisible: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  hideCategoryDetails = async ({id}: {id: string}) => {
    try {
      crashlytics().log(
        'User clicked the "Do not show again" button on category details page.',
      );

      await userCategoryStore.updateUserLevels([
        {
          levelId: id,
          updates: {
            isCategoryDetailsVisible: false,
          },
        },
      ]);

      categoryStore.getAndSetCategory({id});

      navigation.replace(AppRouteNames.SESSIONS, {
        type: DocumentType.CATEGORY,
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setIsLockedPopupVisible = (isVisible: boolean) => {
    this.isLockedPopupVisible = isVisible;
  };

  onStartPressHandler = async ({
    isContentLocked,
  }: {
    isContentLocked: boolean;
  }) => {
    try {
      const category = categoryStore.category;
      if (!category) {
        return;
      }

      if (isContentLocked) {
        inAppPurchaseStore.setIsInAppPurchaseModalVisible(true);
        return;
      }

      if (category?.isBlocked) {
        this.setIsLockedPopupVisible(true);
        return;
      }

      navigation.replace(AppRouteNames.SESSIONS, {
        type: DocumentType.CATEGORY,
        id: category.id,
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new CategoryDetailsStore();
