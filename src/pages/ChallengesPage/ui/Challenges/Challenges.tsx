import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {
  Challenge,
  challengeExample,
  ChallengeType,
} from '@src/entities/Challenge';
import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {getEntityExampleDataForSkeleton} from '@src/shared/lib/common';
import challengesStore from '../../model/store/challengesStore';

interface ChallengeProps {
  isLoading: boolean;
}

export const Challenges = (props: ChallengeProps) => {
  const {isLoading} = props;
  let challenges = challengesStore.filteredChallengesList;
  const isChallengesLoading = challengesStore.isChallengesLoading;
  const colors = useColors();
  const {t} = useTranslation();

  if (isLoading) {
    challenges = getEntityExampleDataForSkeleton({
      entity: challengeExample,
      count: 5,
    }) as ChallengeType[];
  }

  return (
    <View>
      {challenges.length ? (
        challenges.map(challange => {
          return (
            <View style={styles.subChallengeWrappper} key={challange.id}>
              <Challenge
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

export default memo(observer(Challenges));

const styles = StyleSheet.create({
  subChallengeWrappper: {
    marginBottom: verticalScale(10),
  },
  noResults: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
});
