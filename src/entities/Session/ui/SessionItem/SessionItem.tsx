import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {UnlockedIcon} from '@src/shared/assets/icons/Unlocked';
import {OutlineStarIcon} from '@src/shared/assets/icons/OutlineStar';
import {StarIcon} from '@src/shared/assets/icons/Star';
import {Button} from '@src/shared/ui/Button/Button';
import {LockedIcon} from '@src/shared/assets/icons/Locked';
import {SessionType} from '../../model/types/sessionType';
import sessionStore from '../../model/store/sessionStore';
import PresSessionModal from '../PreSessionModal/PreSessionModal';

interface SessionItemProps {
  count: string;
  isBlocked: boolean;
  session: SessionType;
  isLoading?: boolean;
  isMarked: boolean;
  sessionId: string;
}

const SessionItem = (props: SessionItemProps) => {
  const {count, isBlocked, session, isMarked, sessionId} = props;

  const colors = useColors();
  const {theme} = useTheme();
  const {t} = useTranslation();

  const [visible, setVisible] = useState(false);

  const onSessionPressHandler = () => {
    setVisible(true);
  };

  const onStarPressHandler = () => {
    sessionStore.markSession({sessionId, isMarked});
  };

  const goToQuestions = useCallback(() => {
    setVisible(false);
    sessionStore.selectSession({session});
  }, [session]);

  return (
    <View style={styles.wrapper}>
      <View>
        <SvgXml
          xml={isBlocked ? LockedIcon : UnlockedIcon}
          style={[styles.icon, isBlocked ? styles.lockIcon : {}]}
        />
      </View>
      <TouchableOpacity
        disabled={isBlocked}
        onPress={onSessionPressHandler}
        style={[
          styles.SessionItem,
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
        <Button onPress={onStarPressHandler} style={styles.starBtn}>
          <SvgXml
            xml={isMarked ? StarIcon : OutlineStarIcon}
            style={styles.arrowIcon}
          />
        </Button>
      </TouchableOpacity>
      <PresSessionModal
        goToQuestions={goToQuestions}
        visible={visible}
        setVisible={setVisible}
      />
    </View>
  );
};

export default memo(SessionItem);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  SessionItem: {
    height: 60,
    borderRadius: 20,
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
  starBtn: {
    paddingHorizontal: horizontalScale(8),
  },
});
