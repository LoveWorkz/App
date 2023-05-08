import {
  NavigationContainer,
  ParamListBase,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import React, {memo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';

import {
  AppRouteNames,
  appRoutesConfig,
} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {Layout} from '@src/app/providers/layout';
import {useColors} from '@src/app/providers/colorsProvider';
import {useTheme} from '@src/app/providers/themeProvider';
import {Theme} from '@src/app/providers/themeProvider';
import {isPlatformIos} from '@src/shared/consts/common';
import HeaderLeft from './HeaderLeft/HeaderLeft';

const Stack = createNativeStackNavigator();

export const AppRoute = () => {
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
  return (
    <Stack.Navigator
      initialRouteName={AppRouteNames.SPLASH}
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
      }}>
      {Object.values(appRoutesConfig).map(
        ({
          name,
          Element,
          headerShown,
          headerTitle,
          HeaderRight,
          isPageScrolling,
          deleteBottomPadding,
          deleteTopPadding,
          isTitleLarge,
        }) => {
          const Wrapper = (props: ParamListBase) => {
            return (
              <Layout
                isPageScrolling={isPageScrolling}
                deleteBottomPadding={deleteBottomPadding}
                deleteTopPadding={deleteTopPadding}>
                <Element {...props} />
              </Layout>
            );
          };

          const Component =
            name === AppRouteNames.TAB_ROUTE ? Element : Wrapper;

          return (
            <Stack.Screen
              options={({route}) => ({
                headerShown: headerShown,
                title: '',
                headerRight: HeaderRight
                  ? () => <HeaderRight {...route.params} />
                  : undefined,
                headerLeft: headerShown
                  ? () => (
                      <HeaderLeft
                        {...route.params}
                        headerTitle={headerTitle}
                        isTitleLarge={isTitleLarge}
                      />
                    )
                  : undefined,
              })}
              name={name}
              component={Component}
              key={name}
            />
          );
        },
      )}
    </Stack.Navigator>
  );
});
