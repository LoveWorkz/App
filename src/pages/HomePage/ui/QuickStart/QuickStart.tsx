import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {observer} from 'mobx-react-lite';

import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  getShadowOpacity,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {
  homeCategoryImage,
  homeCategoryImageDark,
} from '@src/shared/assets/images';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {userStore} from '@src/entities/User';
import {sessionStore} from '@src/entities/Session';
import homePageStore from '../../model/store/HomePageStore';

interface QuickStartProps {
  isLoading: boolean;
  language: LanguageValueType;
}

const height = 92;
const borderRadius = 20;

const QuickStart = (props: QuickStartProps) => {
  const {isLoading, language} = props;
  const {t} = useTranslation();
  const colors = useColors();
  const {theme} = useTheme();

  const sessionsCount = sessionStore.getUserSessionsCount();

  if (isLoading) {
    return (
      <View style={styles.QuickStart}>
        <View style={styles.quickStartTitleSkeleton}>
          <Skeleton width={120} height={15} />
        </View>
        <Skeleton
          width={windowWidthMinusPaddings}
          height={height}
          borderRadius={borderRadius}
        />
      </View>
    );
  }

  const currentSession = sessionStore.session;
  const user = userStore.user;
  if (!(user && currentSession)) {
    return <></>;
  }
  const isFirstUserVisit = !user.hasUserSwipedAnyQuestion;

  const onPressHandler = () => {
    homePageStore.goToQuestionsPage({isFirstUserVisit, language});
  };

  return (
    <View style={styles.QuickStart}>
      <AppText
        style={[styles.quickStartTitle, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={isFirstUserVisit ? t('home.start_game') : t('home.quick_start')}
        weight={'500'}
      />
      <View style={{...getShadowOpacity(theme).shadowOpacity_level_2}}>
        <FastImage
          resizeMode={'cover'}
          style={[
            styles.container,
            {
              backgroundColor: colors.bgTertiaryColor,
              ...getShadowOpacity(theme).shadowOpacity_level_2,
            },
          ]}
          source={
            theme === Theme.Dark ? homeCategoryImageDark : homeCategoryImage
          }>
          <View style={styles.content}>
            <View style={styles.textWrapper}>
              <AppText
                style={{color: colors.homePageCategoryTitleColor}}
                size={TextSize.LEVEL_2}
                text={
                  isFirstUserVisit
                    ? t('home.start_your_sessions_here')
                    : t('home.continue_where_you_left_off')
                }
              />
              <GradientText
                weight={'700'}
                text={`${
                  isFirstUserVisit ? 0 : currentSession.sessionNumber
                }/${sessionsCount}`}
              />
            </View>
            <View style={styles.bottomBlock}>
              <AppText
                style={[styles.categoryName, {color: colors.primaryTextColor}]}
                weight={'700'}
                size={TextSize.LEVEL_5}
                text={
                  isFirstUserVisit
                    ? t('home.start_your_journey')
                    : homePageStore.quickStartCategoryName
                }
              />
              <Button
                onPress={onPressHandler}
                style={styles.btn}
                theme={ButtonTheme.GRADIENT}>
                <SvgXml
                  xml={getArrowRightIcon({})}
                  style={styles.arrowIcon}
                  fill={colors.bgQuinaryColor}
                />
              </Button>
            </View>
          </View>
        </FastImage>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  QuickStart: {
    width: windowWidthMinusPaddings,
  },
  container: {
    height: height,
    borderRadius: borderRadius,
    justifyContent: 'center',
  },
  content: {
    padding: 15,
  },
  quickStartTitle: {
    marginBottom: 20,
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBlock: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    fontSize: 18,
    fontWeight: '700',
  },
  btn: {
    borderRadius: 10,
    height: 30,
    width: 30,
  },
  arrowIcon: {
    height: 15,
    width: 15,
  },
  categoryName: {
    textTransform: 'uppercase',
  },

  quickStartTitleSkeleton: {
    marginBottom: 20,
  },
});

export default memo(observer(QuickStart));
