import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';

import {
  AppRouteNames,
  appRoutesConfig,
} from '@src/shared/config/route/configRoute';
import {navigationRef} from '@src/shared/config/navigation/navigation';

const Stack = createNativeStackNavigator();

export const AppRoute = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={AppRouteNames.SPLASH}
        screenOptions={{
          headerShown: false,
        }}>
        {Object.values(appRoutesConfig)
          .filter(item => !item.isTab)
          .map(({name, Element}) => (
            <Stack.Screen name={name} component={Element} key={name} />
          ))}
      </Stack.Navigator>
      <StatusBar animated={true} backgroundColor="white" />
    </NavigationContainer>
  );
};
