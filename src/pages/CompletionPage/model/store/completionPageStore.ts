import {makeAutoObservable} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {EventEndType, sessionStore} from '@src/entities/Session';
import {eventEndStorage} from '@src/shared/lib/storage/adapters/EventEndAdapter';
import {EVENT_END_TYPE_KEY} from '@src/shared/consts/storage';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {CategoryKey, categoryStore} from '@src/entities/Category';
import {RatingKeys, RatingResultsType} from '../types/completionTypes';
import {
  getLevelDescription,
  getQuadrantDescription,
  getSessionDescription,
  levelRatingInformationList,
  quadrantRatingInformationList,
  sessionRatingList,
} from '../lib/completionPageLib';
import {RatingInformationItemType} from '../types/completionTypes';
import {questionsStore} from '@src/pages/QuestionsPage';

const initialRatingResults: RatingResultsType = {
  question_1: 0,
  question_2: 0,
  question_3: 0,
  question_4: 0,
  feedback: '',
};

class CompletionPageStore {
  ratingResults = initialRatingResults;
  ratingInformationList: RatingInformationItemType[] = [];
  description: string = '';

  isFetching: boolean = true;
  isSending: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setRating = ({field, value}: {field: RatingKeys; value: string | number}) => {
    this.ratingResults = {...this.ratingResults, [field]: value};
  };

  setRatingResults = (ratingResults: RatingResultsType) => {
    this.ratingResults = ratingResults;
  };

  setIsFetching = (isFetching: boolean) => {
    this.isFetching = isFetching;
  };

  setIsSending = (isSending: boolean) => {
    this.isSending = isSending;
  };

  setRatingInformationList = (list: RatingInformationItemType[]) => {
    this.ratingInformationList = list;
  };

  setDescription = (description: string) => {
    this.description = description;
  };

  init = async (language: LanguageValueType) => {
    try {
      this.setIsFetching(true);
      await this.fetchRatingResults();
      await this.initRatinglist();
      await this.getAndSetDescription(language);
    } catch (error) {
      errorHandler({error});
    } finally {
      this.setIsFetching(false);
    }
  };

  getAndSetDescription = async (language: LanguageValueType) => {
    const eventKey = await this.getEventKey();
    const {currentLevel, nestLevel} = this.getCurrentAndNextLevels();

    let description;

    switch (eventKey) {
      case EventEndType.SESSION_END:
        const currentSession = sessionStore.session;
        if (currentLevel && currentSession) {
          description = getSessionDescription({
            curreentSessionNumber: currentSession.sessionNumber,
            allSessionsCount: currentLevel.allSessionsCount,
            currentLevelName: currentLevel.displayName[language],
          });
        }
        break;
      case EventEndType.QUADRANTS_END:
        const currentQuadrant = sessionStore.currentQuadrant;
        if (currentQuadrant) {
          description = getQuadrantDescription(
            currentQuadrant.displayName[language],
          );
        }
        break;
      default:
        if (currentLevel) {
          description = getLevelDescription({
            currentLevelName: currentLevel.displayName[language],
            nextLevelName: nestLevel?.displayName[language],
          });
        }
    }
    this.setDescription(description || '');
  };

  getCurrentAndNextLevels = () => {
    const currentLevel = categoryStore.category;
    if (!currentLevel) {
      return {};
    }

    const nestLevel = categoryStore.getNextLevel(currentLevel.id);
    return {currentLevel, nestLevel};
  };

  getEventKey = async () => {
    const eventKeyFromStorage = await eventEndStorage.getEventEndType(
      EVENT_END_TYPE_KEY,
    );

    if (!eventKeyFromStorage) {
      return EventEndType.SESSION_END;
    }

    return JSON.parse(eventKeyFromStorage) as EventEndType;
  };

  initRatinglist = async () => {
    const eventKeyFromStorage = await eventEndStorage.getEventEndType(
      EVENT_END_TYPE_KEY,
    );

    if (!eventKeyFromStorage) {
      return;
    }

    const eventKey = JSON.parse(eventKeyFromStorage) as EventEndType;

    switch (eventKey) {
      case EventEndType.SESSION_END:
        this.setRatingInformationList(sessionRatingList);
        break;
      case EventEndType.LEVEL_END:
        this.setRatingInformationList(levelRatingInformationList);
        break;
      case EventEndType.QUADRANTS_END:
        this.setRatingInformationList(quadrantRatingInformationList);
        break;
      default:
        this.setRatingInformationList(sessionRatingList);
    }
  };

