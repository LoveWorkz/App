import React, {ReactElement, useCallback, useRef} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {
  globalPadding,
  tabBarHeight,
  windowHeight,
} from '@src/app/styles/GlobalStyle';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';
import {BgColor} from '@src/shared/config/route/configRoute';
import {useGradient} from '@src/app/providers/GradientProvider';
import AdaptiveLayout from './AdaptiveLayout';
import themeStyle from '@src/app/styles/themeStyle';
// import {useTheme} from '@src/app/providers/themeProvider';
// import {useTheme} from '@src/app/providers/themeProvider';

interface LayoutProps {
  children: ReactElement;
  isPageScrolling?: boolean;
  deleteBottomPadding?: boolean;
  deleteTopPadding?: boolean;
  isTabBar?: boolean;
  bgColor?: BgColor;
  deleteGlobalPadding?: boolean;
  bgColorOverride?: keyof typeof themeStyle.dark;
}

export const Layout = (props: LayoutProps) => {
  const {
    children,
    isPageScrolling,
    deleteBottomPadding,
    deleteTopPadding,
    isTabBar = false,
    bgColor,
    deleteGlobalPadding = false,
    bgColorOverride,
  } = props;

  const scrollViewRef = useRef<ScrollView>(null);
  const colors = useColors();
  // const {isDark} = useTheme();
  const paddingBottom = verticalScale(isTabBar ? tabBarHeight + 30 : 30);
  const marginTop = verticalScale(deleteTopPadding ? 0 : 20);

  const getThemeColor = () => {
    if (bgColorOverride) {
      return bgColorOverride;
    } else {
      return undefined;
    }
  };
  const colorOverride = getThemeColor();
  // console.log('IS OVERRIDE', colorOverride);

  let backgroundColor;

  switch (bgColor) {
    case 'secondaryBackground':
      backgroundColor = colors.themeSecondaryBackground;
      break;
    case 'white':
      backgroundColor = colors.white;
      break;
    default:
      backgroundColor = colors.bgColor;
  }

  useFocusEffect(
    useCallback(() => {
      scrollViewRef?.current?.scrollTo({y: 0, animated: false});
    }, []),
  );

  const {isGradient} = useGradient();

  const overrideBgColor = colorOverride
    ? colors[colorOverride]
    : backgroundColor;

  // console.log(Platform.OS, overrideBgColor, isDark);

  if (isPageScrolling) {
    return (
      <ScrollView
        bounces={false}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{height: windowHeight, backgroundColor: overrideBgColor}}>
        <View
          style={[
            layoutStyles.layout,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              paddingBottom: deleteBottomPadding ? 0 : paddingBottom,
              paddingTop: marginTop,
              padding: deleteGlobalPadding ? 0 : globalPadding,
            },
          ]}>
          {children}
        </View>
      </ScrollView>
    );
  }

  return (
    <AdaptiveLayout
      isGradient={isGradient}
      children={children}
      backgroundColor={overrideBgColor}
      deleteBottomPadding={deleteBottomPadding}
      paddingBottom={paddingBottom}
      marginTop={marginTop}
      deleteGlobalPadding={deleteGlobalPadding}
      globalPadding={globalPadding}
    />
  );
};

export const layoutStyles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
});
