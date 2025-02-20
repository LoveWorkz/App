import {makeAutoObservable} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import firebase from '@react-native-firebase/app';

import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {ChallengeType, SpecialChallengeType} from '@src/entities/Challenge';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {ChallengeGroupType} from '../types/ChallengeGroupTypes';

const db = firebase.firestore();

class challengeGroupStore {
  coreChallengeGroups: ChallengeGroupType<ChallengeType[]>[] = [];
  specialChallengeGroups: ChallengeGroupType<SpecialChallengeType[]>[] = [];
  currentCoreChallengeGroup: ChallengeGroupType<ChallengeType[]> | null = null;
  currentSpecialChallengeGroup: ChallengeGroupType<
    SpecialChallengeType[]
  > | null = null;

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

  setCurrentSpecialChallengeGroup = (
    currentSpecialChallengeGroup: ChallengeGroupType<SpecialChallengeType[]>,
  ) => {
    this.currentSpecialChallengeGroup = currentSpecialChallengeGroup;
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

  fetchChallengeGroupById = async ({
    groupId,
    isCore,
  }: {
    groupId: string;
    isCore: boolean;
  }) => {
    try {
      crashlytics().log('Fetching Challenge Group By id.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(
          isCore
            ? Collections.CORE_CHALLENGE_GROUPS
            : Collections.SPECIAL_CHALLENGE_GROUPS,
        )
        .doc(groupId)
        .get({source});

      const challengeGroup = data.data();
      if (!challengeGroup) {
        return;
      }

      if (isCore) {
        this.setCurrentCoreChallengeGroup(
          challengeGroup as ChallengeGroupType<ChallengeType[]>,
        );
      } else {
        this.setCurrentSpecialChallengeGroup(
          challengeGroup as ChallengeGroupType<SpecialChallengeType[]>,
        );
      }
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

  fetchGroupsByIds = async ({
    groupIds,
    collectionName,
    isCore = true,
  }: {
    groupIds: string[];
    collectionName: Collections;
    isCore?: boolean;
  }) => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      if (!groupIds.length) {
        return [];
      }

      const groupsRef = db.collection(collectionName);
      const snapshot = await groupsRef
        .where(firebase.firestore.FieldPath.documentId(), 'in', groupIds)
        .get({source});

      if (snapshot.empty) {
        console.log('No matching groups found.');
        return [];
      }

      const groups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (isCore) {
        this.setCoreChallengeGroups(
          groups as ChallengeGroupType<ChallengeType[]>[],
        );
      } else {
        this.setSpecialChallengeGroups(
          groups as ChallengeGroupType<SpecialChallengeType[]>[],
        );
      }

      return groups as ChallengeGroupType<
        SpecialChallengeType[] | ChallengeType[]
      >[];
    } catch (e) {
      errorHandler({error: e, message: 'Error fetching groups'});
      return [];
    }
  };
}

export default new challengeGroupStore();
