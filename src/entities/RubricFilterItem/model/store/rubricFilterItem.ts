import {makeAutoObservable} from 'mobx';

import {rubricFilterItems} from '../consts/consts';
import {RubricFilterItemType} from '../types/rubricFilterItemTypes';

class RubricFilterItemStore {
  rubricskeys: string[] = [];
  rubricFilterItems: RubricFilterItemType[] = rubricFilterItems;

  constructor() {
    makeAutoObservable(this);
  }

  toggleRubricStatus = ({name, status}: {name: string; status?: boolean}) => {
    this.rubricFilterItems = this.rubricFilterItems.map(rubric => {
      if (typeof status === 'boolean') {
        return {...rubric, active: status};
      }

      if (rubric.name === name) {
        return {
          ...rubric,
          active: !rubric.active,
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
    // delete category key from keys
    this.rubricskeys = this.rubricskeys.filter(item => item !== key);

    let currentList = list;
    // if the keys are empty, set to 1 and make the loop run at least once to remove the first active category
    const keysLength = this.rubricskeys.length ? this.rubricskeys.length : 1;

    for (let i = 0; i < keysLength; i++) {
      currentList = currentList.filter(item => {
        if (this.rubricskeys[i]) {
          return item.rubrics.includes(this.rubricskeys[i]);
        }
        return true;
      });
    }
    return currentList;
  };

  filterByKey = ({key, list}: {key: string; list: any[]}) => {
    this.rubricskeys = Array.from(new Set([...this.rubricskeys, key]));

    return list.filter(item => {
      return item.rubrics.includes(key);
    });
  };

  clearInfo = () => {
    this.rubricskeys = [];
    this.toggleRubricStatus({name: '', status: false});
  };
}

export default new RubricFilterItemStore();
