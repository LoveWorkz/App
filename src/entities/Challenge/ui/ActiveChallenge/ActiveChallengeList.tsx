import React, {memo, useCallback, useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {AppText} from '@src/shared/ui/AppText/AppText';
import {horizontalScale} from '@src/shared/lib/Metrics';
import HorizontalCarousel from '@src/shared/ui/HorizontalCarousel/HorizontalCarousel';
import {challengesStore} from '@src/pages/ChallengesPage';
import {SeeAll} from '@src/shared/ui/SeeAll/SeeAll';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {ActiveChallengeType} from '../../model/types/ChallengeTypes';
import {ActiveChallengeExample} from '../../model/lib/challenge';
import TrendingChallenge from './ActiveChallenge';
import {useTranslation} from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

interface TrendingChallengeWrapperProps {
  challenge: ActiveChallengeType;
  index: number;
  listLength: number;
  isLoading: boolean;
  isSeeAll: boolean;
}

const TrendingChallengeWrapper = memo(
  (props: TrendingChallengeWrapperProps) => {
    const {challenge, index, listLength, isSeeAll} = props;

    const isFirstElement = index === 0;
    const isLastElement = index === listLength - 1;

    let content = challenge && <TrendingChallenge {...props} />;

    const onPress = useCallback(() => {
      challengesStore.setChallengeTabIndex(1);
      navigation.navigate(TabRoutesNames.CHALLENGES);
    }, []);

    if (isSeeAll) {
      content = <SeeAll seeAllTheme="large" onPressHandler={onPress} />;
    }

    return (
      <View
        style={{
          marginLeft: horizontalScale(isFirstElement ? 20 : 15),
          marginRight: horizontalScale(isLastElement ? 20 : 0),
        }}>
        {content}
      </View>
    );
  },
);

interface ChallengeGroupProps {
  isLoading: boolean;
}

const TrendingChallengeList = (props: ChallengeGroupProps) => {
  const {isLoading} = props;
  const {t} = useTranslation();

  const trendingChallenges = challengesStore.activeChallenges;

  useEffect(() => {
    challengesStore.fetchActiveChallenges();
  },[])

  const trendingListWithMetadata = useMemo(() => {
    // this empty object is needed to add a "view all" block
    const listWithEmptyObject = [...trendingChallenges, {}];

    return listWithEmptyObject.map((item, i) => {
      const isLastElement: boolean = i === listWithEmptyObject.length - 1;

      return {
        challenge: item,
        isLoading,
        isHomeChallenge: true,
        index: i,
        listLength: listWithEmptyObject.length,
        isSeeAll: isLastElement,
      };
    });
  }, [isLoading, trendingChallenges]);

  if (isLoading) {
    return (
      <View>
        <TrendingChallenge isLoading challenge={ActiveChallengeExample} />
      </View>
    );
  }

  return (
    <View>
      {!isLoading && trendingChallenges.length > 0 && (
        <View style={styles.titleWrapper}>
          <AppText weight={'500'} text={t('common.active_challenges')} />
        </View>
      )}
      {trendingChallenges.length > 0 && (<HorizontalCarousel
        data={trendingListWithMetadata}
        Component={TrendingChallengeWrapper}
      />)}
    </View>
  );
};

export default memo(observer(TrendingChallengeList));

const styles = StyleSheet.create({
  titleWrapper: {
    marginBottom: horizontalScale(10),
    marginTop: horizontalScale(40),
  },
});