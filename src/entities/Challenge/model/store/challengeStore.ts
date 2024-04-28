import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {userChallengeCategoryStore} from '@src/entities/UserChallengeCategory';
import {challengesStore} from '@src/pages/ChallengesPage';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {challengeInfoStorage} from '@src/shared/lib/storage/adapters/challengeInforAdapter';
import {SPECIAL_CHALLENGE_BUTTON_STATUS_KEY} from '@src/shared/consts/storage';
import {ChallengeType, SpecialChallengeType} from '../types/ChallengeTypes';
import {fetchChallengeButtonStatus, isLastCard} from '../lib/challenge';

class ChallengeStore {
  specialChallenge: SpecialChallengeType | null = null;
  coreChallenge: ChallengeType | null = null;
  isChallengeDoneButtonVisible: boolean = false;

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

      challengesStore.setSelectedChallengesIds(newSelectedChallengesIds);

      await userChallengeCategoryStore.updateUserChallengeCategory({
        field: 'selectedChallengesIds',
        data: newSelectedChallengesIds,
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateSpecialChallenge = async ({
    id,
    value,
    field,
  }: {
    id: string;
    value: boolean;
    field: string;
  }) => {
    try {
      crashlytics().log('Updating special challenge.');

      await userChallengeCategoryStore.updateUserChallengeCategory({
        field: `selectedSpecialChallengesIds.${id}.${field}`,
        data: value,
      });
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
          return {...challenge, isSelected: newValue};
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
      crashlytics().log('Selecting challenge.');

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

      await this.updateSpecialChallenge({
        id,
        value: newValue,
        field: 'isSelected',
      });
      this.updateLocalSpecialChallenge({id, newValue});
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new ChallengeStore();
