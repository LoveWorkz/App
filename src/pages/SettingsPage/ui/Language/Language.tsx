import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {SmallArrowRightIcon} from '@src/shared/assets/icons/SmallArrowRight';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

const Language = () => {
  const colors = useColors();
  const {t} = useTranslation();

  const onLanguageHandler = () => {
    navigation.navigate(AppRouteNames.LANGUAGE);
  };

  return (
    <Pressable onPress={onLanguageHandler} style={styles.language}>
      <AppText
        style={{color: colors.primaryTextColor}}
        size={TextSize.LEVEL_5}
        text={t('settings.language')}
      />
      <View>
        <SvgXml
          xml={SmallArrowRightIcon}
          stroke={colors.primaryTextColor}
          style={styles.icon}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  language: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    width: 10,
    height: 15,
  },
});

export default memo(Language);
