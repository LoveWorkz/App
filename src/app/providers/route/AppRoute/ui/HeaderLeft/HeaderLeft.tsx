import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {Button} from '@src/shared/ui/Button/Button';
import {useColors} from '@src/app/providers/colorsProvider';

interface HeaderLeftProps {
  headerTitle?: string;
  title?: string;
  isTitleSmall?: Boolean;
}

const HeaderLeft = (props: HeaderLeftProps) => {
  const {headerTitle, title, isTitleSmall} = props;
  const colors = useColors();
  const {t, i18n} = useTranslation();

  const isLngEn = i18n.language === 'en';

  const onPressHandler = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.headerLeft}>
      <Button onPress={onPressHandler}>
        <SvgXml
          stroke={colors.primaryTextColor}
          style={styles.icon}
          xml={ArrowLeftIcon}
        />
      </Button>
      {(headerTitle || title) && (
        <AppText
          style={[styles.title, {color: colors.primaryTextColor}]}
          size={isTitleSmall && !isLngEn ? TextSize.LEVEL_4 : TextSize.LEVEL_6}
          weight={'500'}
          text={t(title || headerTitle || '')}
        />
      )}
    </View>
  );
};

export default memo(HeaderLeft);

const styles = StyleSheet.create<Record<string, any>>({
  headerLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    height: '100%',
  },
  icon: {
    height: 15,
    width: 18,
    marginRight: 15,
  },
  title: {
    width: '90%',
  },
});
