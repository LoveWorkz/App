import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {GoalsList} from '@src/entities/Goal';
import {GradientArrowButton} from '@src/shared/ui/GradientArrowButton/GradientArrowButton';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {verticalScale} from '@src/shared/lib/Metrics';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {isPlatformIos} from '@src/shared/consts/common';
import {onboardingStyles, onboardingWidth} from '../../styles';

const GoalsPage = () => {
  const {t} = useTranslation();

  const onProceedHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.ONBOARDING_NOTIFICATIONS);
  }, []);

  return (
    <View style={styles.GoalsPage}>
      <View style={styles.titleWrapper}>
        <AppText
          size={TextSize.LEVEL_7}
          weight={'700'}
          text={`${t('lets_do_this')}!`}
        />
      </View>
      <AppText
        size={TextSize.LEVEL_5}
        weight={'500'}
        text={t('onboarding.goal.description')}
      />
      <View style={styles.listWrapper}>
        <GoalsList />
      </View>
      <View style={styles.btnWrapper}>
        <GradientArrowButton
          text={t('proceed')}
          onPressHandler={onProceedHandler}
        />
      </View>
    </View>
  );
};

export default memo(GoalsPage);

const paddingTop = verticalScale(isPlatformIos ? 60 : 10);

const styles = StyleSheet.create({
  GoalsPage: {
    flex: 1,
    alignItems: 'center',
    paddingTop,
  },
  titleWrapper: {
    marginBottom: verticalScale(15),
  },
  listWrapper: {
    width: '100%',
    height: '77%',
    marginTop: verticalScale(25),
  },
  btnWrapper: {
    ...onboardingStyles.bottomSide,
    width: onboardingWidth,
    marginTop: verticalScale(10),
  },
});
