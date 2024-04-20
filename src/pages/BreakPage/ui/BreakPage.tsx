import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import TherapistBlock from './TherapistBlock';

const BreakPage = () => {
  const colors = useColors();

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, [colors]);

  const letsDoThisPressHandler = () => {
    navigation.navigate(TabRoutesNames.CHALLENGES);
  };

  return (
    <View style={styles.BreakPage}>
      <View style={styles.topPart}>
        <AppText
          weight="900"
          style={textStyle}
          size={TextSize.SIZE_48}
          text={'WELL DONE!'}
        />
        <AppText
          style={[styles.description, textStyle]}
          size={TextSize.LEVEL_5}
          align={'center'}
          weight="500"
          text={
            'You have succefully mastered the question part. Wasnt that bad wasn’t it?'
          }
        />
      </View>

      <TherapistBlock />

      <View style={styles.bottomPart}>
        <AppText
          style={textStyle}
          size={TextSize.LEVEL_4}
          align={'center'}
          weight="500"
          text={
            'Master the upcoming challenge now to successfully complete this session.'
          }
        />
        <Button
          onPress={letsDoThisPressHandler}
          theme={ButtonTheme.NORMAL}
          style={[styles.btn, {backgroundColor: colors.white}]}>
          <GradientText
            size={TextSize.LEVEL_4}
            weight={'500'}
            text={'Let’s do this challenge'}
          />
        </Button>
      </View>
    </View>
  );
};

export default memo(BreakPage);

const textWidth = '90%';

const styles = StyleSheet.create({
  BreakPage: {
    flex: 1,
    alignItems: 'center',
  },
  topPart: {
    width: textWidth,
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  description: {
    marginTop: verticalScale(20),
  },
  bottomPart: {
    width: textWidth,
    alignItems: 'center',
    marginTop: verticalScale(25),
  },
  btn: {
    width: '96%',
    marginTop: verticalScale(20),
  },
});
