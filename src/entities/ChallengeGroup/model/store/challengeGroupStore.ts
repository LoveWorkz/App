import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {ChallengeType, SpecialChallengeType} from '@src/entities/Challenge';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {ChallengeGroupType} from '../types/ChallengeGroupTypes';

class challengeGroupStore {
  coreChallengeGroups: ChallengeGroupType<ChallengeType[]>[] = [];
  specialChallengeGroups: ChallengeGroupType<SpecialChallengeType[]>[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchCoreAndSpecialChallengesGroups = async (categoryId?: string) => {
    try {
      crashlytics().log('Fetching special Challenge Groups.');
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const user = userStore.user;
      if(!user) return;

      const id = categoryId || user.challengeCategory.currentChallengeCategoryId || 'challenge_category_2';

      let promise1;
      let promise2;

      const isAllInOneCategory =
        !id || id === 'challenge_category_1';

      if (isAllInOneCategory) {
        // if selected category is All in one get all groups
        promise1 = firestore()
          .collection(Collections.CORE_CHALLENGE_GROUPS)
          .get({source});
        promise2 = firestore()
          .collection(Collections.SPECIAL_CHALLENGE_GROUPS)
          .get({source});
      } else {
        promise1 = firestore()
          .collection(Collections.CORE_CHALLENGE_GROUPS)
          .where('challengeCategoryIds', 'array-contains', id)
          .get({source});
        promise2 = firestore()
          .collection(Collections.SPECIAL_CHALLENGE_GROUPS)
          .where('challengeCategoryIds', 'array-contains', id)
          .get({source});
      }

      const [coreChallengeGroupsData, specailChallengeGroupsData] =
        await Promise.all([promise1, promise2]);

      const coreChallengeGroups = coreChallengeGroupsData.docs.map(doc => {
        const group = doc.data() as ChallengeGroupType<ChallengeType[]>;

        return {
          ...group,
          challenges: [],
        };
      });

      const specailChallengeGroups = specailChallengeGroupsData.docs.map(
        doc => {
          const group = doc.data() as ChallengeGroupType<
            SpecialChallengeType[]
          >;

          return {
            ...group,
            challenges: [],
          };
        },
      );

      runInAction(() => {
        this.coreChallengeGroups = coreChallengeGroups;
        this.specialChallengeGroups = specailChallengeGroups;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new challengeGroupStore();
