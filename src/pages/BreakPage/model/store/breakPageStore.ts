import {makeAutoObservable} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {sessionStore} from '@src/entities/Session';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {
  challengeStore,
  ChallengeType,
  SpecialChallengeType,
} from '@src/entities/Challenge';
import {challengeGroupStore} from '@src/entities/ChallengeGroup';
import {categoryStore} from '@src/entities/Category';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';

class BreakPageStore {
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };

  letsDoThisPressHandler = async (language: LanguageValueType) => {
    try {
      crashlytics().log("Pressing let's do this button.");

      this.setIsLoading(true);

      const currentSessionChallenge = sessionStore.sessionChallenge;
      if (!currentSessionChallenge) {
        return;
      }

      if (currentSessionChallenge.isChallengeSpecial) {
        // fetch and set information for current special challenge

        await challengeGroupStore.fetchAllSpecialChallengesGroups();
        challengeStore.setSpecialChallenge(
          currentSessionChallenge as SpecialChallengeType,
        );
        navigation.navigate(AppRouteNames.SPECIAL_CHALLENGE_INTRO);
        return;
      }

      // fetch and set information for current core challenge

      const currentLevel = categoryStore.category;

      await challengeGroupStore.fetchAllCoreChallengesGroups();
      challengeStore.setCoreChallenge(currentSessionChallenge as ChallengeType);
      navigation.navigate(AppRouteNames.CORE_CHALLENGE_INTRO, {
        title: currentLevel
          ? `${currentLevel.displayName[language]} session`
          : '',
      });
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsLoading(false);
    }
  };
}

export default new BreakPageStore();
