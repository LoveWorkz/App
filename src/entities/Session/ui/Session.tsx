import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {UnlockedIcon} from '@src/shared/assets/icons/Unlocked';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {LockedIcon} from '@src/shared/assets/icons/Locked';
import {SessionType} from '../model/types/sessionType';
import sessionStore from '../model/store/sessionStore';

interface SessionProps {
  count: string;
  isLocked: boolean;
  session: SessionType;
  categoryId?: string;
  isLoading?: boolean;
}

const sessionHeight = 60;
const sessionBorderRadius = 20;

const Session = (props: SessionProps) => {
  const {count, isLocked, session, categoryId, isLoading = false} = props;

  const colors = useColors();
  const {theme} = useTheme();
  const {t} = useTranslation();

  const onPressHandler = () => {
    sessionStore.selectSession({session, categoryId});
  };

  if (isLoading) {
    return (
      <Skeleton
        width={'100%'}
        height={sessionHeight}
        borderRadius={sessionBorderRadius}
      />
    );
  }

  return (
    <Pressable onPress={onPressHandler} style={styles.wrapper}>
      <View>
        <SvgXml
          xml={isLocked ? LockedIcon : UnlockedIcon}
          style={[styles.icon, isLocked ? styles.lockIcon : {}]}
        />
      </View>
      <View
        style={[
          styles.Session,
          {
            ...getShadowOpacity(theme).shadowOpacity_level_2,
            backgroundColor: colors.bgSecondaryColor,
          },
        ]}>
        <View style={styles.textWrapper}>
          <AppText
            style={[styles.text, {color: colors.primaryTextColor}]}
            weight={'500'}
            size={TextSize.LEVEL_5}
            text={t('sessions.session')}
          />
          <AppText
            style={{color: colors.primaryTextColor}}
            weight={'500'}
            size={TextSize.LEVEL_5}
            text={count}
          />
        </View>
        <SvgXml
          xml={getArrowRightIcon({isGradient: true})}
          style={styles.arrowIcon}
        />
      </View>
    </Pressable>
  );
};

export default memo(Session);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Session: {
    height: sessionHeight,
    borderRadius: sessionBorderRadius,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    width: '88%',
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginRight: horizontalScale(5),
  },
  arrowIcon: {
    height: 18,
    width: 18,
  },
  icon: {
    height: 25,
    width: 25,
  },
  lockIcon: {
    opacity: 0.6,
  },
});
