import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {observer} from 'mobx-react-lite';

import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {windowWidthMinusPaddings} from '@src/app/styles/GlobalStyle';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import {userStore} from '@src/entities/User';
import {homePageStore} from '../..';

interface QuickStartProps {
  isLoading: boolean;
}

const borderRadius = moderateScale(20);

const QuickStart = (props: QuickStartProps) => {
  const {isLoading} = props;
  const colors = useColors();

  const {hasUserCompletedAnySession} = userStore;
  const {homePageQuadrantName} = homePageStore;

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, []);

  const onPressHandler = () => {
    navigation.navigate(AppRouteNames.PRE_SESSION);
  };

  if (isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.layout, {backgroundColor: colors.white}]} />

      <View style={styles.titleWrapper}>
        <AppText
          size={TextSize.LEVEL_6}
          weight={'600'}
          text={
            hasUserCompletedAnySession
              ? 'See you next week?'
              : 'Start your journey now!'
          }
        />
      </View>

      <View style={styles.textWrapper}>
        <AppText
          weight={'600'}
          size={TextSize.LEVEL_4}
          text={`Focus: ${homePageQuadrantName}`}
        />
      </View>

      <Button
        onPress={onPressHandler}
        style={styles.btn}
        theme={ButtonTheme.GRADIENT}>
        <AppText
          style={textStyle}
          weight={'600'}
          size={TextSize.LEVEL_4}
          text={'Let’s dive into your session'}
        />
        <SvgXml
          xml={getArrowRightIcon({})}
          style={styles.arrowIcon}
          fill={colors.bgQuinaryColor}
        />
      </Button>
    </View>
  );
};

const containerStyles = {
  width: windowWidthMinusPaddings,
  borderRadius: borderRadius,
};

const styles = StyleSheet.create({
  container: {
    padding: horizontalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    ...containerStyles,
  },
  layout: {
    opacity: 0.15,
    position: 'absolute',
    top: 0,
    bottom: 0,
    lef: 0,
    right: 0,
    ...containerStyles,
  },
  titleWrapper: {
    marginBottom: horizontalScale(6),
  },
  textWrapper: {
    marginBottom: horizontalScale(10),
  },
  btn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    height: horizontalScale(15),
    width: horizontalScale(15),
    marginLeft: horizontalScale(10),
  },
});

export default memo(observer(QuickStart));
