import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {observer} from 'mobx-react-lite';
import {SvgXml} from 'react-native-svg';
import {useFocusEffect} from '@react-navigation/native';

import {preSession} from '@src/shared/assets/images';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {windowWidth} from '@src/app/styles/GlobalStyle';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  PresSessionModal,
  QuadrantList,
  sessionStore,
} from '@src/entities/Session';
import {categoryStore} from '@src/entities/Category';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {getArrowDownIcon} from '@src/shared/assets/icons/ArrowDown';
import {useColors} from '@src/app/providers/colorsProvider';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {GradientArrowUpIcon} from '@src/shared/assets/icons/ArrowUp';
import {isPlatformIos} from '@src/shared/consts/common';
import {userStore} from '@src/entities/User';
import preSessionPageStore from '../model/store/PreSessionPageStore';

const PreSessionPage = () => {
  const language = useLanguage();
  const colors = useColors();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [visible, setVisible] = useState(false);

  const hasUserSubscription = userStore.getUserHasSubscription();

  const isLoading = preSessionPageStore.isPreSessionPageLoading;

  // get actula level information
  const currentLevelInfo = userStore.currentCategory;
  const levelName = currentLevelInfo?.currentCategory;
  const currentLevel = categoryStore.getCategoryByName(levelName);

  const currentQuadrantAndSession =
    preSessionPageStore.currentQuadrantAndSession;
  const currentQuadrantWithAllSessions =
    preSessionPageStore.currentQuadrantWithAllSessions;

  useFocusEffect(
    useCallback(() => {
      if (!currentLevel) {
        return;
      }

      preSessionPageStore.init(currentLevel.id);
    }, [currentLevel]),
  );

  const goToQuestions = useCallback(() => {
    if (!(currentQuadrantAndSession && currentLevel)) {
      return;
    }

    const currentSession = currentQuadrantAndSession.sessions[0];

    setVisible(false);
    sessionStore.selectSessionAndNavigate({session: currentSession});
  }, [currentQuadrantAndSession, currentLevel]);

  const image = (
    <View style={styles.imageWrapper}>
      <FastImage
        style={styles.image}
        resizeMode={'contain'}
        source={preSession}
      />
    </View>
  );

  const isLevelAndSessionsValid =
    currentLevel && currentQuadrantAndSession && currentQuadrantWithAllSessions;

  if (isLoading || !isLevelAndSessionsValid) {
    return (
      <View style={styles.PreSessionPage}>
        {image}
        <View style={styles.textWrapper}>
          <Skeleton height={20} width={horizontalScale(200)} />
          <View style={styles.skeleton}>
            <Skeleton height={30} width={horizontalScale(120)} />
          </View>
        </View>
        <QuadrantList
          withBottomSpace={false}
          quadrantList={[]}
          isLoading={true}
        />
      </View>
    );
  }

  const onCollapseHandler = () => {
    setIsCollapsed(prev => !prev);
  };

  const onBeginSessionPressHandler = () => {
    setVisible(true);
  };

  const disabled: boolean =
    categoryStore.isFirstLevel(currentLevel.id) &&
    sessionStore.isFirstQuadrant(currentQuadrantAndSession.id)
      ? false
      : !hasUserSubscription;

  return (
    <View style={styles.PreSessionPage}>
      {image}

      <View style={styles.textWrapper}>
        <AppText
          size={TextSize.LEVEL_2}
          text={'Your current intimacy level'}
          weight={'600'}
        />

        <AppText
          size={TextSize.LEVEL_9}
          text={currentLevel.displayName[language]}
          weight={'700'}
        />
      </View>

      <QuadrantList
        withBottomSpace={false}
        quadrantList={
          isCollapsed
            ? [currentQuadrantAndSession]
            : [currentQuadrantWithAllSessions]
        }
        isLoading={isLoading}
      />

      <Button onPress={onCollapseHandler} style={styles.seeAllSessionsWrapper}>
        <GradientText
          size={TextSize.LEVEL_3}
          weight={'600'}
          text={
            isCollapsed
              ? `See all sessions of ${currentQuadrantAndSession.displayName[language]}`
              : 'Collapse'
          }
        />
        <SvgXml
          xml={isCollapsed ? getArrowDownIcon(true) : GradientArrowUpIcon}
          style={styles.icon}
        />
      </Button>

      <Button
        disabled={disabled}
        onPress={onBeginSessionPressHandler}
        theme={ButtonTheme.GRADIENT}
        style={styles.btn}>
        <AppText
          style={{color: colors.bgQuinaryColor}}
          size={TextSize.LEVEL_4}
          weight={'600'}
          text={'Begin Session'}
        />
        <SvgXml
          xml={getArrowRightIcon({isGradient: false})}
          style={styles.icon}
          fill={colors.white}
        />
      </Button>

      <PresSessionModal
        onConfirm={goToQuestions}
        visible={visible}
        setVisible={setVisible}
      />
    </View>
  );
};

export default memo(observer(PreSessionPage));

const styles = StyleSheet.create({
  PreSessionPage: {
    flex: 1,
    top: -40,
  },
  imageWrapper: {
    width: windowWidth,
    left: -10,
  },
  image: {
    height: verticalScale(240),
  },
  textWrapper: {
    alignItems: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  icon: {
    height: horizontalScale(16),
    width: horizontalScale(14),
    marginLeft: horizontalScale(6),
    top: isPlatformIos ? 1 : 2,
  },
  seeAllSessionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: verticalScale(15),
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  skeleton: {
    marginTop: verticalScale(10),
  },
});
