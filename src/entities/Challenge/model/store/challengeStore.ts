import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';

import {userChallengeCategoryStore} from '@src/entities/UserChallengeCategory';
import {challengesStore} from '@src/pages/ChallengesPage';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {challengeInfoStorage} from '@src/shared/lib/storage/adapters/challengeInforAdapter';
import {eventEndStorage} from '@src/shared/lib/storage/adapters/EventEndAdapter';
import {EventEndType, sessionStore} from '@src/entities/Session';
import {
  EVENT_END_TYPE_KEY,
  SPECIAL_CHALLENGE_BUTTON_STATUS_KEY,
} from '@src/shared/consts/storage';
import {
  challengeGroupStore,
  ChallengeGroupType,
} from '@src/entities/ChallengeGroup';
import {categoryStore} from '@src/entities/Category';
import {coreChallengeInfoStorage} from '@src/shared/lib/storage/adapters/coreChallengeInfoAdapter';
import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {removeDuplicates} from '@src/shared/lib/common';
import {ChallengeType, SpecialChallengeType} from '../types/ChallengeTypes';
import {fetchChallengeButtonStatus, isLastCard} from '../lib/challenge';
import { challengeDoneFromSessionStorage } from '@src/shared/lib/storage/adapters/challengeDoneFromSessionAdapter';
import { UserChallengeCategoryType } from '@src/entities/UserChallengeCategory/model/types/userChallengeCategoryType';

class ChallengeStore {
  specialChallenge: SpecialChallengeType | null = null;
  coreChallenge: ChallengeType | null = null;
  isChallengeDoneButtonVisible: boolean = false;
  lockedChallengeIds: string[] = [];
  lockedChallengeId: string = '';
  isSessionFlow: boolean = false;
  coreChallengeCardScreenshot: string = '';
  specialChallengeCardScreenshot: string = '';
  challengeDoneFromSession: boolean = false;
  activeSpecialChallangesIds: string[] = [];
  isSelectingChallenge: boolean = false;
  challengeIsActive: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setSpecialChallenge = (specialChallenge: SpecialChallengeType | null) => {
    this.specialChallenge = specialChallenge;
  };

  setCoreChallenge = (coreChallenge: ChallengeType | null) => {
    this.coreChallenge = coreChallenge;
  };

  setIsChallengeDoneButtonVisible = (isChallengeDoneButtonVisible: boolean) => {
    this.isChallengeDoneButtonVisible = isChallengeDoneButtonVisible;
  };

  setIsSelectingChallenge = (isSelectingChallenge: boolean) => {
    this.isSelectingChallenge = isSelectingChallenge;
  };

  isChallengeLockedIn = (id: string) => {
    return this.lockedChallengeId === id;
  };

  setLockedChallengeId = (id: string) => {
    this.lockedChallengeId = id;
  };

  setCoreChallengeCardScreenshot = (coreChallengeCardScreenshot: string) => {
    this.coreChallengeCardScreenshot = coreChallengeCardScreenshot;
  };

  setSpecialChallengeCardScreenshot = (
    specialChallengeCardScreenshot: string,
  ) => {
    this.specialChallengeCardScreenshot = specialChallengeCardScreenshot;
  };

