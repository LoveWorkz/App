import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Gradient, GradientSize} from '@src/shared/ui/Gradient/Gradient';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {challengeStore, SpecialChallengeEnum} from '@src/entities/Challenge';
import SelfReflection from './ChallengeDetailsLayouts/SelfReflection/SelfReflection';
import VocabularyOfFeel from './ChallengeDetailsLayouts/VocabularyOfFeel/VocabularyOfFeel';
import ChallengeCardsPageStore from '../model/store/ChallengeCardsPageStore';

interface ChallengeCardsPageProps {
  route?: {
    params: {
      specialChallengeType: SpecialChallengeEnum;
    };
  };
}

const ChallengeCardsPage = (props: ChallengeCardsPageProps) => {
  const {route} = props;
  const specialChallengeType = route?.params?.specialChallengeType;
  const specialChallenge = challengeStore.specialChallenge;

  const colors = useColors();

  const challengeCardsData = useMemo(() => {
    if (!specialChallenge) {
      return [];
    }

    return [
      {
        type: 'intro',
        title: specialChallenge.title.en,
        description: specialChallenge.description.en,
      },
      ...specialChallenge.challengeCardsData,
    ];
  }, [specialChallenge]);

  if (!specialChallenge) {
    return <></>;
  }

  const currenctCategoryBlock =
    ChallengeCardsPageStore.currenctCategoryBlock || challengeCardsData[0].type;

  let content;

  switch (specialChallengeType) {
    case SpecialChallengeEnum.SELF_REFLECTION:
      content = (
        <SelfReflection
          challengeCardsData={challengeCardsData}
          specialChallenge={specialChallenge}
        />
      );
      break;
    case SpecialChallengeEnum.VOCABULARY_OF_FEEL:
      content = <VocabularyOfFeel challengeCardsData={challengeCardsData} />;
      break;
    default:
      content = (
        <SelfReflection
          challengeCardsData={challengeCardsData}
          specialChallenge={specialChallenge}
        />
      );
  }

  return (
    <View style={styles.ChallengeCardsPage}>
      <Gradient size={GradientSize.SMALL}>
        <AppText
          style={[styles.categoryBlock, {color: colors.white}]}
          weight={'700'}
          size={TextSize.LEVEL_5}
          text={currenctCategoryBlock}
        />
      </Gradient>
      <View>{content}</View>
    </View>
  );
};

export default memo(observer(ChallengeCardsPage));

const styles = StyleSheet.create({
  ChallengeCardsPage: {
    flex: 1,
  },
  categoryBlock: {
    textTransform: 'capitalize',
  },
});
