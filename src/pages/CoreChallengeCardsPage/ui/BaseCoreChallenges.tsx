import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {
  challengeStore,
  ChallengeType,
  CoreChallengeIntroCardWrapper,
  CoreChallengeCardsFooter,
} from '@src/entities/Challenge';
import {verticalScale} from '@src/shared/lib/Metrics';
import {ChallengeGroupType} from '@src/entities/ChallengeGroup';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {RouteProp, useRoute} from '@react-navigation/native';
import {challengesStore} from '@src/pages/ChallengesPage';
import {CARD_WIDTH} from '@src/shared/consts/common';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {favoriteStore} from '@src/entities/Favorite';
import {ChallengeCategoryType} from '@src/entities/ChallengeCategory';

interface BaseCoreChallengesProps {
  currentCoreChallengeGroup: ChallengeGroupType<ChallengeType[]>;
  isFavorite?: boolean;
}

const BaseCoreChallenges = (props: BaseCoreChallengesProps) => {
  const {params} =
    useRoute<RouteProp<{params: {title: string; isFavorite?: boolean}}>>();
  const {currentCoreChallengeGroup} = props;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headerCustomTitle = useMemo(() => params?.title, []);
  const language = useLanguage();
  const handleSwipe = useCallback((challenge: ChallengeType) => {
    challengeStore.coreChallengeCardsSwipeHandler(challenge);
  }, []);
  // const challenges = challengesStore.challenges;
  const {challenges} = challengesStore;
  const coreChallengeFavorites = favoriteStore.coreChallengeFavorites;
  const activeCategory = challengesStore.challengeCategories.find(
    challengeCategory => challengeCategory.isActive,
  ) as ChallengeCategoryType;

  const favoriteCoreChallengesList = challenges.filter(challenge =>
    (coreChallengeFavorites?.ids || []).includes(challenge.id),
  );

  const coreChallengesList = useMemo(() => {
    if (props.isFavorite) {
      return favoriteCoreChallengesList;
    }

    if (!currentCoreChallengeGroup) {
      return [];
    }

    let filteredChallenges = [];

    let filter = (challenge: ChallengeType) => {
      if (activeCategory.id !== 'challenge_category_1') {
        return (
          challenge.groupId === currentCoreChallengeGroup.id &&
          challenge.categoryId === activeCategory.id
        );
      }
      return challenge.groupId === currentCoreChallengeGroup.id;
    };

    filteredChallenges = challenges.filter(filter);

    return filteredChallenges.map(challenge => ({
      ...challenge,
      groupName: currentCoreChallengeGroup.displayName[language],
    }));
  }, [
    challenges,
    currentCoreChallengeGroup,
    favoriteCoreChallengesList,
    language,
    props.isFavorite,
  ]);

  const defaultChallengeNumber = useMemo(() => {
    return challengeStore.getDefaultChallengeNumberForCardsPage({
      coreChallengesList,
    });
  }, [coreChallengesList]);

  const [currentPosition, setCurrentPosition] = useState(
    defaultChallengeNumber,
  );

  useEffect(() => {
    challengeStore.setCoreChallenge(
      coreChallengesList[defaultChallengeNumber - 1],
    );
    challengeStore.coreChallengeCardsSwipeHandler(
      coreChallengesList[defaultChallengeNumber - 1],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultChallengeNumber]);

  useEffect(() => {
    if (!props.isFavorite) {
      navigation.navigate(AppRouteNames.CORE_CHALLENGE_CARDS, {
        title: `${headerCustomTitle} ${defaultChallengeNumber}/${coreChallengesList.length}`,
        isFavorite: params?.isFavorite,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultChallengeNumber, headerCustomTitle, props.isFavorite]);

  useEffect(() => {
    if (!currentCoreChallengeGroup) {
      return;
    }

    return () => {
      challengeStore.clearForm();
    };
  }, [coreChallengesList, currentCoreChallengeGroup]);

  const {coreChallenge} = challengeStore;
  if (!coreChallenge) {
    return <></>;
  }

  return (
    <View style={styles.BaseCoreChallenges}>
      <HorizontalSlide
        onSwipeHandler={handleSwipe}
        onScrollEnd={index => setCurrentPosition(index + 1)}
        defaultElement={defaultChallengeNumber}
        data={coreChallengesList}
        Component={CoreChallengeIntroCardWrapper}
        isSlideEnabled
        itemWidth={CARD_WIDTH}
        Footer={CoreChallengeCardsFooter}
        showLength={4}
        opacityInterval={0.3}
      />
    </View>
  );
};

export default memo(observer(BaseCoreChallenges));

const styles = StyleSheet.create({
  BaseCoreChallenges: {
    flex: 1,
    marginTop: verticalScale(50),
    alignItems: 'center',
  },
});