  setLockedChallengeIds = async ({
    id,
    groupId,
  }: {
    id: string;
    groupId: string;
  }) => {
    try {
      const userId = userStore.userId;

      let newValue = {[groupId]: id};

      const lockedChallengeIdsFromStorage =
        await this.getLockedChallengeIdsFromStorage();
      if (lockedChallengeIdsFromStorage) {
        newValue = {...lockedChallengeIdsFromStorage, [groupId]: id};
      }

      await coreChallengeInfoStorage.setCoreChallengeInfo(
        userId,
        JSON.stringify(newValue),
      );

      this.setLockedChallengeId(id);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  removeLockedChallengeId = async ({groupId}: {groupId: string}) => {
    try {
      const userId = userStore.userId;

      const lockedChallengeIdsFromStorage =
        await this.getLockedChallengeIdsFromStorage();

      if (lockedChallengeIdsFromStorage) {
        const data = {...lockedChallengeIdsFromStorage, [groupId]: ''};

        await coreChallengeInfoStorage.setCoreChallengeInfo(
          userId,
          JSON.stringify(data),
        );

        this.setLockedChallengeId('');
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  initLockedChallengeId = async (groupId: string) => {
    try {
      const lockedChallengeIdsFromStorage =
        await this.getLockedChallengeIdsFromStorage();
      if (lockedChallengeIdsFromStorage) {
        const lockedChallengeId = lockedChallengeIdsFromStorage[groupId];
        if (!lockedChallengeId) {
          return;
        }

        this.setLockedChallengeId(lockedChallengeId);
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getLockedChallengeIdsFromStorage = async () => {
    const userId = userStore.userId;

    const valueFromStorage =
      await coreChallengeInfoStorage.getCoreChallengeInfo(userId);
    if (valueFromStorage) {
      return JSON.parse(valueFromStorage);
    }
  };

  coreChallengeCardsSwipeHandler = (challenge: ChallengeType) => {
    this.setCoreChallenge(challenge);
  };

  setIsSessionFlow = (isSessionFlow: boolean) => {
    this.isSessionFlow = isSessionFlow;
  };

  coreChallengePressHandler = async ({
    challenge,
    isFavorite,
  }: // isFavorite
  {
    challenge: ChallengeType;
    isFavorite?: boolean;
  }) => {
    // setting core challenge group info
    const coreChallengeGroups = challengeGroupStore.coreChallengeGroups;
    const currentCoreChallengeGroup = challengeGroupStore.getChallengeGroupById(
      {challengeGroups: coreChallengeGroups, id: challenge.groupId},
    );

    if (!currentCoreChallengeGroup) {
      return;
    }

    challengeGroupStore.setCurrentCoreChallengeGroup(
      currentCoreChallengeGroup as ChallengeGroupType<ChallengeType[]>,
    );
    this.setCoreChallenge(challenge);

    await this.incrementChallengeViewCount({
      challengeId: challenge.id,
      isCore: true,
    });

    navigation.navigate(AppRouteNames.CORE_CHALLENGE_INTRO, {
      title: 'Challenges',
      isFavorite,
    });
  };

  specialChallengePressHandler = async ({
    specialChallenge,
    isFavorite,
  }: {
    specialChallenge: SpecialChallengeType;
    isFavorite?: boolean;
  }) => {
    console.log(specialChallenge);
    this.setSpecialChallenge(specialChallenge);

    const specialChallengeGroup =
      challengeGroupStore.getSpecialChallengeGroupById(
        specialChallenge.groupId,
      );

    if (!specialChallengeGroup) {
      return;
    }

    challengeGroupStore.setCurrentSpecialChallengeGroup(specialChallengeGroup);

    await this.incrementChallengeViewCount({
      challengeId: specialChallenge.id,
      isCore: false,
    });

    navigation.navigate(AppRouteNames.SPECIAL_CHALLENGE_INTRO, {isFavorite});
  };

  getChallengeNumber = ({
    challenges,
    id,
  }: {
    challenges: ChallengeType[];
    id: string;
  }) => {
    const challengeIndex = challenges.findIndex(item => item.id === id);
    return challengeIndex === -1 ? 1 : challengeIndex + 1;
  };

  getDefaultChallengeNumberForCardsPage = ({
    coreChallengesList,
  }: {
    coreChallengesList: ChallengeType[];
  }) => {
    const currentCoreChallenge = this.coreChallenge;
    if (!currentCoreChallenge) {
      return 0;
    }

    return this.getChallengeNumber({
      challenges: coreChallengesList,
      id: currentCoreChallenge.id,
    });
  };

  // Swipes the special challenge card and updates button visibility if it's the last card
  swipeSpecialChallengeCard = async (id: string, lang: string) => {
    try {
      if (this.isChallengeDoneButtonVisible || !this.specialChallenge) {
        return;
      }

      crashlytics().log(
        'Swiping and Updating challenge button visibility status.',
      );

      let {challengeCardsData, id: challengeId} = this.specialChallenge;
      challengeCardsData = challengeCardsData.filter((item)=>(item.visibility.indexOf(lang) !== -1))
      
      if (isLastCard(id, challengeCardsData)) {
        const specialChallengeInfo = await fetchChallengeButtonStatus();
        const updatedInfo = {
          ...specialChallengeInfo,
          [challengeId]: {buttonStatus: true},
        };

        this.setIsChallengeDoneButtonVisible(true);
        await challengeInfoStorage.setChallengeInfo(
          SPECIAL_CHALLENGE_BUTTON_STATUS_KEY,
          JSON.stringify(updatedInfo),
        );
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  // Updates the visibility of the challenge button based on stored info
  updateChallengeButtonVisibility = async () => {
    try {
      crashlytics().log('Updating challenge button visibility status.');

      if (!this.specialChallenge) {
        return;
      }

      const specialChallengeInfo = await fetchChallengeButtonStatus();
      const buttonInfo = specialChallengeInfo[this.specialChallenge.id];

      if (buttonInfo) {
        this.setIsChallengeDoneButtonVisible(buttonInfo.buttonStatus);
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateChallenge = async ({
    id,
    isChallengeCard,
  }: {
    id: string;
    isChallengeCard: boolean;
  }) => {
    try {
      crashlytics().log('Updating Core challenge.');

      const selectedChallengesIds = challengesStore.selectedChallengesIds;
      let newSelectedChallengesIds;

      if (isChallengeCard) {
        newSelectedChallengesIds = removeDuplicates([
          ...selectedChallengesIds,
          id,
        ]);
      } else if (selectedChallengesIds.includes(id)) {
        newSelectedChallengesIds = selectedChallengesIds.filter(
          challengesId => challengesId !== id,
        );
      } else {
        newSelectedChallengesIds = [...selectedChallengesIds, id];
      }

      await userChallengeCategoryStore.updateUserSelectedChallenges({
        isCore: true,
        data: newSelectedChallengesIds,
      });

      challengesStore.setSelectedChallengesIds(newSelectedChallengesIds);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateLocalChallenge = (id: string, newValue: boolean) => {
    const newChallenges = challengesStore.challenges.map(challenge => {
      if (challenge.id === id) {
        return {...challenge, isChecked: newValue};
      }

      return {...challenge};
    });

    runInAction(() => {
      challengesStore.challenges = newChallenges;
    });
  };

  updateSpecialChallenge = async ({
    id,
    isChallengeCard,
  }: {
    id: string;
    isChallengeCard: boolean;
  }) => {
    try {
      crashlytics().log('Updating special challenge.');

      const selectedSpecialChallengesIds =
        challengesStore.selectedSpecialChallengesIds;
      let newSelectedSpecialChallengesIds;

      if (isChallengeCard) {
        newSelectedSpecialChallengesIds = removeDuplicates([
          ...selectedSpecialChallengesIds,
          id,
        ]);
      } else if (selectedSpecialChallengesIds.includes(id)) {
        newSelectedSpecialChallengesIds = selectedSpecialChallengesIds.filter(
          challengesId => challengesId !== id,
        );
      } else {
        newSelectedSpecialChallengesIds = [...selectedSpecialChallengesIds, id];
      }

      await userChallengeCategoryStore.updateUserSelectedChallenges({
        isCore: false,
        data: newSelectedSpecialChallengesIds,
      });

      challengesStore.setSelectedSpecialChallengesIds(
        newSelectedSpecialChallengesIds,
      );
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateLocalSpecialChallenge = ({
    id,
    newValue,
  }: {
    id: string;
    newValue: boolean;
  }) => {
    const newSpecialChallenges = challengesStore.specialChallenges.map(
      challenge => {
        if (challenge.id === id) {
          return {...challenge, isChecked: newValue};
        }

        return {...challenge};
      },
    );

    runInAction(() => {
      challengesStore.specialChallenges = newSpecialChallenges;
    });
  };

  selectChallenge = async ({
    id,
    newValue,
    isChallengeCard = false,
  }: {
    id: string;
    newValue: boolean;
    isChallengeCard?: boolean;
  }) => {
    try {
      crashlytics().log('Selecting Core challenge.');

      await this.updateChallenge({id, isChallengeCard});
      this.updateLocalChallenge(id, newValue);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  selectSpecialChallenge = async ({
    id,
    newValue,
    isChallengeCard = false,
  }: {
    id: string;
    newValue: boolean;
    isChallengeCard?: boolean;
  }) => {
    try {
      crashlytics().log('Selecting special challenge.');

      this.setActiveSpecialChallangesIds(id, 'remove');

      if(newValue) {
        this.setChallengeIsAcitve(true);
         
      } else {
        this.setChallengeIsAcitve(false);
      }
      
      await this.updateSpecialChallenge({id, isChallengeCard});
      this.updateLocalSpecialChallenge({id, newValue});
    } catch (e) {
      errorHandler({error: e});
    }
  };

  specialChallengeSessionFlow = async (isSessionFlow: boolean, specialChallengeId: string) => {
    if (isSessionFlow) {
      await sessionStore.processSessionCompletion();
      await this.checkEventAndNavigateToCompletionPage();
      await this.incrementChallengeViewCount({
        challengeId: specialChallengeId,
        isCore: false,
      });
      await challengeDoneFromSessionStorage.setChallengeDone(specialChallengeId);
    }
  }

  specialChallengeCardButtonPressHandler = async (
    specialChallengeId: string,
    isChecked: boolean,
  ) => {
    try {
      this.setIsSelectingChallenge(true);

      const isSessionFlow = this.isSessionFlow;

      await this.specialChallengeSessionFlow(isSessionFlow, specialChallengeId);

      if (!isChecked && specialChallengeId) {
        this.selectSpecialChallenge({
          id: specialChallengeId,
          newValue: true,
          isChallengeCard: true,
        });
      }

      if (isChecked && specialChallengeId) {
        this.selectSpecialChallenge({
          id: specialChallengeId,
          newValue: false,
          isChallengeCard: true,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsSelectingChallenge(false);
    }
  };

  coreChallengeCardButtonPressHandler = async ({
    coreChallengeId,
    isChecked,
  }: {
    coreChallengeId: string;
    isChecked: boolean;
  }) => {
    try {
      this.setIsSelectingChallenge(true);

      const isSessionFlow = this.isSessionFlow;
      const session = sessionStore.session;
      const level = categoryStore.category;

      if (isSessionFlow && session && level) {
        await sessionStore.processSessionCompletion(coreChallengeId);
        await this.checkEventAndNavigateToCompletionPage();
        await this.incrementChallengeViewCount({
          challengeId: coreChallengeId,
          isCore: true,
        });
      }

      if (!isChecked && coreChallengeId) {
        this.selectChallenge({
          id: coreChallengeId,
          newValue: true,
          isChallengeCard: true,
        });
      }

      if (isChecked && coreChallengeId) {
        this.selectChallenge({
          id: coreChallengeId,
          newValue: false,
          isChallengeCard: true,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsSelectingChallenge(false);
    }
  };

  checkEventAndNavigateToCompletionPage = async () => {
    const eventKeyFromStorage = await eventEndStorage.getEventEndType(
      EVENT_END_TYPE_KEY,
    );

    if (!eventKeyFromStorage) {
      return;
    }

    const eventKey = JSON.parse(eventKeyFromStorage) as EventEndType;

    if (eventKey === EventEndType.QUADRANTS_END) {
      navigation.navigate(AppRouteNames.QUADRANT_COMPLETION);
    } else {
      navigation.navigate(AppRouteNames.COMPLETION);
    }
  };

  incrementChallengeViewCount = async ({
    challengeId,
    isCore,
  }: {
    challengeId: string;
    isCore: boolean;
  }) => {
    const collectionName = isCore
      ? Collections.CORE_CHALLENGES_NEW
      : Collections.SPECIAL_CHALLENGES_2;

    const challengeRef = firestore()
      .collection(collectionName)
      .doc(challengeId);

    try {
      await challengeRef.update({
        totalViews: firestore.FieldValue.increment(1),
      });
    } catch (e) {
      errorHandler({
        error: e,
        message: `Failed to increment totalViews for challengeId: ${challengeId}`,
      });
    }
  };

  fetchChallengeById = async ({
    challengeId,
    isCore,
  }: {
    challengeId: string;
    isCore: boolean;
  }) => {
    try {
      crashlytics().log('Fetching Challenge By Id.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(
          isCore
            ? Collections.CORE_CHALLENGES_NEW
            : Collections.SPECIAL_CHALLENGES_2,
        )
        .doc(challengeId)
        .get({source});

      const challenge = data.data();
      if (!challenge) {
        return;
      }

      if (isCore) {
        this.setCoreChallenge(challenge as ChallengeType);
      } else {
        this.setSpecialChallenge(challenge as SpecialChallengeType);
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  clearForm = () => {
    this.setLockedChallengeId('');
  };

  updateChallangeDoneFromSession = async (challengeId: string | undefined) => {
    if(challengeId) {
      const isDone =  await challengeDoneFromSessionStorage.getChallengeDone(challengeId);
      runInAction(() => {
        this.challengeDoneFromSession = (isDone === 'DONE');
      })
    }
  }
  removeChallangeDoneFromSession = () => {
   this.challengeDoneFromSession = false;
  }

  getActiveSpecialChallangesIds = async (specialChallengeId: string, specialChallengeisChecked: boolean) => {
    try {
      crashlytics().log('Getting active special challanges Ids.');
      
      const source = await userStore.checkIsUserOfflineAndReturnSource();
      const userId = userStore.userId;
      
      const userChallengeCategoryData = await firestore()
        .collection(Collections.USER_CHALLENGE_CATEGORIES)
        .doc(userId)
        .get({source});
      const userChallengeCategory =
        userChallengeCategoryData.data() as UserChallengeCategoryType;

      if (!userChallengeCategory) {
        return;
      }

      runInAction(() => {
        this.activeSpecialChallangesIds = userChallengeCategory.activeSpecialChallangesIds;

        if (userChallengeCategory.activeSpecialChallangesIds.includes(specialChallengeId as string) || specialChallengeisChecked) {
          this.setChallengeIsAcitve(true);
        } else {
          this.setChallengeIsAcitve(false);
        }
      })
    } catch (e) {
      errorHandler({error: e});
    }
  }

  setActiveSpecialChallangesIds = async (specialChallengeId: string, type: 'add' | 'remove') => {
    try {
      crashlytics().log('Setting active special challanges Ids.');
      let newActiveSpecialChallangesIds: string[];
      let indexToRemove;

      if(type==='add') {
        newActiveSpecialChallangesIds = [specialChallengeId,...this.activeSpecialChallangesIds];
      }
      else {
        indexToRemove = this.activeSpecialChallangesIds.indexOf(specialChallengeId);
        newActiveSpecialChallangesIds = [...this.activeSpecialChallangesIds.slice(0, indexToRemove), ...this.activeSpecialChallangesIds.slice(indexToRemove + 1)];;
      }

      const userId = userStore.userId;

      await firestore()
        .collection(Collections.USER_CHALLENGE_CATEGORIES)
        .doc(userId)
        .update({
          activeSpecialChallangesIds: newActiveSpecialChallangesIds
        });

      challengesStore.fetchActiveChallenges();

      runInAction(() => {
        this.activeSpecialChallangesIds = newActiveSpecialChallangesIds;
      })
    } catch (e) {
      errorHandler({error: e});
    }
  }

  setChallengeIsAcitve(status: boolean) {
    this.challengeIsActive=status;
  }
}

export default new ChallengeStore();