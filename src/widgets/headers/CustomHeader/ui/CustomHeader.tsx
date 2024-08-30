import React, {ComponentType, memo, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {Button} from '@src/shared/ui/Button/Button';
import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {useGradient} from '@src/app/providers/GradientProvider';
import {globalPadding} from '@src/app/styles/GlobalStyle';
import {
  HEADER_HEIGHT_ADNDROID,
  HEADER_HEIGHT_IOS,
  isPlatformIos,
} from '@src/shared/consts/common';

interface CustomHeaderProps {
  headerTitle?: string;
  title?: string;
  isTitleLarge?: Boolean;
  isSecondaryBackground?: boolean;
  backgroundColor?: string;
  HeaderRight?: ComponentType<any>;
  transparent?: boolean;
  arrowColor?: string;
}

const CustomHeader = (props: CustomHeaderProps) => {
  const {
    headerTitle,
    title,
    isTitleLarge,
    isSecondaryBackground = false,
    backgroundColor,
    transparent,
    arrowColor,
    HeaderRight,
  } = props;
  const colors = useColors();
  const {t} = useTranslation();
  const {isGradient} = useGradient();
  const [headerHeight, setHeaderHeight] = useState<null | number>(null);

  const color =
    isSecondaryBackground || isGradient
      ? colors.white
      : colors.primaryTextColor;

  const onPressHandler = () => {
    navigation.goBack();
  };

  return (
    <>
      <StatusBar animated={true} translucent={true} />
      <View
        style={[
          styles.CustomHeader,
          {backgroundColor},
          transparent && styles.transparentStyle,
        ]}>
        <View
          style={styles.headerLeft}
          onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}>
          <Button style={styles.arrowWrapper} onPress={onPressHandler}>
            <SvgXml
              fill={arrowColor ?? color}
              style={styles.icon}
              xml={ArrowLeftIcon}
            />
          </Button>
          {(headerTitle || title) && (
            <AppText
              style={[
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  color: color,
                  width: isTitleLarge ? '88%' : 'auto',
                  paddingRight: isTitleLarge ? horizontalScale(20) : 0,
                },
              ]}
              size={TextSize.LEVEL_6}
              weight={'700'}
              text={t(title || headerTitle || '')}
            />
          )}
        </View>
        <View style={[styles.headerRight, {height: headerHeight}]}>
          {HeaderRight && <HeaderRight />}
        </View>
      </View>
    </>
  );
};

export default memo(CustomHeader);

const bottom = 0;

const styles = StyleSheet.create({
  CustomHeader: {
    width: '100%',
    height: isPlatformIos
      ? HEADER_HEIGHT_IOS
      : HEADER_HEIGHT_ADNDROID + (StatusBar.currentHeight as number),
    paddingHorizontal: globalPadding,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom,
    left: globalPadding,
  },
  headerRight: {
    position: 'absolute',
    right: globalPadding,
    bottom,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowWrapper: {
    paddingRight: horizontalScale(20),
  },
  icon: {
    height: verticalScale(15),
    width: horizontalScale(18),
  },
  transparentStyle: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
});
