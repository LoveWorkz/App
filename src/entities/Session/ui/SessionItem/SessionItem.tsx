import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SvgXml} from 'react-native-svg';
import {observer} from 'mobx-react-lite';

import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {getShadowOpacity, globalPadding} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {EllipseIcon} from '@src/shared/assets/icons/Ellipse';
import {PlayIcon} from '@src/shared/assets/icons/Play';
import {LockIcon} from '@src/shared/assets/icons/Lock';
import {HeartIcon, HeartIconWithoutColor} from '@src/shared/assets/icons/Heart';
import {Button} from '@src/shared/ui/Button/Button';
import {ColorType} from '@src/app/styles/themeStyle';
import {SelectedEllipseIcon} from '@src/shared/assets/icons/SelectedEllipse';
import {favoriteStore} from '@src/entities/Favorite';
import PremiumBlock from '@src/shared/ui/PremiumBlock/PremiumBlock';
import {SessionState, SessionType} from '../../model/types/sessionType';
import sessionStore from '../../model/store/sessionStore';
import PresSessionModal from '../PreSessionModal/PreSessionModal';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';

interface SessionItemProps {
  session: SessionType;
  state: SessionState;
  isPremium: boolean;
}

const SessionItem = (props: SessionItemProps) => {
  const {session, state = 'completed', isPremium} = props;

  const colors = useColors();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const language = useLanguage();
  const {isDark} = useTheme();

  const [visible, setVisible] = useState(false);

  const isFavorite = favoriteStore.checkIsFavorite({
    id: session.id,
    favoriteKey: 'session',
  });

  let isBlocked = false;

  const toggleFavoriteHandler = async () => {
    sessionStore.toggleSessionFavorite({sessionid: session.id, isFavorite});
  };

  let leftIcon = EllipseIcon;
  let rightIcon = <></>;
  let bgColor = isDark ? colors.bgTertiaryColor : colors.softPeriwinkle;

  switch (state) {
    case 'completed':
      leftIcon = SelectedEllipseIcon;
      rightIcon = renderRightIcon({
        state: 'completed',
        onIconPressHandler: toggleFavoriteHandler,
        colors,
        isFavorite,
      });

      break;
    case 'current':
      leftIcon = EllipseIcon;
      rightIcon = renderRightIcon({
        state: 'current',
        colors,
      });

      bgColor = isDark ? colors.bgTertiaryColor : colors.bgSecondaryColor;

      break;
    default:
      leftIcon = LockIcon;
      rightIcon = <></>;
      isBlocked = true;
  }

  // premium logic
  if (isPremium) {
    bgColor = isDark ? colors.bgTertiaryColor : colors.disabledSessionColor;
    leftIcon = LockIcon;
  }
  const disabled = isBlocked || isPremium;

  const onSessionPressHandler = () => {
    setVisible(true);
  };

  const goToQuestions = useCallback(() => {
    setVisible(false);
    sessionStore.selectSessionAndNavigate({session});
  }, [session]);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        disabled={disabled}
        onPress={onSessionPressHandler}
        style={[
          styles.SessionItem,
          {
            ...getShadowOpacity(theme, bgColor).shadowOpacity_level_2,
            backgroundColor: bgColor,
          },
        ]}>
        {isPremium && (
          <View style={styles.premiumBlock}>
            <PremiumBlock isGradient />
          </View>
        )}
        <>
          <View style={styles.sessionNumberWrapper}>
            <SvgXml xml={leftIcon} style={styles.leftIcon} />
            <AppText
              weight={'600'}
              size={TextSize.LEVEL_2}
              text={`${t('sessions.session')} ${session.sessionNumber}`}
            />
          </View>
          <View style={styles.titleWrapper}>
            <AppText
              weight={'900'}
              size={TextSize.LEVEL_5}
              text={`${session.displayName[language]}`}
            />
          </View>
          <AppText
            weight={'600'}
            size={TextSize.LEVEL_2}
            text={`${session.description[language]}`}
          />
        </>
        {disabled ? <></> : <>{rightIcon}</>}
      </TouchableOpacity>
      <PresSessionModal
        onConfirm={goToQuestions}
        visible={visible}
        setVisible={setVisible}
      />
    </View>
  );
};

const renderRightIcon = ({
  state,
  onIconPressHandler,
  isFavorite,
  colors,
}: {
  state: SessionState;
  onIconPressHandler?: () => void;
  isFavorite?: boolean;
  colors: ColorType;
}) => {
  switch (state) {
    case 'completed':
      return (
        <Button onPress={onIconPressHandler} style={styles.rightIconWrapper}>
          <SvgXml
            xml={isFavorite ? HeartIconWithoutColor : HeartIcon}
            style={styles.rightIcon}
            fill={isFavorite ? colors.red : 'none'}
            stroke={!isFavorite ? colors.primaryTextColor : 'none'}
          />
        </Button>
      );
    default:
      return (
        <View style={styles.rightIconWrapper}>
          <SvgXml xml={PlayIcon} style={styles.rightIcon} />
        </View>
      );
  }
};

export default memo(observer(SessionItem));

const rightIconPadding = 10;
const rightIconPosition = globalPadding - rightIconPadding;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  SessionItem: {
    borderRadius: moderateScale(20),
    padding: horizontalScale(globalPadding),
    width: '100%',
  },
  titleWrapper: {
    marginVertical: verticalScale(10),
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionNumberWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    height: horizontalScale(18),
    width: horizontalScale(18),
    marginRight: horizontalScale(6),
  },
  rightIconWrapper: {
    position: 'absolute',
    top: horizontalScale(rightIconPosition),
    right: horizontalScale(rightIconPosition),
    paddingHorizontal: horizontalScale(rightIconPadding),
    paddingVertical: horizontalScale(rightIconPadding),
  },
  rightIcon: {
    height: horizontalScale(18),
    width: horizontalScale(18),
  },
  premiumBlock: {
    position: 'absolute',
    right: horizontalScale(globalPadding),
    top: horizontalScale(globalPadding),
  },
});
