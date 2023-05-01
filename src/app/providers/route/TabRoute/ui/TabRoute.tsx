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
      initialRouteName={TabRoutesNames.CHALLENGES}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          ...globalStyles.strongShadowOpacity,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 80,
          paddingTop: 10,
          backgroundColor: colors.bgQuaternaryColor,
          position: 'absolute',
          bottom: 0,
          borderTopColor: colors.bgQuaternaryColor,
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
          isHomePage,
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
                headerStyle: {
                  backgroundColor: isHomePage
                    ? colors.bgHomePageHeaderColor
                    : colors.bgColor,
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 0,
                },
                headerShown: headerShown,
                headerLeft: () =>
                  HeaderLeft ? (
                    <HeaderLeft {...route.params} title={headerTitle} />
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
