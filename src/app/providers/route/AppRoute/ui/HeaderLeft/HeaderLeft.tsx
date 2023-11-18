import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {Button} from '@src/shared/ui/Button/Button';
import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';

interface HeaderLeftProps {
  headerTitle?: string;
  title?: string;
  isTitleLarge?: Boolean;
}

const HeaderLeft = (props: HeaderLeftProps) => {
  const {headerTitle, title, isTitleLarge} = props;
  const colors = useColors();
  const {t} = useTranslation();

  const onPressHandler = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.headerLeft}>
      <Button onPress={onPressHandler}>
        <SvgXml
          fill={colors.primaryTextColor}
          style={styles.icon}
          xml={ArrowLeftIcon}
        />
      </Button>
      {(headerTitle || title) && (
        <AppText
          style={[
            {
              color: colors.primaryTextColor,
              width: isTitleLarge ? '88%' : 'auto',
              paddingRight: isTitleLarge ? horizontalScale(20) : 0,
            },
          ]}
          ellipsizeMode={'tail'}
          numberOfLines={1}
          size={TextSize.LEVEL_6}
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
    height: verticalScale(15),
    width: horizontalScale(18),
    marginRight: horizontalScale(15),
  },
});
