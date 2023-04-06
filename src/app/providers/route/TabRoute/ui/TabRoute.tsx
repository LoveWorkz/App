import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ParamListBase} from '@react-navigation/native';

import {
  tabRoutesConfig,
  TabRoutesNames,
} from '@src/shared/config/route/tabConfigRoutes';
import {Layout} from '@src/app/providers/layout';
import {globalStyles} from '@src/app/styles/GlobalStyle';
import {ComponentWrapper as IconItem} from './IconItem/IconItem';
import {getTabIcon} from '../lib/getIcon';

const Tab = createBottomTabNavigator();

const TabRoute = () => {
  return (
    <Tab.Navigator
      initialRouteName={TabRoutesNames.HOME}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          ...globalStyles.strongShadowOpacity,
          borderRadius: 20,
          height: 80,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({focused}) => {
          const routeName = route.name;

          const getIcon = getTabIcon(routeName);

          return (
            <IconItem
              icon={getIcon}
              focused={focused}
              size={routeName === TabRoutesNames.HOME ? 25 : 0}
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
