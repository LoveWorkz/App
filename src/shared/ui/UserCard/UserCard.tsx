import React, {useCallback, ReactElement} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';

import {Avatar, AvatarTheme} from '@src/shared/ui/Avatar/Avatar';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {StyleType} from '@src/shared/types/types';

interface HeaderProps {
  style?: Record<string, string | number>;
  imageUrl: string;
  name: string;
  title: string;
  titleStyle?: StyleType;
  nameStyle?: StyleType;
  onIconPressHandler?: () => void;
  onContentPressHandler?: () => void;
  Icon?: ReactElement;
}

export const UserCard = (props: HeaderProps) => {
  const {
    style,
    imageUrl,
    name,
    nameStyle,
    title,
    titleStyle,
    onContentPressHandler,
    onIconPressHandler,
    Icon,
  } = props;

  const onSettingsPressHandler = useCallback(() => {
    onIconPressHandler?.();
  }, [onIconPressHandler]);

  const onProfilePressHandler = useCallback(() => {
    onContentPressHandler?.();
  }, [onContentPressHandler]);

  return (
    <View style={[styles.UserCard, style]}>
      <Pressable onPress={onProfilePressHandler}>
        <Avatar theme={AvatarTheme.SMALL} imageUrl={imageUrl} />
      </Pressable>
      <Pressable onPress={onProfilePressHandler}>
        <View style={styles.nameWrapper}>
          <AppText style={titleStyle} text={title} weight={'300'} />
          <AppText
            style={nameStyle}
            text={name}
            size={TextSize.LEVEL_5}
            weight={'600'}
          />
        </View>
      </Pressable>
      <View style={styles.icon}>
        <Pressable onPress={onSettingsPressHandler}>{Icon}</Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  UserCard: {
    width: '100%',
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  nameWrapper: {
    marginLeft: 10,
  },
  icon: {
    marginLeft: 'auto',
    height: 20,
    width: 20,
  },
});
