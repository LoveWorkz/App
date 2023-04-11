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
import {useColors} from '@src/app/providers/colorsProvider';
import {getTabIcon} from '../lib/getIcon';
import {Wrapper as TabHeaderLeft} from './TabHeaderLeft/TabHeaderLeft';
import {Wrapper as TabHeaderRight} from './TabHeaderRight/TabHeaderRight';

const Tab = createBottomTabNavigator();

const TabRoute = () => {
  const colors = useColors();

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
      {Object.values(tabRoutesConfig).map(
        ({name, Element, headerTitle, isPageScrolling}) => {
          const Wrapper = (props: ParamListBase) => {
            return (
              <Layout isPageScrolling={isPageScrolling}>
                <Element {...props} />
              </Layout>
            );
          };

          return (
            <Tab.Screen
              name={name}
              component={Wrapper}
              key={name}
              options={{
                title: '',
                headerStyle: {backgroundColor: colors.bgColor},
                headerShown: !!headerTitle,
                headerLeft: () =>
                  headerTitle ? (
                    <TabHeaderLeft title={headerTitle || ''} />
                  ) : null,
                headerRight: () => (headerTitle ? <TabHeaderRight /> : null),
              }}
            />
          );
        },
      )}
    </Tab.Navigator>
  );
};

export const ComponentWrapper = memo(TabRoute);
