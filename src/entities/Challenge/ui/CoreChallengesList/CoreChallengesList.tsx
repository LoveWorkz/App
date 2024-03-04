import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {useColors} from '@src/app/providers/colorsProvider';
import ScrollViewWithoutIndicator from '@src/shared/ui/ScrollViewWithoutIndicator/ScrollViewWithoutIndicator';
import {
  ChallengeGroup,
  challengeGroupStore,
  ChallengeGroupType,
} from '@src/entities/ChallengeGroup';
import {challengesStore} from '@src/pages/ChallengesPage';
import ChallengeItem from '../ChallengeItem/ChallengeItem';
import {
  ChallengeType,
  SpecialChallengeType,
} from '../../model/types/ChallengeTypes';
import {
  getActiveChallengesCount,
  getChallengeGroupsFromUnlockedCategories,
} from '../../model/lib/challenge';

interface CoreChallengesListProps {
  isLoading: boolean;
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
          text={challenge.title}
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
        text={specailChallenge.title}
        id={specailChallenge.id}
        isChecked={specailChallenge.isSelected}
      />
    </View>
  );
};

export const renderChallengeGroups = ({
  item,
  isCore = false,
  language,
}: {
  item: ChallengeGroupType<ChallengeType[] | SpecialChallengeType[]>;
  isCore?: boolean;
  language: LanguageValueType;
}) => {
  const list = item.challenges;
  const activeChallengesCount = getActiveChallengesCount(list, isCore);

  return (
    <View style={styles.challengeGroupItem} key={item.id}>
      <ChallengeGroup
        activeChallengesCount={activeChallengesCount}
        challengesCount={list.length}
        title={item.displayName[language]}
        description={item.description[language]}>
        {!!list.length &&
          list.map((item, i) => renderChallenges({isCore, item, index: i}))}
      </ChallengeGroup>
    </View>
  );
};

const CoreChallengesList = (props: CoreChallengesListProps) => {
  const {isLoading, challengeList} = props;
  const colors = useColors();
  const {t, i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;
  const unlockedChallengeCategoryIds =
    challengesStore.unlockedChallengeCategoriesIds;

  const coreChallengesGroupList: ChallengeGroupType<ChallengeType[]>[] =
    challengeGroupStore.coreChallengeGroups;

  const formattedCoreChallengesGroupList = useMemo(() => {
    return getChallengeGroupsFromUnlockedCategories(
      coreChallengesGroupList,
      unlockedChallengeCategoryIds,
    );
  }, [coreChallengesGroupList, unlockedChallengeCategoryIds]);

  const coreChallengesList = useMemo(() => {
    return formattedCoreChallengesGroupList.map(group => {
      const challenges = challengeList.filter(
        item => item.groupId === group.id,
      );

      return {
        ...group,
        challenges,
      };
    });
  }, [formattedCoreChallengesGroupList, challengeList]);

  if (isLoading) {
    return (
      <>
        {[1, 2, 3, 4].map(item => (
          <View key={item} style={styles.skeleton}>
            <Skeleton width={'100%'} height={120} borderRadius={20} />
          </View>
        ))}
      </>
    );
  }

  return (
    <ScrollViewWithoutIndicator>
      {challengeList.length ? (
        coreChallengesList.map(item =>
          renderChallengeGroups({
            item,
            isCore: true,
            language,
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
    </ScrollViewWithoutIndicator>
  );
};

export default memo(observer(CoreChallengesList));

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
  skeleton: {
    marginBottom: verticalScale(10),
  },
});
