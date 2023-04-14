import {makeAutoObservable} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {CategoryType} from '@src/entities/Category';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {Collections} from '@src/shared/types/firebase';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';

class CategoryDetailsStore {
  category: CategoryType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchCategory = (id: string) => {
    const currentCategory = categoriesStore.categories.find(category => {
      return category.id === id;
    });
    if (currentCategory) {
      this.category = currentCategory;
    }
  };

  hideCategoryDetails = async (id: string) => {
    try {
      await firestore().collection(Collections.CATEGORIES).doc(id).update({
        isCategoryDetailsVisible: false,
      });
      navigation.navigate(TabRoutesNames.BOOKS);
    } catch (e) {
      console.log(e);
    }
  };
}

export default new CategoryDetailsStore();
