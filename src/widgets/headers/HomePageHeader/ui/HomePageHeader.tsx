import React, {memo, useMemo} from 'react';
import {StyleSheet, View, Pressable, StatusBar} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';

import {Avatar} from '@src/shared/ui/Avatar/Avatar';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import {globalPadding, globalStyles} from '@src/app/styles/GlobalStyle';
import {userStore} from '@src/entities/User';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {useColors} from '@src/app/providers/colorsProvider';
import {HEADER_HEIGHT, isPlatformIos} from '@src/shared/consts/common';
import {HomepageBackground} from '@src/shared/assets/images';
import {homepageBackgroundImgHeight} from '../model/lib/homePageHeaderLib';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {SettingsIcon} from '@src/shared/assets/icons/Settings';
import {SvgXml} from 'react-native-svg';

interface HomePageHeaderProps {
  isLoading: boolean;
}

const HomePageHeader = (props: HomePageHeaderProps) => {
  const {isLoading} = props;

  const {t} = useTranslation();
  const colors = useColors();
  const {theme} = useTheme();

  const maxNameLength = 25;
  const isFirstUserVisit = userStore.isFirstUserVisit;

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, [colors.white]);

  const user = userStore.user;
  if (isLoading || !user) {
    return (
      <View style={styles.header}>
        <View style={[styles.content, styles.skeletonContent]}>
          <>
            <View style={styles.avatarSkeleton}>
              <Skeleton
                width={horizontalScale(40)}
                height={horizontalScale(40)}
                borderRadius={moderateScale(50)}
              />
            </View>
            <View>
              <View style={styles.titleSkeleton}>
                <Skeleton width={100} height={8} />
              </View>
              <View>
                <Skeleton width={150} height={15} />
              </View>
            </View>
          </>
        </View>
      </View>
    );
  }

  const onProfilePressHandler = () => {
    navigation.navigate(AppRouteNames.PROFILE);
  };

  const onSettingsPressHandler = () => {
    navigation.navigate(AppRouteNames.SETTINGS);
  };

  const name = user.name;
  const isNameLarge = name.length >= maxNameLength;

  return (
    <View style={styles.header}>
      {theme === Theme.LIGHT && (
        <FastImage
          style={[styles.homepageBackground]}
          source={HomepageBackground}
        />
      )}
      <View style={styles.content}>
        <View style={styles.leftPart}>
          <Pressable onPress={onProfilePressHandler}>
            <Avatar size={40} imageUrl={user.photo || ''} />
          </Pressable>
          <Pressable onPress={onProfilePressHandler}>
            <View style={styles.nameWrapper}>
              {!isFirstUserVisit && (
                <AppText
                  size={TextSize.LEVEL_2}
                  style={textStyle}
                  text={t('home.welcome_back')}
                  weight={'600'}
                />
              )}
              <AppText
                style={textStyle}
                text={name || ''}
                size={isNameLarge ? TextSize.LEVEL_3 : TextSize.LEVEL_4}
                weight={'600'}
              />
            </View>
          </Pressable>
        </View>
        <View style={{top: horizontalScale(isPlatformIos ? 0 : 27)}}>
          <Pressable
            style={{
              top: horizontalScale(isPlatformIos ? 0 : -27),
            }}
            onPress={onSettingsPressHandler}>
            <SvgXml
              xml={SettingsIcon}
              style={styles.icon}
              stroke={colors.white}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default memo(observer(HomePageHeader));

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT + (StatusBar.currentHeight as number),
    overflow: 'hidden',
    ...globalStyles.zIndex_1,
  },
  homepageBackground: {
    height: homepageBackgroundImgHeight,
  },
  content: {
    top: -8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    height: HEADER_HEIGHT,
    paddingHorizontal: globalPadding,
    position: 'absolute',
    marginTop: StatusBar.currentHeight,
  },
  leftPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameWrapper: {
    marginLeft: horizontalScale(10),
  },
  icon: {
    height: horizontalScale(28),
    width: horizontalScale(28),
  },

  skeletonContent: {
    justifyContent: 'flex-start',
  },
  avatarSkeleton: {
    marginRight: horizontalScale(8),
  },
  titleSkeleton: {
    marginBottom: horizontalScale(8),
  },
});
