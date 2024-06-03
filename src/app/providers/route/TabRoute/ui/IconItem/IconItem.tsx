import React, {useCallback, memo} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {GradientHeart} from '@src/shared/assets/icons/GradientHeart';

interface IconItemProps {
  name: string;
  focused: boolean;
  icon: (param: {isDarkMode: boolean}) => string;
}

const IconItem = (props: IconItemProps) => {
  const {name, focused, icon} = props;

  const {theme} = useTheme();
  const colors = useColors();
  const isDarkMode = theme === Theme.Dark;

  const onPressHandler = useCallback(() => {
    navigation.navigate(name, {isTabScreen: true});
  }, [name]);

  if (name === TabRoutesNames.HOME) {
    return (
      <Pressable
        style={[styles.homeIconWrapper, {backgroundColor: colors.white}]}
        onPress={onPressHandler}>
        <SvgXml xml={GradientHeart} height={32} width={32} />
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.iconWrapper} onPress={onPressHandler}>
      <SvgXml
        xml={icon({isDarkMode})}
        stroke={focused ? colors.activeTabIconColor : colors.tabIconColor}
        height={20}
        width={20}
      />
      <AppText
        style={[
          styles.tabName,
          {color: focused ? colors.activeTabIconColor : colors.tabIconColor},
        ]}
        weight={'600'}
        size={TextSize.LEVEL_1}
        text={name === TabRoutesNames.CATEGORIES ? 'sessions' : name}
      />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  tabName: {
    marginTop: horizontalScale(5),
    textTransform: 'capitalize',
  },

  homeIconWrapper: {
    width: 65,
    height: 65,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    top: -15,
  },
});

export default memo(IconItem);
