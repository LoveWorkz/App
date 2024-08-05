import React, {memo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {LogOutIcon} from '@src/shared/assets/icons/LogOut';
import {horizontalScale} from '@src/shared/lib/Metrics';
import LogOutModal from './LogOutModal';
import {useTranslation} from 'react-i18next';

const LogOut = () => {
  const colors = useColors();
  const {t} = useTranslation();

  const [visible, setVisible] = useState(false);

  const onPressHandler = () => {
    setVisible(true);
  };

  return (
    <>
      <TouchableOpacity onPress={onPressHandler} style={styles.Logout}>
        <SvgXml
          xml={LogOutIcon}
          stroke={colors.primaryTextColor}
          style={styles.arrowRightIcon}
        />
        <AppText
          style={[styles.text, {color: colors.primaryTextColor}]}
          weight={'500'}
          size={TextSize.LEVEL_4}
          text={t('auth.logout')}
        />
      </TouchableOpacity>
      <LogOutModal visible={visible} setVisible={setVisible} />
    </>
  );
};

export default memo(observer(LogOut));

const styles = StyleSheet.create({
  Logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    left: 10,
    bottom: 2,
  },
  arrowRightIcon: {
    height: horizontalScale(20),
    width: horizontalScale(20),
  },
});
