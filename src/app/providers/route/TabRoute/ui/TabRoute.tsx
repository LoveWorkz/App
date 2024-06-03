import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  tabRoutesConfig,
  TabRoutesNames,
} from '@src/shared/config/route/tabConfigRoutes';
import {getShadowOpacity, tabBarHeight} from '@src/app/styles/GlobalStyle';
import {useColors} from '@src/app/providers/colorsProvider';
import {moderateScale, verticalScale} from '@src/shared/lib/Metrics';
import {useTheme} from '@src/app/providers/themeProvider';
import {TabHeaderRight} from '@src/widgets/headers/TabHeaderRight';
import IconItem from './IconItem/IconItem';
import {getTabIcon} from '../lib/getIcon';

const Tab = createBottomTabNavigator();

const TabRoute = () => {
  const colors = useColors();
  const {theme} = useTheme();

  return (
    <Tab.Navigator
      backBehavior={'history'}
      initialRouteName={TabRoutesNames.HOME}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          ...getShadowOpacity(theme).shadowOpacity_level_3,
          borderTopLeftRadius: moderateScale(40),
          borderTopRightRadius: moderateScale(40),
          height: verticalScale(tabBarHeight),
          paddingTop: 10,
          backgroundColor: colors.whisperWhite,
          position: 'absolute',
          bottom: 0,
          borderTopColor: colors.bgQuaternaryColor,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({focused}) => {
          const routeName = route.name;

          const getIcon = getTabIcon(routeName);

          return <IconItem icon={getIcon} focused={focused} name={routeName} />;
        },
      })}>
      <Tab.Group>
        {Object.values(tabRoutesConfig).map(
          ({
            name,
            Element,
            headerTitle,
            headerShown,
            HeaderLeft,
            isHomePage,
            tabName,
          }) => {
            return (
              <Tab.Screen
                name={name}
                component={Element}
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
                    headerShown ? (
                      <TabHeaderRight tabName={tabName} {...route.params} />
                    ) : null,
                })}
              />
            );
          },
        )}
      </Tab.Group>
    </Tab.Navigator>
  );
};

export const ComponentWrapper = memo(TabRoute);
