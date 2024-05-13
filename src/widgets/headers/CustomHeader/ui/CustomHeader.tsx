import React, {memo, ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button} from '@src/shared/ui/Button/Button';
import {useColors} from '@src/app/providers/colorsProvider';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';
import {HEADER_HEIGHT, isPlatformIos} from '@src/shared/consts/common';

interface CustomHeader {
  ImageComponent?: ReactNode;
  isWhite?: boolean;
  title?: string;
}

const CustomHeader = (props: CustomHeader) => {
  const {ImageComponent, isWhite = false, title} = props;

  const colors = useColors();

  const onPressHandler = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      {ImageComponent}
      <View style={styles.content}>
        <View style={styles.titleWrapper}>
          <Button onPress={onPressHandler}>
            <SvgXml
              fill={isWhite ? colors.white : colors.primaryTextColor}
              style={styles.icon}
              xml={ArrowLeftIcon}
            />
          </Button>
          {title && (
            <AppText
              style={[
                {
                  color: isWhite ? colors.white : colors.primaryTextColor,
                },
              ]}
              size={TextSize.LEVEL_6}
              weight={'700'}
              text={title}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    width: windowWidth,
    overflow: 'hidden',
  },
  content: {
    position: 'absolute',
    top: 0,
    height: HEADER_HEIGHT,
    justifyContent: 'center',
  },
  titleWrapper: {
    top: verticalScale(isPlatformIos ? 25 : 0),
    flexDirection: 'row',
    alignItems: 'center',
    left: globalPadding,
  },
  icon: {
    height: verticalScale(15),
    width: horizontalScale(18),
    marginRight: horizontalScale(15),
  },
});

export default memo(CustomHeader);
