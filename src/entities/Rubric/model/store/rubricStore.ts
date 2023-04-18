import {makeAutoObservable} from 'mobx';

import {categoriesStore} from '@src/pages/CategoriesPage';

class RubricStore {
  constructor() {
    makeAutoObservable(this);
  }

  getRubric = (id: string) => {
    const currentRubric =
      categoriesStore.rubrics.find(rubric => {
        return rubric.id === id;
      }) || null;

    return currentRubric;
  };
}

export default new RubricStore();
