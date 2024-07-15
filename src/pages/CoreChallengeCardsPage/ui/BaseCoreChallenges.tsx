import React, {
  memo,
  useCallback,
  useEffect,
  // useLayoutEffect,
  useMemo,
  useState,
} from 'react';
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
import {useRoute} from '@react-navigation/native';
// import {sessionStore} from '@src/entities/Session';
import {challengesStore} from '@src/pages/ChallengesPage';
import {CARD_WIDTH} from '@src/shared/consts/common';
import coreChallengeCardsPageStore from '../model/store/coreChallengeCardsPageStore';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';

interface BaseCoreChallengesProps {
  currentCoreChallengeGroup: ChallengeGroupType<ChallengeType[]>;
}

const BaseCoreChallenges = (props: BaseCoreChallengesProps) => {
  const {params} = useRoute();
  const {
    // isSessionFlow,
    currentCoreChallengeGroup,
  } = props;
  const headerCustomTitle = useMemo(() => params?.title, []);
  // const {currentCoreChallengeGroup} = props;
  const language = useLanguage();
  const handleSwipe = useCallback((challenge: ChallengeType) => {
    // console.log('E: ', challenge);
    challengeStore.coreChallengeCardsSwipeHandler(challenge);
  }, []);

  // console.log('PARAMS', params);

  // const {session} = sessionStore;
  const {challenges} = challengesStore;
  const coreChallengesList = useMemo(() => {
    // if (!(currentCoreChallengeGroup && session)) {
    if (!currentCoreChallengeGroup) {
      return [];
    }

    let filteredChallenges = [];

    // const {isCurrent, linkedCoreChallenge} = session;

    // if (isCurrent) {
    filteredChallenges = challenges.filter(
      challenge =>
        !challenge.isChecked &&
        challenge.groupId === currentCoreChallengeGroup.id,
    );
    // } else {
    // const sessionChallenge = challenges.find(
    // challenge => challenge.id === linkedCoreChallenge,
    // );
    // filteredChallenges = sessionChallenge ? [sessionChallenge] : [];
    // }

    return filteredChallenges.map(challenge => ({
      ...challenge,
      groupName: currentCoreChallengeGroup.displayName[language],
      // isSessionFlow: false,
      // isChallengeCompleted: !session?.isCurrent,
    }));
  }, [challenges, currentCoreChallengeGroup, language]);

  const defaultChallengeNumber = useMemo(() => {
    return challengeStore.getDefaultChallengeNumberForCardsPage({
      coreChallengesList,
    });
  }, [coreChallengesList]);

  const [currentPosition, setCurrentPosition] = useState(
    defaultChallengeNumber,
  );

  // console.log('defaultChallengeNumber', defaultChallengeNumber);

  // useLayoutEffect(() => {
  //   navigation.navigate(AppRouteNames.CORE_CHALLENGE_CARDS, {
  //     title: `${headerCustomTitle} ${defaultChallengeNumber}/${coreChallengesList.length}`,
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [defaultChallengeNumber]);

  useEffect(() => {
    navigation.navigate(AppRouteNames.CORE_CHALLENGE_CARDS, {
      title: `${headerCustomTitle} ${currentPosition}/${coreChallengesList.length}`,
    });
  }, [currentPosition, headerCustomTitle]);

  useEffect(() => {
    if (!currentCoreChallengeGroup) {
      return;
    }

    // TODO: Initi session flow - something is here

    coreChallengeCardsPageStore.initSessionFlow({
      coreChallengesList,
      currentCoreChallengeGroupId: currentCoreChallengeGroup.id,
    });

    return () => {
      challengeStore.clearForm();
    };
  }, [coreChallengesList, currentCoreChallengeGroup]);

  const {coreChallenge} = challengeStore;
  console.log('CORE CHALLENGE', coreChallenge);
  if (!coreChallenge) {
    return <></>;
  }

  // console.log('CORE: ', coreChallengesList);

  // console.log('defaultChallengeNumber', defaultChallengeNumber);

  return (
    <View style={styles.BaseCoreChallenges}>
      {/* <CoreChallengeIntroCardWrapper
        isSessionFlow={false}
        id={coreChallenge.id}
        description={coreChallenge.description}
        groupId={currentCoreChallengeGroup.id}
        groupName={currentCoreChallengeGroup.displayName[language]}
      />
      <CoreChallengeCardsFooter /> */}
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
