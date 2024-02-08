import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {userChallengeCategoryStore} from '@src/entities/UserChallengeCategory';
import {challengesStore} from '@src/pages/ChallengesPage';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {ChallengeType, SpecialChallengeType} from '../types/ChallengeTypes';

class ChallengeStore {
  specialChallenge: SpecialChallengeType | null = null;
  coreChallenge: ChallengeType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setSpecialChallenge = (specialChallenge: SpecialChallengeType) => {
    this.specialChallenge = specialChallenge;
  };

  setCoreChallenge = (coreChallenge: ChallengeType) => {
    this.coreChallenge = coreChallenge;
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

  updateLocalChallenge = (id: string) => {
    const newChallenges = challengesStore.challenges.map(challenge => {
      if (challenge.id === id) {
        return {...challenge, isChecked: !challenge.isChecked};
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

  selectChallenge = async ({id}: {id: string}) => {
    try {
      crashlytics().log('Selecting challenge.');

      await this.updateChallenge(id);
      this.updateLocalChallenge(id);
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
