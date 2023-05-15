import React, {memo} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Avatar, AvatarTheme} from '@src/shared/ui/Avatar/Avatar';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {profileStore} from '@src/entities/Profile';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {
  globalPadding,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';

const HomePageHeaderLeft = () => {
  const {t} = useTranslation();
  const profile = profileStore.profileData;
  const maxNameLength = 25;

  const onProfilePressHandler = () => {
    navigation.navigate(AppRouteNames.PROFILE);
  };

  if (!profile) {
    return null;
  }

  const name = profile.name;
  const isNameLarge = name?.length >= maxNameLength;

  return (
    <View style={styles.headerLeft}>
      <Pressable onPress={onProfilePressHandler}>
        <Avatar theme={AvatarTheme.SMALL} imageUrl={profile.photo || ''} />
      </Pressable>
      <Pressable onPress={onProfilePressHandler}>
        <View style={styles.nameWrapper}>
          <AppText text={t('home.welcome_back')} weight={'300'} />
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
});
