import React, {useCallback, memo, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {Theme, useTheme} from '@src/app/providers/themeProvider';

interface IconItemProps {
  name: string;
  focused: boolean;
  icon: (param: {isGradient: boolean; isDarkMode: boolean}) => string;
}

const IconItem = (props: IconItemProps) => {
  const {name, focused, icon} = props;

  const {theme} = useTheme();
  const isDarkMode = theme === Theme.Dark;

  const onPressHandler = useCallback(() => {
    navigation.navigate(name, {isTabScreen: true});
  }, [name]);

  const roundStyle = useMemo(() => {
    return [
      styles.round,
      {
        marginBottom: 5,
      },
    ];
  }, []);

  return (
    <Pressable style={styles.iconWrapper} onPress={onPressHandler}>
      {focused && <Gradient style={roundStyle} />}
      {!focused && <View style={roundStyle} />}
      <SvgXml
        xml={icon({isGradient: focused, isDarkMode})}
        height={16}
        width={16}
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
  round: {
    height: 4,
    width: 4,
    borderRadius: 4,
  },
});

export default memo(IconItem);
