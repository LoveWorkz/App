import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {QuadrantType, sessionStore} from '@src/entities/Session';

class PreSessionPageStore {
  isPreSessionPageLoading: boolean = false;
  currentQuadrantAndSession: QuadrantType | null = null;
  currentQuadrantWithAllSessions: QuadrantType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setCurrentQuadrantAndSession = (quadrant: QuadrantType | null) => {
    this.currentQuadrantAndSession = quadrant;
  };

  setCurrentQuadrantWithAllSessions = (quadrant: QuadrantType | null) => {
    this.currentQuadrantWithAllSessions = quadrant;
  };

  init = async (currentLevelId: string) => {
    try {
      crashlytics().log('Init Pre Sessions Page');

      runInAction(() => {
        this.isPreSessionPageLoading = true;
      });

      await sessionStore.fetchQuadrants(currentLevelId);
      await sessionStore.fetchSessions(currentLevelId);

      const currentQuadrantAndSession =
        sessionStore.getCurrentQuadrantAndSession();
      const currentQuadrantWithAllSessions = sessionStore.getCurrentQuadrant();

      this.setCurrentQuadrantAndSession(currentQuadrantAndSession);
      this.setCurrentQuadrantWithAllSessions(currentQuadrantWithAllSessions);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isPreSessionPageLoading = false;
      });
    }
  };
}

export default new PreSessionPageStore();
