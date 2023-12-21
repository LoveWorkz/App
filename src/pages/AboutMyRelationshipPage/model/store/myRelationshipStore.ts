import {makeAutoObservable} from 'mobx';

class MyRelationshipStore {
  relationshipStatus: string = '';
  doYouLiveTogether: string = '';
  doYouHaveKids: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setRelationshipStatus = (status: string) => {
    this.relationshipStatus = status;
  };

  setDoYouLiveTogether = (value: string) => {
    this.doYouLiveTogether = value;
  };

  setDoYouHaveKids = (value: string) => {
    this.doYouHaveKids = value;
  };
}

export default new MyRelationshipStore();
