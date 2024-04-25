import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';

import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {Gradient, GradientSize} from '@src/shared/ui/Gradient/Gradient';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  ChallengeIntroCard,
  challengeStore,
  SpecialChallengeEnum,
} from '@src/entities/Challenge';
import SelfReflection from './ChallengeDetailsLayouts/SelfReflection/SelfReflection';
import VocabularyOfFeel from './ChallengeDetailsLayouts/VocabularyOfFeel/VocabularyOfFeel';
import challengeCardsPageStore from '../model/store/challengeCardsPageStore';
import WalkOfGratitude from './ChallengeDetailsLayouts/WalkOfGratitude/WalkOfGratitude';
import SelfReflectionMyOwnNeeds from './ChallengeDetailsLayouts/SelfReflectionMyOwnNeeds/SelfReflectionMyOwnNeeds';
import KnowEachOtherBetter from './ChallengeDetailsLayouts/knowEachOtherBetter/KnowEachOtherBetter';
import TenDaysChallenge from './ChallengeDetailsLayouts/TenDaysChallenge/TenDaysChallenge';
import EffectiveApologies from './ChallengeDetailsLayouts/EffectiveApologies/EffectiveApologies';
import RapidCalming from './ChallengeDetailsLayouts/RapidCalming/RapidCalming';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';

interface ChallengeCardsPageProps {
  route?: {
    params: {
      specialChallengeType: SpecialChallengeEnum;
    };
  };
}

const ChallengeCardsPage = (props: ChallengeCardsPageProps) => {
  // const {route} = props;
  // const specialChallengeType = route?.params?.specialChallengeType;
  // const specialChallenge = challengeStore.specialChallenge;

  // const colors = useColors();
  // const {i18n} = useTranslation();
  // const language = i18n.language as LanguageValueType;

  // const challengeCardsData = useMemo(() => {
  //   if (!specialChallenge) {
  //     return [];
  //   }

  //   return [
  //     {
  //       type: 'intro',
  //       title: specialChallenge.title[language],
  //       description: specialChallenge.description[language],
  //       multiDescription: specialChallenge.multiDescription,
  //     },
  //     ...specialChallenge.challengeCardsData,
  //   ];
  // }, [specialChallenge, language]);

  // if (!specialChallenge) {
  //   return <></>;
  // }

  // const currenctCategoryBlock =
  //   challengeCardsPageStore.currenctCategoryBlock || challengeCardsData[0].type;

  // let content;

  // switch (specialChallengeType) {
  //   case SpecialChallengeEnum.SELF_REFLECTION:
  //     content = (
  //       <SelfReflection
  //         challengeCardsData={challengeCardsData}
  //         specialChallenge={specialChallenge}
  //       />
  //     );
  //     break;
  //   case SpecialChallengeEnum.VOCABULARY_OF_FEEL:
  //     content = <VocabularyOfFeel challengeCardsData={challengeCardsData} />;
  //     break;
  //   case SpecialChallengeEnum.WALK_OF_GRATITUDE:
  //     content = <WalkOfGratitude challengeCardsData={challengeCardsData} />;
  //     break;
  //   case SpecialChallengeEnum.SELF_REFLECTION_MY_OWN_NEEDS:
  //     content = (
  //       <SelfReflectionMyOwnNeeds challengeCardsData={challengeCardsData} />
  //     );
  //     break;
  //   case SpecialChallengeEnum.KNOW_EACH_OTHER_BETTER:
  //     content = <KnowEachOtherBetter challengeCardsData={challengeCardsData} />;
  //     break;
  //   case SpecialChallengeEnum.TEN_DAYS_CHALLENGE:
  //     content = <TenDaysChallenge challengeCardsData={challengeCardsData} />;
  //     break;
  //   case SpecialChallengeEnum.EFFECTIVE_APOLOGIES:
  //     content = <EffectiveApologies challengeCardsData={challengeCardsData} />;
  //     break;
  //   case SpecialChallengeEnum.RAPID_CALMING:
  //     content = <RapidCalming challengeCardsData={challengeCardsData} />;
  //     break;
  //   default:
  //     content = <View />;
  // }

  return (
    <View style={styles.ChallengeCardsPage}>
      {/* <Gradient size={GradientSize.SMALL}>
        <AppText
          style={[styles.categoryBlock, {color: colors.white}]}
          weight={'700'}
          size={TextSize.LEVEL_5}
          text={currenctCategoryBlock}
        />
      </Gradient> */}
      {/* <View>{content}</View> */}
      <EffectiveApologies />
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
