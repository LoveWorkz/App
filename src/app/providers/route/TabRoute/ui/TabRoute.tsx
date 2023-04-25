import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ParamListBase} from '@react-navigation/native';

import {
  tabRoutesConfig,
  TabRoutesNames,
} from '@src/shared/config/route/tabConfigRoutes';
import {Layout} from '@src/app/providers/layout';
import {globalStyles} from '@src/app/styles/GlobalStyle';
import {useColors} from '@src/app/providers/colorsProvider';
import {TabHeaderRight} from '@src/widgets/headers/TabHeaderRight';
import {ComponentWrapper as IconItem} from './IconItem/IconItem';
import {getTabIcon} from '../lib/getIcon';

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
        ({
          name,
          Element,
          headerTitle,
          isPageScrolling,
          deleteBottomPadding,
          deleteTopPadding,
          headerShown,
          HeaderLeft,
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

          return (
            <Tab.Screen
              name={name}
              component={Wrapper}
              key={name}
              options={({route}) => ({
                title: '',
                headerStyle: {backgroundColor: colors.bgColor},
                headerShown: headerShown,
                headerLeft: () =>
                  HeaderLeft ? (
                    <HeaderLeft {...route.params} title={headerTitle || ''} />
                  ) : null,
                headerRight: () =>
                  headerShown ? <TabHeaderRight {...route.params} /> : null,
              })}
            />
          );
        },
      )}
    </Tab.Navigator>
  );
};

export const ComponentWrapper = memo(TabRoute);
