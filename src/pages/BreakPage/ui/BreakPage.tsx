import React, {memo, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {StyleSheet, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import { useLanguage } from '@src/shared/lib/hooks/useLanguage';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import TherapistBlock from './TherapistBlock';
import breakPageStore from '../model/store/breakPageStore';

const BreakPage = () => {
  const colors = useColors();
  const language = useLanguage();
  const isLoading = breakPageStore.isLoading;

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, [colors]);

  const onPressHandler = () => {
    breakPageStore.letsDoThisPressHandler(language);
  }

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
          disabled={isLoading}
          onPress={onPressHandler}
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

export default memo(observer(BreakPage));

const textWidth = '90%';

const styles = StyleSheet.create({
  BreakPage: {
    flex: 1,
    alignItems: 'center',
  },
  topPart: {
    width: textWidth,
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  description: {
    marginTop: verticalScale(20),
  },
  bottomPart: {
    width: textWidth,
    position: 'absolute',
    bottom: verticalScale(0),
    alignItems: 'center',
  },
  btn: {
    width: '96%',
    marginTop: verticalScale(20),
  },
});
