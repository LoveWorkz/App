import {makeAutoObservable} from 'mobx';
import {trim} from 'lodash';

import {RubricFilterItemType} from '../types/rubricFilterItemTypes';

class RubricFilterItemStore {
  rubricFilterItems: RubricFilterItemType[] = [];
  selectedRubricKey: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setRubricFilterItems = (filterItems: RubricFilterItemType[]) => {
    this.rubricFilterItems = filterItems;
  };

  resetActiveRubricStatus = () => {
    this.rubricFilterItems = this.rubricFilterItems.map(rubric => {
      return {...rubric, active: false};
    });
  };

  toggleRubricStatus = ({key, status}: {key: string; status: boolean}) => {
    this.rubricFilterItems = this.rubricFilterItems.map(rubric => {
      if (rubric.name === key) {
        return {
          ...rubric,
          active: status,
        };
      }

      return rubric;
    });
  };

  turnOffFilterByKey = <T>({key, list}: {key: string; list: T[]}) => {
    this.toggleRubricStatus({key, status: false});
    this.selectedRubricKey = '';

    return list;
  };

  filterByKey = ({
    key,
    list,
    lang,
  }: {
    key: string;
    list: any[];
    lang: string;
  }) => {
    this.selectedRubricKey = key;
    this.toggleRubricStatus({key, status: true});

    return list.filter(item => {
      const rubrics = item.rubrics[lang] as string[];
      const trimmedRubrics = rubrics.map(rubric => trim(rubric));
      const filteredItems = trimmedRubrics.includes(trim(key));
      return filteredItems;
    });
  };

  startFilterLogic = <T extends {rubrics: string[]}>({
    key,
    list,
    lang,
  }: {
    key: string;
    list: T[];
    lang: string;
  }): T[] => {
    // when user presses already selected filter item
    if (this.selectedRubricKey === key) {
      return this.turnOffFilterByKey<T>({key, list});
    }
    // when user presses filter item but there is already selected another item
    if (this.selectedRubricKey) {
      this.resetActiveRubricStatus();
      return this.filterByKey({key, list, lang});
    }

    return this.filterByKey({key, list, lang});
  };

  clearFilteredInfo = () => {
    this.selectedRubricKey = '';
    this.resetActiveRubricStatus();
  };
}

export default new RubricFilterItemStore();
