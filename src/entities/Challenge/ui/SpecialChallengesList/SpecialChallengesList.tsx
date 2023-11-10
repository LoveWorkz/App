import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {getEntityExampleDataForSkeleton} from '@src/shared/lib/common';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import ChallengeItem, {ChallengeTheme} from '../ChallengeItem';
import {ChallengeType} from '../../model/types/ChallengeTypes';
import {challengeExample} from '../../model/lib/challenge';

interface SpecialChallengesListProps {
  isLoading: boolean;
  isChallengesLoading: boolean;
  challengesList: ChallengeType[];
}

export const SpecialChallengesList = (props: SpecialChallengesListProps) => {
  const {isLoading, challengesList, isChallengesLoading} = props;
  const colors = useColors();
  const {t} = useTranslation();

  let challenges = challengesList;

  if (isLoading) {
    challenges = getEntityExampleDataForSkeleton({
      entity: challengeExample,
      count: 5,
    }) as ChallengeType[];
  }

  return (
    <View>
      {isLoading ? (
        <View style={styles.title}>
          <Skeleton width={150} height={20} />
        </View>
      ) : (
        <AppText
          style={[styles.title, {color: colors.primaryTextColor}]}
          text={t('challenge.specialChallengeTitle')}
          weight={'500'}
          size={TextSize.LEVEL_5}
        />
      )}
      {challenges.length ? (
        challenges.map(challange => {
          return (
            <View style={styles.SpecialChallengesList} key={challange.id}>
              <ChallengeItem
                challengeTheme={ChallengeTheme.SPECIAL}
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
    </View>
  );
};

export default memo(observer(SpecialChallengesList));

const styles = StyleSheet.create({
  SpecialChallengesList: {
    marginBottom: verticalScale(10),
  },
  title: {
    marginBottom: verticalScale(20),
  },
  noResults: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
