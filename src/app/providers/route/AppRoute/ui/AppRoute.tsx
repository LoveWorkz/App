import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  AppRouteNames,
  appRoutesConfig,
} from '../../../../../shared/config/configRoute';
import {navigationRef} from '../../../../../shared/config/navigation/navigation';

const Stack = createNativeStackNavigator();

export const AppRoute = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={AppRouteNames.AUTH}
        screenOptions={{
          headerShown: false,
        }}>
        {Object.values(appRoutesConfig).map(route => (
          <Stack.Screen
            name={route.name}
            component={route.element}
            key={route.name}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
