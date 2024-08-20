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
import {ordinalSuffixOf} from '@src/shared/lib/common';
import {homePageStore} from '../..';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@src/app/providers/themeProvider';

interface QuickStartProps {
  isLoading: boolean;
}

const borderRadius = moderateScale(20);

const QuickStart = (props: QuickStartProps) => {
  const {isLoading} = props;
  const colors = useColors();
  const {t} = useTranslation();
  const {isDark} = useTheme();

  const {hasUserCompletedAnySession} = userStore;
  const {homePageQuadrantName, homePageCategory} = homePageStore;

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, [colors.white]);

  const onPressHandler = () => {
    navigation.navigate(AppRouteNames.PRE_SESSION);
  };

  if (isLoading) {
    return null;
  }

  let textContent = '';
  if (hasUserCompletedAnySession && homePageCategory) {
    textContent = `${t('common.for_the')} ${ordinalSuffixOf(
      homePageCategory.currentSessionNumber,
    )} ${t('common.of')} ${homePageCategory.allSessionsCount} ${t(
      'sessions.sessions',
    )}`;
  } else {
    textContent = `${t('common.focus')}: ${homePageQuadrantName}`;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.layout,
          {backgroundColor: colors.white, opacity: isDark ? 0.05 : 0.15},
        ]}
      />

      <View style={styles.titleWrapper}>
        <AppText
          size={TextSize.LEVEL_6}
          weight={'600'}
          text={
            hasUserCompletedAnySession
              ? t('common.see_you_next_week')
              : t('common.start_your_journey_now')
          }
        />
      </View>

      <View style={styles.textWrapper}>
        <AppText weight={'600'} size={TextSize.LEVEL_4} text={textContent} />
      </View>

      <Button
        onPress={onPressHandler}
        style={styles.btn}
        theme={ButtonTheme.GRADIENT}>
        <AppText
          style={textStyle}
          weight={'600'}
          size={TextSize.LEVEL_4}
          text={
            hasUserCompletedAnySession
              ? t('common.naah_lets_do_it_now')
              : t('common.lets_dive_into_your_session')
          }
        />
        <SvgXml
          xml={getArrowRightIcon({})}
          style={styles.arrowIcon}
          fill={isDark ? colors.white : colors.bgQuinaryColor}
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
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
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
