import {makeAutoObservable} from 'mobx';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {CategoryType} from '../types/categoryTypes';

class CategoryStore {
  category: CategoryType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchCategory = (id: string) => {
    const currentCategory = this.getCategory(id);

    if (currentCategory) {
      this.category = currentCategory;
    }
  };

  getCategory = (id: string) => {
    return categoriesStore.categories.find(category => {
      return category.id === id;
    });
  };
}

export default new CategoryStore();
