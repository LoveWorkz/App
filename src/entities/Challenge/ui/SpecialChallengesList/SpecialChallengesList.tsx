import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import { observer } from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import ScrollViewWithoutIndicator from '@src/shared/ui/ScrollViewWithoutIndicator/ScrollViewWithoutIndicator';
import { challengesStore } from '@src/pages/ChallengesPage';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import { challengeGroupStore } from '@src/entities/ChallengeGroup';
import { getChallengeGroupsFromUnlockedCategories } from '../../model/lib/challenge';
import {renderChallengeGroups} from '../CoreChallengesList/CoreChallengesList';
import {
  SpecialChallengeType,
} from '../../model/types/ChallengeTypes';

interface SpecialChallengesListProps {
  isLoading: boolean;
  challengeList: SpecialChallengeType[];
}

const SpecialChallengesList = (props: SpecialChallengesListProps) => {
  const {isLoading, challengeList} = props;
  const colors = useColors();
  const {t, i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;
  const unlockedChallengeCategoryIds =
  challengesStore.unlockedChallengeCategoriesIds;

  const activeChallengesCount = challengeList.filter(
    item => item.isSelected,
  ).length

  const specailChallengesGroupList = challengeGroupStore.specialChallengeGroups;

  const formattedSpecialChallengesGroupList = useMemo(() => {
    return getChallengeGroupsFromUnlockedCategories(
      specailChallengesGroupList,
      unlockedChallengeCategoryIds,
    );
  }, [specailChallengesGroupList, unlockedChallengeCategoryIds]);

  const specialChallengesList = useMemo(() => {
    return formattedSpecialChallengesGroupList.map(group => {
      const challenges = challengeList.filter(
        item => item.groupId === group.id,
      );

      return {
        ...group,
        challenges,
      };
    });
  }, [formattedSpecialChallengesGroupList, challengeList]);

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
      {specialChallengesList.length ? (
        specialChallengesList.map(item =>
          renderChallengeGroups({
            item,
            activeChallengesCount,
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

export default memo(observer(SpecialChallengesList));

const styles = StyleSheet.create({
  SpecialChallengesList: {
    marginBottom: verticalScale(10),
  },
  noResults: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeleton: {
    marginBottom: verticalScale(10),
  },
});
