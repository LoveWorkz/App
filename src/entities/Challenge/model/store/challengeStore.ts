import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

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
import {removeDuplicates} from '@src/shared/lib/common';
import {userStore} from '@src/entities/User';
import {ChallengeType, SpecialChallengeType} from '../types/ChallengeTypes';
import {fetchChallengeButtonStatus, isLastCard} from '../lib/challenge';

class ChallengeStore {
  specialChallenge: SpecialChallengeType | null = null;
  coreChallenge: ChallengeType | null = null;
  isChallengeDoneButtonVisible: boolean = false;
  lockedChallengeIds: string[] = [];
  isSessionFlow: boolean = false;

  isSelectingChallenge: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setSpecialChallenge = (specialChallenge: SpecialChallengeType) => {
    this.specialChallenge = specialChallenge;
  };

  setCoreChallenge = (coreChallenge: ChallengeType) => {
    this.coreChallenge = coreChallenge;
  };

  setIsChallengeDoneButtonVisible = (isChallengeDoneButtonVisible: boolean) => {
    this.isChallengeDoneButtonVisible = isChallengeDoneButtonVisible;
  };

  setIsSelectingChallenge = (isSelectingChallenge: boolean) => {
    this.isSelectingChallenge = isSelectingChallenge;
  };

  isChallengeLockedIn = (id: string) => {
    return this.lockedChallengeIds.includes(id);
  };

  setIds = (ids: string[]) => {
    this.lockedChallengeIds = ids;
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
      const newValue = [...this.lockedChallengeIds, id];
      const filteredIds = removeDuplicates(newValue);
      this.setIds(filteredIds);

      let data = {[groupId]: filteredIds};

      const lockedChallengeIdsFromStorage =
        await this.getLockedChallengeIdsFromStorage();
      if (lockedChallengeIdsFromStorage) {
        data = {...lockedChallengeIdsFromStorage, [groupId]: filteredIds};
      }

      await coreChallengeInfoStorage.setCoreChallengeInfo(
        userId,
        JSON.stringify(data),
      );
    } catch (e) {
      errorHandler({error: e});
    }
  };

  initLockedChallengeIds = async (groupId: string) => {
    try {
      const lockedChallengeIdsFromStorage =
        await this.getLockedChallengeIdsFromStorage();
      if (lockedChallengeIdsFromStorage) {
        const lockedChallengeIds = lockedChallengeIdsFromStorage[groupId];
        if (!lockedChallengeIds) {
          return;
        }

        this.setIds(lockedChallengeIds);
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

  coreChallengePressHandler = ({challenge}: {challenge: ChallengeType}) => {
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
    navigation.navigate(AppRouteNames.CORE_CHALLENGE_INTRO, {
      title: 'Challenges',
    });
  };

  specialChallengePressHandler = (specailChallenge: SpecialChallengeType) => {
    this.setSpecialChallenge(specailChallenge);
    navigation.navigate(AppRouteNames.SPECIAL_CHALLENGE_INTRO);
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
      return 1;
    }

    return this.getChallengeNumber({
      challenges: coreChallengesList,
      id: currentCoreChallenge.id,
    });
  };

  // Swipes the special challenge card and updates button visibility if it's the last card
  swipeSpecialChallengeCard = async (id: string) => {
    try {
      if (this.isChallengeDoneButtonVisible || !this.specialChallenge) {
        return;
      }

      crashlytics().log(
        'Swiping and Updating challenge button visibility status.',
      );

      const {challengeCardsData, id: challengeId} = this.specialChallenge;
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

  updateChallenge = async (id: string) => {
    try {
      crashlytics().log('Updating challenge.');

      const selectedChallengesIds = challengesStore.selectedChallengesIds;
      let newSelectedChallengesIds;

      if (selectedChallengesIds.includes(id)) {
        newSelectedChallengesIds = selectedChallengesIds.filter(
          challengesId => challengesId !== id,
        );
      } else {
        newSelectedChallengesIds = [...selectedChallengesIds, id];
      }

      await userChallengeCategoryStore.updateUserChallengeCategory({
        field: 'selectedChallengesIds',
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

  updateSpecialChallenge = async ({id}: {id: string}) => {
    try {
      crashlytics().log('Updating special challenge.');

      const selectedSpecialChallengesIds =
        challengesStore.selectedSpecialChallengesIds;
      let newSelectedSpecialChallengesIds;

      if (selectedSpecialChallengesIds.includes(id)) {
        newSelectedSpecialChallengesIds = selectedSpecialChallengesIds.filter(
          challengesId => challengesId !== id,
        );
      } else {
        newSelectedSpecialChallengesIds = [...selectedSpecialChallengesIds, id];
      }

      await userChallengeCategoryStore.updateUserChallengeCategory({
        field: 'selectedSpecialChallengesIds',
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

  selectChallenge = async ({id, newValue}: {id: string; newValue: boolean}) => {
    try {
      crashlytics().log('Selecting Core challenge.');

      await this.updateChallenge(id);
      this.updateLocalChallenge(id, newValue);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  selectSpecialChallenge = async ({
    id,
    newValue,
  }: {
    id: string;
    newValue: boolean;
  }) => {
    try {
      crashlytics().log('Selecting special challenge.');

      await this.updateSpecialChallenge({id});
      this.updateLocalSpecialChallenge({id, newValue});
    } catch (e) {
      errorHandler({error: e});
    }
  };

  specialChallengeCardButtonPressHandler = async (
    specialChallengeId: string,
    isChecked: boolean,
  ) => {
    try {
      this.setIsSelectingChallenge(true);

      const isSessionFlow = this.isSessionFlow;

      if (isSessionFlow) {
        await sessionStore.processSessionCompletion();
        await this.checkEventAndNavigateToCompletionPage();
      }

      if (!isChecked && specialChallengeId) {
        this.selectSpecialChallenge({
          id: specialChallengeId,
          newValue: true,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsSelectingChallenge(false);
    }
  };

  coreChallengeCardButtonPressHandler = async (
    coreChallengeId: string,
    isChecked: boolean,
  ) => {
    try {
      this.setIsSelectingChallenge(true);

      const isSessionFlow = this.isSessionFlow;
      const session = sessionStore.session;
      const level = categoryStore.category;

      if (isSessionFlow && session && level) {
        await sessionStore.processSessionCompletion(coreChallengeId);
        await this.checkEventAndNavigateToCompletionPage();
      }

      if (!isChecked && coreChallengeId) {
        this.selectChallenge({id: coreChallengeId, newValue: true});
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
}

export default new ChallengeStore();
