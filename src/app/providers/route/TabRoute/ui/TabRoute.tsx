import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ParamListBase} from '@react-navigation/native';

import {ComponentWrapper as IconItem} from './IconItem/IconItem';
import {getIcon} from '../lib/getIcon';
import {
  tabRoutesConfig,
  TabRoutesNames,
} from '@src/shared/config/route/tabConfigRoutes';
import {Layout} from '@src/app/providers/layout';

const Tab = createBottomTabNavigator();

const TabRoute = () => {
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
      {Object.values(tabRoutesConfig).map(({name, Element}) => {
        const Wrapper = (props: ParamListBase) => {
          return (
            <Layout>
              <Element {...props} />
            </Layout>
          );
        };

        return <Tab.Screen name={name} component={Wrapper} key={name} />;
      })}
    </Tab.Navigator>
  );
};

export const ComponentWrapper = memo(TabRoute);
