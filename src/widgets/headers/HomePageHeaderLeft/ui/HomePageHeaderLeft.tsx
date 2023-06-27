import React, {memo} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Avatar, AvatarTheme} from '@src/shared/ui/Avatar/Avatar';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {
  globalPadding,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {userStore} from '@src/entities/User';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';

const HomePageHeaderLeft = () => {
  const {t} = useTranslation();
  const maxNameLength = 25;
  const isFirstUserVisit = userStore.isFirstUserVisit;

  const user = userStore.user;
  if (!user) {
    return (
      <View style={styles.headerLeft}>
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
      </View>
    );
  }

  const onProfilePressHandler = () => {
    navigation.navigate(AppRouteNames.PROFILE);
  };

  const name = user.name;
  const isNameLarge = name.length >= maxNameLength;

  return (
    <View style={styles.headerLeft}>
      <Pressable onPress={onProfilePressHandler}>
        <Avatar theme={AvatarTheme.SMALL} imageUrl={user.photo || ''} />
      </Pressable>
      <Pressable onPress={onProfilePressHandler}>
        <View style={styles.nameWrapper}>
          {!isFirstUserVisit && (
            <AppText text={t('home.welcome_back')} weight={'300'} />
          )}
          <AppText
            text={name || ''}
            size={isNameLarge ? TextSize.LEVEL_3 : TextSize.LEVEL_5}
            weight={'600'}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default memo(observer(HomePageHeaderLeft));

const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: horizontalScale(globalPadding),
    width: windowWidthMinusPaddings,
    height: verticalScale(50),
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: verticalScale(10),
  },
  nameWrapper: {
    marginLeft: horizontalScale(10),
  },

  avatarSkeleton: {
    marginRight: 8,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
});
