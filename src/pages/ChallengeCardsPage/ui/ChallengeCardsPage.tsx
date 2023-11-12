import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {ChallengeCardsList} from '@src/entities/Challenge';
import {Gradient, GradientSize} from '@src/shared/ui/Gradient/Gradient';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';

interface ChallengeCardsPageProps {}

const ChallengeCardsPage = (props: ChallengeCardsPageProps) => {
  const {} = props;

  const colors = useColors();

  return (
    <View style={styles.ChallengeCardsPage}>
      <Gradient size={GradientSize.SMALL}>
        <AppText
          style={{color: colors.white}}
          weight={'700'}
          size={TextSize.LEVEL_5}
          text={'Intro'}
        />
      </Gradient>
      <ChallengeCardsList />
    </View>
  );
};

export default memo(ChallengeCardsPage);

const styles = StyleSheet.create({
  ChallengeCardsPage: {
    flex: 1,
  },
});
