import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {InformationIcon} from '@src/shared/assets/icons/Information';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {Button} from '@src/shared/ui/Button/Button';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

interface SessionsHeaderRightProps {
  isFavorite?: boolean;
}

const SessionsHeaderRight = (props: SessionsHeaderRightProps) => {
  const {isFavorite = false} = props;

  const colors = useColors();

  const onPressHandler = () => {
    navigation.navigate(AppRouteNames.HOW_TO_USE);
  };

  return (
    <Button
      onPress={onPressHandler}
      style={styles.btn}
      backgroundColor={'transparent'}>
      <View style={styles.SessionsHeaderRight}>
        {!isFavorite && (
          <AppText
            weight={'600'}
            size={TextSize.LEVEL_2}
            style={styles.title}
            text={'How to use'}
          />
        )}
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
    paddingHorizontal: horizontalScale(6),
  },
  title: {
    textTransform: 'capitalize',
    marginRight: horizontalScale(8),
  },
  icon: {
    height: horizontalScale(16),
    width: horizontalScale(16),
  },
});

export default memo(SessionsHeaderRight);
