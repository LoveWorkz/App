import {makeAutoObservable} from 'mobx';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {guidedTourStorage} from '@src/shared/lib/storage/adapters/guidedTourAdapter';
import {GUIDED_TOUR_COMPLETED_KEY} from '@src/shared/consts/storage';

class GuidedTourStore {
  isGuidedTourCompleted: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsGuidedTourCompleted = (isGuidedTourCompleted: boolean) => {
    this.isGuidedTourCompleted = isGuidedTourCompleted;
  };

  initGuidedTour = async () => {
    try {
      const valueFromStorage = await guidedTourStorage.getGuidedTour(
        GUIDED_TOUR_COMPLETED_KEY,
      );
      if (valueFromStorage) {
        this.setIsGuidedTourCompleted(JSON.parse(valueFromStorage));
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  handleGuidedTourCompleteLogic = async () => {
    await guidedTourStorage.setGuidedTour(
      GUIDED_TOUR_COMPLETED_KEY,
      JSON.stringify(true),
    );

    this.setIsGuidedTourCompleted(true);
  };
}

export default new GuidedTourStore();
