import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {Collections} from '@src/shared/types/firebase';
import {QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {DocumentType} from '@src/shared/types/types';
import {
  SessionType,
  SubCategories,
  SubCategoriesKeys,
} from '../types/sessionType';

class SessionStore {
  sessions: SessionType[] = [];
  session: SessionType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setSessions = (sessions: SessionType[]) => {
    this.sessions = sessions;
  };

  setSession = (session: SessionType) => {
    this.session = session;
  };

  selectSession = ({
    session,
    categoryId,
  }: {
    session: SessionType;
    categoryId?: string;
  }) => {
    if (!categoryId) {
      return;
    }

    this.setSession(session);
    navigation.navigate(AppRouteNames.QUESTIONS, {
      type: DocumentType.CATEGORY,
      id: categoryId,
    });
  };

  fetchSessions = async (categoryId: string) => {
    try {
      crashlytics().log('Fetching sessions');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.CATEGORIES_2)
        .doc(categoryId)
        .collection(Collections.SESSIONS)
        .get({source});

      const sessions = data.docs.map(doc => {
        return {...doc.data(), id: doc.id};
      }) as SessionType[];

      const sortedSessions = [...sessions].sort(
        (a, b) => a.sessionNumber - b.sessionNumber,
      );

      runInAction(() => {
        this.sessions = sortedSessions;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getSessionQuestions = (questionsMap: Record<string, QuestionType>) => {
    let questions: QuestionType[] = [];

    const session = this.session;
    if (!session) {
      return [];
    }

    const subCategories = session.subCategories;
    // receiving questions and sorting by sessions, by sub category and by difficulty
    const sessionQuestions = this.sortAndReturnQuestions({
      subCategories,
      questionsMap,
    });

    const lastQuestion = sessionQuestions[sessionQuestions.length - 1];
    const newQuestions = sessionQuestions.slice(0, sessionQuestions.length - 1);

    questions = [
      ...questions,
      ...newQuestions,
      // the last question inside session should be challenge question
      {
        ...lastQuestion,
        type: 'CHALLANGE_CARD',
        challengeId: session.challange,
      },
    ];

    return questions;
  };

  sortAndReturnQuestions = ({
    subCategories,
    questionsMap,
  }: {
    subCategories: SubCategories;
    questionsMap: Record<string, QuestionType>;
  }) => {
    const result: QuestionType[] = [];
    const subKeys: Array<SubCategoriesKeys> = [
      'WARM_UP',
      'DEEP',
      'INTENSIFY',
      'HOT',
    ];

    subKeys.forEach(k => {
      const key = k as SubCategoriesKeys;

      if (subCategories[key]) {
        const questions = subCategories[key].map(questionId => {
          return {...questionsMap[questionId]};
        });

        const sortedQuestions = [...questions].sort(
          (a, b) => a.difficulty - b.difficulty,
        );
        result.push(...sortedQuestions);
      }
    });

    return result;
  };
}

export default new SessionStore();
