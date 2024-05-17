import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {userChallengeCategoryStore} from '@src/entities/UserChallengeCategory';
import {challengesStore} from '@src/pages/ChallengesPage';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {challengeInfoStorage} from '@src/shared/lib/storage/adapters/challengeInforAdapter';
import {eventEndStorage} from '@src/shared/lib/storage/adapters/EventEndAdapter';
import {EventEndType} from '@src/entities/Session';
import {
  EVENT_END_TYPE_KEY,
  SPECIAL_CHALLENGE_BUTTON_STATUS_KEY,
} from '@src/shared/consts/storage';
import {
  challengeGroupStore,
  ChallengeGroupType,
} from '@src/entities/ChallengeGroup';
import {categoryStore} from '@src/entities/Category';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {ChallengeType, SpecialChallengeType} from '../types/ChallengeTypes';
import {fetchChallengeButtonStatus, isLastCard} from '../lib/challenge';

class ChallengeStore {
  specialChallenge: SpecialChallengeType | null = null;
  coreChallenge: ChallengeType | null = null;
  isChallengeDoneButtonVisible: boolean = false;

  isSelectingSpecialChallenge: boolean = false;

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

  setIsSelectingSpecialChallenge = (isSelectingSpecialChallenge: boolean) => {
    this.isSelectingSpecialChallenge = isSelectingSpecialChallenge;
  };

  coreChallengePressHandler = ({
    challenge,
    language,
  }: {
    challenge: ChallengeType;
    language: LanguageValueType;
  }) => {
    // setting core challenge group info
    const coreChallengeGroups = challengeGroupStore.coreChallengeGroups;
    const currentCoreChallengeGroup = challengeGroupStore.getChallengeGroupById(
      {challengeGroups: coreChallengeGroups, id: challenge.groupId},
    );

    if (!currentCoreChallengeGroup) {
      return;
    }

    const currentLevel = categoryStore.category;

    challengeGroupStore.setCurrentCoreChallengeGroup(
      currentCoreChallengeGroup as ChallengeGroupType<ChallengeType[]>,
    );
    this.setCoreChallenge(challenge);
    navigation.navigate(AppRouteNames.CORE_CHALLENGE_INTRO, {
      title: currentLevel
        ? `${currentLevel.displayName[language]} session`
        : '',
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

      this.setIsSelectingSpecialChallenge(true);

      await this.updateSpecialChallenge({id});
      this.updateLocalSpecialChallenge({id, newValue});
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsSelectingSpecialChallenge(false);
    }
  };

  challengeCardButtonPressHandler = async (specialChallengeId: string) => {
    specialChallengeId &&
      this.selectSpecialChallenge({
        id: specialChallengeId,
        newValue: true,
      });

    await this.checkEventAndNavigateToCompletionPage();
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
