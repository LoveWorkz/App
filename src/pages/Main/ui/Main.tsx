import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {ComponentWrapper as IconItem} from './IconItem/IconItem';
import {getIcon} from '../lib/getIcon';
import {
  tabRoutesConfig,
  TabRoutesNames,
} from '@src/shared/config/route/tabConfigRoutes';

const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName={TabRoutesNames.HOME}
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
      {Object.values(tabRoutesConfig).map(({name, Element}) => (
        <Tab.Screen name={name} component={Element} key={name} />
      ))}
    </Tab.Navigator>
  );
};

export const ComponentWrapper = memo(Main);
