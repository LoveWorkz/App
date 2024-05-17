import {makeAutoObservable} from 'mobx';
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
  currentCoreChallengeGroup: ChallengeGroupType<ChallengeType[]> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setCoreChallengeGroups = (
    coreChallengeGroups: ChallengeGroupType<ChallengeType[]>[],
  ) => {
    this.coreChallengeGroups = coreChallengeGroups;
  };

  setSpecialChallengeGroups = (
    specialChallengeGroups: ChallengeGroupType<SpecialChallengeType[]>[],
  ) => {
    this.specialChallengeGroups = specialChallengeGroups;
  };

  setCurrentCoreChallengeGroup = (
    currentCoreChallengeGroup: ChallengeGroupType<ChallengeType[]>,
  ) => {
    this.currentCoreChallengeGroup = currentCoreChallengeGroup;
  };

  getChallengeGroupById = ({
    challengeGroups,
    id,
  }: {
    challengeGroups: ChallengeGroupType<
      SpecialChallengeType[] | ChallengeType[]
    >[];
    id: string;
  }) => {
    return challengeGroups.find(group => group.id === id) || challengeGroups[0];
  };

  fetchCoreAndSpecialChallengesGroups = async (categoryId?: string) => {
    try {
      crashlytics().log('Fetching special Challenge Groups.');
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const user = userStore.user;
      if (!user) {
        return;
      }

      const defaultId = 'challenge_category_2';

      const id =
        categoryId ||
        user.challengeCategory.currentChallengeCategoryId ||
        defaultId;

      let promise1;
      let promise2;

      const isAllInOneCategory = !id || id === 'challenge_category_1';

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

      this.setCoreChallengeGroups(coreChallengeGroups);
      this.setSpecialChallengeGroups(specailChallengeGroups);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchAllCoreChallengesGroups = async () => {
    try {
      crashlytics().log('Fetching All Core Challenge Groups.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.CORE_CHALLENGE_GROUPS)
        .get({source});

      const allCoreChallengeGroups = data.docs.map(doc => {
        const group = doc.data() as ChallengeGroupType<ChallengeType[]>;

        return {
          ...group,
          challenges: [],
        };
      });

      this.setCoreChallengeGroups(allCoreChallengeGroups);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchAllSpecialChallengesGroups = async () => {
    try {
      crashlytics().log('Fetching All special Challenge Groups.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.SPECIAL_CHALLENGE_GROUPS)
        .get({source});

      const allSpecialChallengeGroups = data.docs.map(doc => {
        const group = doc.data() as ChallengeGroupType<SpecialChallengeType[]>;

        return {
          ...group,
          challenges: [],
        };
      });

      this.setSpecialChallengeGroups(allSpecialChallengeGroups);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getSpecialChallengeGroupById = (groupId: string) => {
    return this.specialChallengeGroups.find(item => item.id === groupId);
  };
}

export default new challengeGroupStore();
