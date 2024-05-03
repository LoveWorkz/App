import {makeAutoObservable} from 'mobx';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {RatingKeys, SessionRatingResultsType} from '../types/completionTypes';

class CompletionPageStore {
  sessionRatingResults: SessionRatingResultsType = {
    question_1: 0,
    question_2: 0,
    question_3: 0,
    question_4: 0,
    feedback: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  setRating = ({field, value}: {field: RatingKeys; value: string | number}) => {
    this.sessionRatingResults = {...this.sessionRatingResults, [field]: value};
  };

  sendRatingResult = async () => {
    try {
      //   crashlytics().log('Fetching Categories page');
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new CompletionPageStore();
