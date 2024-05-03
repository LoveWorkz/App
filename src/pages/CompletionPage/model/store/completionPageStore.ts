import {makeAutoObservable} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {sessionStore} from '@src/entities/Session';
import {RatingKeys, SessionRatingResultsType} from '../types/completionTypes';

class CompletionPageStore {
  sessionRatingResults: SessionRatingResultsType = {
    question_1: 0,
    question_2: 0,
    question_3: 0,
    question_4: 0,
    feedback: '',
  };
  isFetching: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setRating = ({field, value}: {field: RatingKeys; value: string | number}) => {
    this.sessionRatingResults = {...this.sessionRatingResults, [field]: value};
  };

  setSessionRatingResults = (
    sessionRatingResults: SessionRatingResultsType,
  ) => {
    this.sessionRatingResults = sessionRatingResults;
  };

  setIsFetching = (isFetching: boolean) => {
    this.isFetching = isFetching;
  };

  init = async () => {
    try {
      this.setIsFetching(true);
      await this.fetchRatingResults();
    } catch (error) {
      errorHandler({error});
    } finally {
      this.setIsFetching(false);
    }
  };

  fetchRatingResults = async () => {
    crashlytics().log('Fetchig Rating Information');

    const userId = userStore.userId;
    const currentSession = sessionStore.session;

    if (!currentSession) {
      return;
    }

    const currentSessionId = currentSession.id;

    const sessionEndDocRef = firestore()
      .collection(Collections.RATING_INFORMATION)
      .doc('sessionEnd')
      .collection(Collections.ENTRIES)
      .doc(userId);

    try {
      const documentSnapshot = await sessionEndDocRef.get();
      if (!documentSnapshot.exists) {
        console.log('No document found for user:', userId);
        return;
      } else {
        const sessionRatingResults = {
          ...documentSnapshot.data(),
        };

        const result = sessionRatingResults.sessions[currentSessionId];

        result && this.setSessionRatingResults(result);
      }
    } catch (error) {
      throw error;
    }
  };

  sendRatingResults = async () => {
    crashlytics().log('Sending Rating Information');

    const userId = userStore.userId;
    const currentSession = sessionStore.session;

    if (!currentSession) {
      return;
    }

    const currentSessionId = currentSession.id;

    const sessionEndRef = firestore()
      .collection(Collections.RATING_INFORMATION)
      .doc('sessionEnd')
      .collection(Collections.ENTRIES)
      .doc(userId);

    try {
      const docSnapshot = await sessionEndRef.get();
      if (docSnapshot.exists) {
        const keyName = `sessions.${currentSessionId}`;

        const sessionUpdate = {
          [keyName]: this.sessionRatingResults,
        };

        sessionEndRef.update(sessionUpdate);
      } else {
        const initialSessionData = {
          sessions: {
            [currentSessionId]: this.sessionRatingResults,
          },
        };

        sessionEndRef.set(initialSessionData);
      }
    } catch (error) {
      errorHandler({error});
    }
  };
}

export default new CompletionPageStore();
