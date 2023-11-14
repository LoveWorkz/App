import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {getEntityExampleDataForSkeleton} from '@src/shared/lib/common';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import ChallengeItem from '../ChallengeItem/ChallengeItem';
import {ChallengeType} from '../../model/types/ChallengeTypes';
import {challengeExample} from '../../model/lib/challenge';

interface CoreChallengesListProps {
  isLoading: boolean;
  isChallengesLoading: boolean;
  challengesList: ChallengeType[];
}

export const CoreChallengesList = (props: CoreChallengesListProps) => {
  const {isLoading, challengesList, isChallengesLoading} = props;
  const colors = useColors();
  const {t} = useTranslation();

  let coreChallengesList = challengesList;

  if (isLoading) {
    coreChallengesList = getEntityExampleDataForSkeleton({
      entity: challengeExample,
      count: 5,
    }) as ChallengeType[];
  }

  return (
    <>
      {isLoading ? (
        <Skeleton width={150} height={20} />
      ) : (
        <AppText
          style={[styles.title, {color: colors.primaryTextColor}]}
          text={t('challenge.coreChallengeTitle')}
          weight={'500'}
          size={TextSize.LEVEL_5}
        />
      )}
      {coreChallengesList.length ? (
        coreChallengesList.map(challange => {
          return (
            <View style={styles.challengeItem} key={challange.id}>
              <ChallengeItem
                isLoading={isLoading || isChallengesLoading}
                challenge={challange}
              />
            </View>
          );
        })
      ) : (
        <View style={styles.noResults}>
          <AppText
            style={{color: colors.primaryTextColor}}
            text={t('noResults')}
            size={TextSize.LEVEL_7}
          />
        </View>
      )}
    </>
  );
};

export default memo(CoreChallengesList);

const styles = StyleSheet.create({
  title: {
    marginBottom: verticalScale(5),
  },
  challengeItem: {
    marginTop: verticalScale(10),
  },
  noResults: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
});
