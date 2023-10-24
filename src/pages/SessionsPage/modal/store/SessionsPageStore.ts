import {makeAutoObservable, runInAction} from 'mobx';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {sessionStore} from '@src/entities/Session';

class SessionsPageStore {
  isFetching: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  init = async (id?: string) => {
    try {
      runInAction(() => {
        this.isFetching = true;
      });

      if (!id) {
        return;
      }

      await sessionStore.fetchSessions(id);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isFetching = false;
      });
    }
  };
}

export default new SessionsPageStore();
