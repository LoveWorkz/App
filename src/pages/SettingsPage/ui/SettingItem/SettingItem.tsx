import React, {memo, useCallback} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

interface SettingItem {
  Icon: string;
  text: string;
  path?: AppRouteNames;
}

const SettingItem = (props: SettingItem) => {
  const {Icon, text, path} = props;

  const onPressHandler = useCallback(() => {
    path && navigation.navigate(path);
  }, [path]);

  return (
    <Pressable style={styles.settingItem} onPress={onPressHandler}>
      <View>
        <SvgXml xml={Icon} style={styles.icon} />
      </View>
      <View style={styles.textWrapper}>
        <AppText size={TextSize.LEVEL_4} text={text} />
      </View>
    </Pressable>
  );
};

export const Wrapper = memo(SettingItem);

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: 22,
  },
  icon: {
    height: 22,
    width: 22,
  },
  textWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'absolute',
    left: 30,
  },
});
