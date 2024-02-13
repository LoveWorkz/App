import React, {memo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {getEntityExampleDataForSkeleton} from '@src/shared/lib/common';
import {
  ChallengeGroupType,
  SpecialChallengeType,
} from '../../model/types/ChallengeTypes';
import {specialChallengeExample} from '../../model/lib/challenge';
import {renderChallengeGroups} from '../CoreChallengesList/CoreChallengesList';

interface SpecialChallengesListProps {
  isLoading: boolean;
  isChallengesLoading: boolean;
  challengeList: SpecialChallengeType[];
}

const SpecialChallengesList = (props: SpecialChallengesListProps) => {
  const {isLoading, isChallengesLoading, challengeList} = props;
  const colors = useColors();
  const {t} = useTranslation();

  let specailChallenges = challengeList;

  if (isLoading) {
    specailChallenges = getEntityExampleDataForSkeleton({
      entity: specialChallengeExample as SpecialChallengeType,
      count: 5,
    }) as SpecialChallengeType[];
  }

  const specailChallengesGroupList: ChallengeGroupType<
    SpecialChallengeType[]
  >[] = [
    {
      id: 'id_1',
      challenges: specailChallenges,
      name: 'Routines 1',
      description: 'description 1',
    },
    {
      id: 'id_2',
      challenges: specailChallenges,
      name: 'Routines 2',
      description: 'description 2',
    },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      {specailChallengesGroupList.length ? (
        specailChallengesGroupList.map(item =>
          renderChallengeGroups({
            item,
            isLoading: isLoading || isChallengesLoading,
          }),
        )
      ) : (
        <View style={styles.noResults}>
          <AppText
            style={{color: colors.primaryTextColor}}
            text={t('noResults')}
            size={TextSize.LEVEL_7}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default memo(SpecialChallengesList);

const styles = StyleSheet.create({
  SpecialChallengesList: {
    marginBottom: verticalScale(10),
  },
  noResults: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
