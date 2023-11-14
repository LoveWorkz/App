import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {getEntityExampleDataForSkeleton} from '@src/shared/lib/common';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {SpecialChallengeType} from '../../model/types/ChallengeTypes';
import {specialChallengeExample} from '../../model/lib/challenge';
import SpecialChallengeItem from '../ChallengeItem/SpecialChallengeItem';

interface SpecialChallengesListProps {
  isLoading: boolean;
  isChallengesLoading: boolean;
  challengesList: SpecialChallengeType[];
}

export const SpecialChallengesList = (props: SpecialChallengesListProps) => {
  const {isLoading, challengesList, isChallengesLoading} = props;
  const colors = useColors();
  const {t} = useTranslation();

  let challenges = challengesList;

  if (isLoading) {
    challenges = getEntityExampleDataForSkeleton({
      entity: specialChallengeExample,
      count: 5,
    }) as SpecialChallengeType[];
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
              <SpecialChallengeItem
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
