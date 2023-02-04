import React, {memo, useCallback} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {SmallArrowRightIcon} from '@src/shared/assets/icons/SmallArrowRight';
import {navigate} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

const ChangePassword = () => {
  const onPressHandler = useCallback(() => {
    navigate(AppRouteNames.CHANGE_PASSWORD);
  }, []);

  return (
    <Pressable onPress={onPressHandler} style={styles.changePassword}>
      <View>
        <Text style={styles.text}>Change password</Text>
      </View>
      <View>
        <SvgXml xml={SmallArrowRightIcon} style={styles.icon} />
        <View />
      </View>
    </Pressable>
  );
};

export const Wrapper = memo(ChangePassword);

const styles = StyleSheet.create({
  changePassword: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontSize: 18,
  },
  icon: {
    height: 16,
    width: 16,
  },
});
