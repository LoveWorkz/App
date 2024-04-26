import {makeAutoObservable} from 'mobx';

class ChallengeCardsPageStore {
  isChallengeDoneButtonVisible: boolean = false;
  data = [
    {id: 1, title: 'title', showButton: false},
    {id: 2, title: '2 title', showButton: false},
    {id: 4, title: 'title', showButton: false},
    {id: 5, title: 'title', showButton: false},
    {id: 6, title: 'title', showButton: false},
    {id: 7, title: 'title', showButton: false},
    {id: 8, title: 'title', showButton: false},
  ];

  constructor() {
    makeAutoObservable(this);
  }

  setIsChallengeDoneButtonVisible = (isChallengeDoneButtonVisible: boolean) => {
    this.isChallengeDoneButtonVisible = isChallengeDoneButtonVisible;
  };

  swipe = (id: number) => {
    const lastElement = this.data[this.data.length - 1];

    if (id === lastElement.id) {
      this.setIsChallengeDoneButtonVisible(true);
    }
  };
}

export default new ChallengeCardsPageStore();
