import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {ChallengeIntroCard, challengeStore} from '@src/entities/Challenge';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {verticalScale} from '@src/shared/lib/Metrics';

const CoreChallengeDetailsPage = () => {
  const {i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;

  const coreChallenge = challengeStore.coreChallenge;
  if (!coreChallenge) {
    return <></>;
  }

  return (
    <View style={styles.CoreChallengeDetailsPage}>
      <View style={styles.cardWrapper}>
        <ChallengeIntroCard
          title={coreChallenge.title[language]}
          description={coreChallenge.description[language]}
        />
      </View>
    </View>
  );
};

export default memo(CoreChallengeDetailsPage);

const styles = StyleSheet.create({
  CoreChallengeDetailsPage: {
    flex: 1,
  },
  cardWrapper: {
    marginTop: verticalScale(20),
  },
});
