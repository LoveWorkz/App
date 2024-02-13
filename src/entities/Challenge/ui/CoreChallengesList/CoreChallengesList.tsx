import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';

import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {getEntityExampleDataForSkeleton} from '@src/shared/lib/common';
import ChallengeItem from '../ChallengeItem/ChallengeItem';
import {
  ChallengeGroupType,
  ChallengeType,
  SpecialChallengeType,
} from '../../model/types/ChallengeTypes';
import {challengeExample} from '../../model/lib/challenge';
import ChallengeGroup from '../ChallengeGroup/ChallengeGroup';

interface CoreChallengesListProps {
  isLoading: boolean;
  isChallengesLoading: boolean;
  challengeList: ChallengeType[];
}

export const renderChallenges = ({
  item,
  index,
  isCore,
}: {
  item: ChallengeType | SpecialChallengeType;
  index: number;
  isCore: boolean;
}) => {
  const isFirstElement = index === 0;

  if (isCore) {
    const challenge = item as ChallengeType;

    return (
      <View
        key={challenge.id}
        style={isFirstElement ? {} : styles.challengeItem}>
        <ChallengeItem
          challenge={challenge}
          text={challenge.description}
          id={challenge.id}
          isChecked={challenge.isChecked}
        />
      </View>
    );
  }

  const specailChallenge = item as SpecialChallengeType;

  return (
    <View
      key={specailChallenge.id}
      style={isFirstElement ? {} : styles.challengeItem}>
      <ChallengeItem
        specailChallenge={specailChallenge}
        text={specailChallenge.description}
        id={specailChallenge.id}
        isChecked={specailChallenge.isSelected}
      />
    </View>
  );
};

export const renderChallengeGroups = ({
  item,
  isLoading,
  isCore = false,
}: {
  item: ChallengeGroupType<ChallengeType[] | SpecialChallengeType[]>;
  isLoading: boolean;
  isCore?: boolean;
}) => {
  const list = item.challenges;

  return (
    <View style={styles.challengeGroupItem} key={item.id}>
      <ChallengeGroup
        isLoading={isLoading}
        title={item.name}
        description={item.description}>
        {list.length &&
          list.map((item, i) => renderChallenges({isCore, item, index: i}))}
      </ChallengeGroup>
    </View>
  );
};

const CoreChallengesList = (props: CoreChallengesListProps) => {
  const {isLoading, isChallengesLoading, challengeList} = props;
  const colors = useColors();
  const {t} = useTranslation();

  let coreChallengesList = challengeList;

  if (isLoading) {
    coreChallengesList = getEntityExampleDataForSkeleton({
      entity: challengeExample,
      count: 5,
    }) as ChallengeType[];
  }

  const coreChallengesGroupList: ChallengeGroupType<ChallengeType[]>[] = [
    {
      id: 'id_1',
      challenges: coreChallengesList,
      name: 'Routines 1',
      description: 'description 1',
    },
    {
      id: 'id_2',
      challenges: coreChallengesList,
      name: 'Routines 2',
      description: 'description 2',
    },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      {coreChallengesGroupList.length ? (
        coreChallengesGroupList.map(item =>
          renderChallengeGroups({
            item,
            isLoading: isLoading || isChallengesLoading,
            isCore: true,
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

export default memo(CoreChallengesList);

const styles = StyleSheet.create({
  challengeGroupItem: {
    marginBottom: verticalScale(20),
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
