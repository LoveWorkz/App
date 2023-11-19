import {makeAutoObservable} from 'mobx';

class ChallengeCardsPageStore {
  currenctCategoryBlock: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setCurrenctCategoryBlock = (currenctCategoryBlock: string) => {
    this.currenctCategoryBlock = currenctCategoryBlock;
  };

  reset = () => {
    this.setCurrenctCategoryBlock('');
  };
}

export default new ChallengeCardsPageStore();
