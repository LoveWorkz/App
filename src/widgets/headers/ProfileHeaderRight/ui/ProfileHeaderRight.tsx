import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {LogOutIcon} from '@src/shared/assets/icons/LogOut';
import {LogOutModal} from '@src/features/LogOut';
import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale} from '@src/shared/lib/Metrics';

const ProfileHeaderRight = () => {
  const [visible, setVisible] = useState(false);
  const colors = useColors();

  const onPressHandler = useCallback(() => {
    setVisible(true);
  }, []);

  return (
    <View style={styles.headerRight}>
      <Pressable onPress={onPressHandler}>
        <SvgXml
          xml={LogOutIcon}
          style={styles.icon}
          stroke={colors.primaryTextColor}
        />
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
    height: horizontalScale(20),
    width: horizontalScale(20),
  },
});
