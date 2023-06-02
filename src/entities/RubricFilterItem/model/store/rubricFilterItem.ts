import {makeAutoObservable} from 'mobx';

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

  turnOffFilterByKey = ({
    key,
    list,
  }: {
    key: string;
    list: Array<{rubrics: string[]}>;
  }) => {
    this.toggleRubricStatus({key, status: false});
    this.selectedRubricKey = '';

    return list;
  };

  filterByKey = ({key, list}: {key: string; list: any[]}) => {
    this.selectedRubricKey = key;
    this.toggleRubricStatus({key, status: true});

    return list.filter(item => {
      return item.rubrics.includes(key);
    });
  };

  startFilterLogic = ({key, list}: {key: string; list: any[]}) => {
    // when user presses already selected filter item
    if (this.selectedRubricKey === key) {
      return this.turnOffFilterByKey({key, list});
    }
    // when user presses filter item but there is already selected another item
    if (this.selectedRubricKey) {
      this.resetActiveRubricStatus();
      return this.filterByKey({key, list});
    }

    return this.filterByKey({key, list});
  };

  clearFilteredInfo = () => {
    this.selectedRubricKey = '';
    this.resetActiveRubricStatus();
  };
}

export default new RubricFilterItemStore();
