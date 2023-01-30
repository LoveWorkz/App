import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  AppRouteNames,
  appRoutesConfig,
} from '@src/shared/config/route/configRoute';
import {ComponentWrapper as IconItem} from './IconItem/IconItem';
import {getIcon} from '../lib/getIcon';

const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName={AppRouteNames.HOME}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({focused, size}) => {
          const routeName = route.name;

          const icon = getIcon(routeName);

          return (
            <IconItem
              icon={icon}
              size={size}
              focused={focused}
              name={routeName}
            />
          );
        },
      })}>
      {Object.values(appRoutesConfig)
        .filter(item => item.isTab)
        .map(({name, Element}) => (
          <Tab.Screen name={name} component={Element} key={name} />
        ))}
    </Tab.Navigator>
  );
};

export const ComponentWrapper = memo(Main);
