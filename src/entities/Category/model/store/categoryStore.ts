import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {Collections} from '@src/shared/types/firebase';
import {CategoryType} from '../types/categoryTypes';

class CategoryStore {
  category: CategoryType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchCategory = async (id: string) => {
    try {
      const data = await firestore()
        .collection(Collections.CATEGORIES)
        .doc(id)
        .get();

      const category = {...data.data(), id: data.id} as CategoryType;

      runInAction(() => {
        this.category = category;
      });
      return category;
    } catch (e) {
      console.log(e);
    }
  };

  updateCategory = async ({
    id,
    field,
    data,
  }: {
    id: string;
    field: string;
    data: number | string | boolean;
  }) => {
    try {
      await firestore()
        .collection(Collections.CATEGORIES)
        .doc(id)
        .update({
          [field]: data,
        });
    } catch (e) {
      console.log(e);
    }
  };

  getCategory = (id: string) => {
    try {
      return categoriesStore.categories.find(category => {
        return category.id === id;
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export default new CategoryStore();
