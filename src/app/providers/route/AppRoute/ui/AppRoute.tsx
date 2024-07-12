import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import React, {memo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform, StatusBar} from 'react-native';

import {
  AppRouteNames,
  appRoutesConfig,
} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {useColors} from '@src/app/providers/colorsProvider';
import {useTheme} from '@src/app/providers/themeProvider';
import {Theme} from '@src/app/providers/themeProvider';
import {useGradient} from '@src/app/providers/GradientProvider';
import {isPlatformIos} from '@src/shared/consts/common';
import {CustomHeader} from '@src/widgets/headers/CustomHeader';
import * as Sentry from '@sentry/react-native';

const Stack = createNativeStackNavigator();

type Props = {
  routingInstrumentation: Sentry.ReactNavigationInstrumentation;
};

export const AppRoute = ({routingInstrumentation}: Props) => {
  const colors = useColors();
  const {theme} = useTheme();
  const isDarkMode = theme === Theme.Dark;

  const Light = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      card: colors.bgColor,
    },
  };

  const Dark = {
    ...DarkTheme,
    dark: true,
    colors: {
      ...DarkTheme.colors,
      card: colors.bgColor,
    },
  };

  return (
    <NavigationContainer
      ref={navigation.navigationRef}
      onReady={() => {
        routingInstrumentation.registerNavigationContainer(
          navigation.navigationRef,
        );
      }}
      theme={isDarkMode ? Dark : Light}>
      {isPlatformIos ? (
        <StatusBar
          animated={true}
          barStyle={!isDarkMode ? 'dark-content' : 'light-content'}
        />
      ) : (
        <StatusBar
          animated={true}
          backgroundColor={colors.bgColor}
          barStyle={!isDarkMode ? 'dark-content' : 'light-content'}
        />
      )}
      <Routes />
    </NavigationContainer>
  );
};

const Routes = memo(() => {
  const colors = useColors();
  const {isGradient} = useGradient();

  return (
    <Stack.Navigator
      initialRouteName={AppRouteNames.SPLASH}
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        animation: Platform.OS === 'android' ? 'none' : undefined,
      }}>
      {Object.values(appRoutesConfig).map(
        ({
          name,
          Element,
          headerShown,
          headerTitle,
          HeaderRight,
          isTitleLarge,
          isAboutMyRelationshipPage,
          bgColor,
        }) => {
          let backgroundColor = colors.bgColor;
          const isSecondaryBackground = bgColor === 'secondaryBackground';

          if (isSecondaryBackground) {
            backgroundColor = colors.themeSecondaryBackground;
          } else if (isAboutMyRelationshipPage) {
            backgroundColor = colors.bgHomePageHeaderColor;
          } else if (isGradient) {
            backgroundColor = colors.skyBlue;
          } else if (bgColor) {
            backgroundColor = bgColor;
          }

          return (
            <Stack.Screen
              options={({route}) => ({
                headerShown: headerShown,
                title: '',
                header: () => (
                  <CustomHeader
                    {...route.params}
                    headerTitle={headerTitle}
                    isTitleLarge={isTitleLarge}
                    isSecondaryBackground={isSecondaryBackground}
                    backgroundColor={backgroundColor}
                    HeaderRight={HeaderRight}
                  />
                ),
              })}
              name={name}
              component={Element}
              key={name}
            />
          );
        },
      )}
    </Stack.Navigator>
  );
});
