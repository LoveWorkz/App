import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {Button} from '@src/shared/ui/Button/Button';
import {useColors} from '@src/app/providers/colorsProvider';

interface HeaderLeftProps {
  title?: string;
}

const HeaderLeft = (props: HeaderLeftProps) => {
  const {title} = props;
  const colors = useColors();

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
      {title && (
        <AppText
          style={{color: colors.primaryTextColor}}
          size={TextSize.LEVEL_6}
          weight={'500'}
          text={title}
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
  },
  icon: {
    height: 15,
    width: 18,
    marginRight: 15,
  },
});
