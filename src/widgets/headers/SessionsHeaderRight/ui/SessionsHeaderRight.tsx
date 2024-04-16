import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SvgXml} from 'react-native-svg';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {InformationIcon} from '@src/shared/assets/icons/Information';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {Button} from '@src/shared/ui/Button/Button';

const SessionsHeaderRight = () => {
  const colors = useColors();
  const {t} = useTranslation();

  const onPressHandler = () => {};

  return (
    <Button
      onPress={onPressHandler}
      style={styles.btn}
      backgroundColor={'transparent'}>
      <View style={styles.SessionsHeaderRight}>
        <AppText
          weight={'600'}
          size={TextSize.LEVEL_2}
          style={styles.title}
          text={'How to use'}
        />
        <SvgXml
          xml={InformationIcon}
          style={styles.icon}
          stroke={colors.primaryTextColor}
        />
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  SessionsHeaderRight: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  btn: {
    paddingHorizontal: horizontalScale(5),
  },
  title: {
    textTransform: 'capitalize',
    marginRight: horizontalScale(10),
  },
  icon: {
    height: horizontalScale(16),
    width: horizontalScale(16),
  },
});

export default memo(SessionsHeaderRight);
