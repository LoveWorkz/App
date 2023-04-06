import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';

import {
  AppRouteNames,
  appRoutesConfig,
} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {Layout} from '@src/app/providers/layout';
import {isPlatformIos} from '@src/shared/consts/common';
import {useColors} from '@src/app/providers/colorsProvider';
import HeaderLeft from './HeaderLeft/HeaderLeft';

const Stack = createNativeStackNavigator();

export const AppRoute = () => {
  const colors = useColors();

  return (
    <NavigationContainer ref={navigation.navigationRef}>
      {isPlatformIos ? (
        <StatusBar animated={true} barStyle="dark-content" />
      ) : (
        <StatusBar
          animated={true}
          backgroundColor={'white'}
          barStyle="dark-content"
        />
      )}
      <Stack.Navigator
        initialRouteName={AppRouteNames.SPLASH}
        screenOptions={{
          headerShown: false,
        }}>
        {Object.values(appRoutesConfig).map(
          ({name, Element, headerShown, headerTitle, HeaderRight}) => {
            const Wrapper = (props: ParamListBase) => {
              return (
                <Layout>
                  <Element {...props} />
                </Layout>
              );
            };

            const Component =
              name === AppRouteNames.TAB_ROUTE ? Element : Wrapper;

            return (
              <Stack.Screen
                options={{
                  headerShown: headerShown,
                  headerStyle: {backgroundColor: colors.bgColor},
                  title: '',
                  headerRight: HeaderRight ? () => <HeaderRight /> : undefined,
                  headerLeft: headerTitle
                    ? () => <HeaderLeft title={headerTitle} />
                    : undefined,
                }}
                name={name}
                component={Component}
                key={name}
              />
            );
          },
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
