import {makeAutoObservable} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {Collections} from '@src/shared/types/firebase';
import {RubricType} from '../types/rubricTypes';

class RubricStore {
  rubric: null | RubricType = null;
  constructor() {
    makeAutoObservable(this);
  }

  getRubric = (id: string) => {
    try {
      const currentRubric =
        categoriesStore.rubrics.find(rubric => {
          return rubric.id === id;
        }) || null;

      return currentRubric;
    } catch (e) {
      console.log(e);
    }
  };

  fetchRubric = async (id: string) => {
    try {
      const data = await firestore()
        .collection(Collections.RUBRICS)
        .doc(id)
        .get();

      const rubric = {...data.data(), id: data.id} as RubricType;

      this.rubric = rubric;
      return rubric;
    } catch (e) {
      console.log(e);
    }
  };

  updateRubric = async ({
    id,
    field,
    data,
  }: {
    id: string;
    field: string;
    data: number | string;
  }) => {
    try {
      await firestore()
        .collection(Collections.RUBRICS)
        .doc(id)
        .update({
          [field]: data,
        });
    } catch (e) {
      console.log(e);
    }
  };
}

export default new RubricStore();