  fetchRatingResults = async () => {
    crashlytics().log('Fetchig Rating Information');

    const userId = userStore.userId;
    const currentSession = sessionStore.session;

    const eventKeyFromStorage = await eventEndStorage.getEventEndType(
      EVENT_END_TYPE_KEY,
    );

    if (!(currentSession && eventKeyFromStorage)) {
      return;
    }

    const eventKey = JSON.parse(eventKeyFromStorage) as EventEndType;

    let documentId = this.getDocumentIds()?.[eventKey] || currentSession.id;

    const sessionEndDocRef = firestore()
      .collection(Collections.RATING_INFORMATION)
      .doc(eventKey)
      .collection(Collections.ENTRIES)
      .doc(userId);

    try {
      const documentSnapshot = await sessionEndDocRef.get();
      if (!documentSnapshot.exists) {
        // console.log('No document found for user:', userId);
        return;
      } else {
        const sessionRatingResults = {
          ...documentSnapshot.data(),
        };

        const defaultField = 'sessions';
        const field = this.getEventFields()[eventKey] || defaultField;
        const result = sessionRatingResults[field][documentId];

        result && this.setRatingResults(result);
      }
    } catch (error) {
      throw error;
    }
  };

  getEventFields = (): Record<EventEndType, string> => {
    return {
      [EventEndType.SESSION_END]: 'sessions',
      [EventEndType.LEVEL_END]: 'levels',
      [EventEndType.QUADRANTS_END]: 'quadrants',
    };
  };

  getDocumentIds = (): Record<EventEndType, string> | undefined => {
    const currentSession = sessionStore.session;
    const currentLevel = categoryStore.category;
    const currentQuadrant = sessionStore.currentQuadrant;

    if (!(currentSession && currentLevel && currentQuadrant)) {
      return;
    }

    return {
      [EventEndType.SESSION_END]: currentSession.id,
      [EventEndType.LEVEL_END]: currentLevel.id,
      [EventEndType.QUADRANTS_END]: this.getDocumentFieldForQuadrant({
        quadrantId: currentQuadrant.id,
        levelKey: currentLevel.name,
      }),
    };
  };

  getDocumentFieldForQuadrant = ({
    quadrantId,
    levelKey,
  }: {
    quadrantId: string;
    levelKey: CategoryKey;
  }) => {
    return `${levelKey}_${quadrantId}`;
  };

  sendRatingResults = async () => {
    crashlytics().log('Sending Rating Information');

    this.setIsSending(true);

    const userId = userStore.userId;
    const currentSession = sessionStore.session;

    const eventKeyFromStorage = await eventEndStorage.getEventEndType(
      EVENT_END_TYPE_KEY,
    );

    if (!(currentSession && eventKeyFromStorage)) {
      return;
    }

    const eventKey = JSON.parse(eventKeyFromStorage) as EventEndType;

    let documentId = this.getDocumentIds()?.[eventKey] || currentSession.id;

    const sessionEndRef = firestore()
      .collection(Collections.RATING_INFORMATION)
      .doc(eventKey)
      .collection(Collections.ENTRIES)
      .doc(userId);

    try {
      const docSnapshot = await sessionEndRef.get();
      const eventField = this.getEventFields()[eventKey];

      if (docSnapshot.exists) {
        const keyName = `${eventField}.${documentId}`;

        const sessionUpdate = {
          [keyName]: this.ratingResults,
        };

        sessionEndRef.update(sessionUpdate);
      } else {
        const initialSessionData = {
          [eventField]: {
            [documentId]: this.ratingResults,
          },
        };

        sessionEndRef.set(initialSessionData);
      }

      this.setRatingResults(initialRatingResults);
      navigation.navigate(TabRoutesNames.HOME);
      if (eventKey === EventEndType.LEVEL_END) {
        questionsStore.setCongratsModalVisible(true);
      }
    } catch (error) {
      errorHandler({error});
    } finally {
      this.setIsSending(false);
    }
  };

  clearForm = () => {
    this.setRatingResults(initialRatingResults);
    this.setDescription('');
    this.setRatingInformationList([]);
  };
}

export default new CompletionPageStore();
