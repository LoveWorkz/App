import React, {
  memo,
  useCallback,
  useEffect,
  // useLayoutEffect,
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
import {RouteProp, useRoute} from '@react-navigation/native';
// import {sessionStore} from '@src/entities/Session';
import {challengesStore} from '@src/pages/ChallengesPage';
import {CARD_WIDTH} from '@src/shared/consts/common';
// import coreChallengeCardsPageStore from '../model/store/coreChallengeCardsPageStore';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
// import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
// import {AppText, TextSize, TextType} from '@src/shared/ui/AppText/AppText';
// import {SvgXml} from 'react-native-svg';
// import {CheckIcon} from '@src/shared/assets/icons/Check';
// import {useColors} from '@src/app/providers/colorsProvider';

interface BaseCoreChallengesProps {
  currentCoreChallengeGroup: ChallengeGroupType<ChallengeType[]>;
}

const BaseCoreChallenges = (props: BaseCoreChallengesProps) => {
  const {params} = useRoute<RouteProp<{params: {title: string}}>>();
  const {
    // isSessionFlow,
    currentCoreChallengeGroup,
  } = props;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headerCustomTitle = useMemo(() => params?.title, []);
  const language = useLanguage();
  const handleSwipe = useCallback((challenge: ChallengeType) => {
    challengeStore.coreChallengeCardsSwipeHandler(challenge);
  }, []);

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
      challenge => challenge.groupId === currentCoreChallengeGroup.id,
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

  useEffect(() => {
    challengeStore.setCoreChallenge(
      coreChallengesList[defaultChallengeNumber - 1],
    );
  }, [coreChallengesList, defaultChallengeNumber]);

  useEffect(() => {
    navigation.navigate(AppRouteNames.CORE_CHALLENGE_CARDS, {
      title: `${headerCustomTitle} ${currentPosition}/${coreChallengesList.length}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition, headerCustomTitle]);

  useEffect(() => {
    challengeStore.coreChallengeCardsSwipeHandler(
      coreChallengesList[defaultChallengeNumber - 1],
    );
  }, [coreChallengesList, defaultChallengeNumber]);

  useEffect(() => {
    if (!currentCoreChallengeGroup) {
      return;
    }

    // TODO: Initi session flow - something is here

    // coreChallengeCardsPageStore.initSessionFlow({
    //   coreChallengesList,
    //   currentCoreChallengeGroupId: currentCoreChallengeGroup.id,
    // });

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
      {/* <CoreChallengeCardsFooter
        currentIndex={currentPosition - 1}
        count={coreChallengesList.length}
      /> */}
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
