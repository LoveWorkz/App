import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {LogOutIcon} from '@src/shared/assets/icons/LogOut';
import {LogOutModal} from '@src/features/LogOut';

const ProfileHeaderRight = () => {
  const [visible, setVisible] = useState(false);

  const onPressHandler = useCallback(() => {
    setVisible(true);
  }, []);

  return (
    <View style={styles.headerRight}>
      <Pressable onPress={onPressHandler}>
        <SvgXml xml={LogOutIcon} style={styles.icon} />
      </Pressable>
      <LogOutModal visible={visible} setVisible={setVisible} />
    </View>
  );
};

export default memo(ProfileHeaderRight);

const styles = StyleSheet.create({
  headerRight: {
    alignItems: 'center',
  },
  icon: {
    height: 20,
    width: 20,
  },
});
