import * as React from 'react';
import {useWindowDimensions, StyleSheet, View} from 'react-native';
import {TabView as TabV, TabBar, Route} from 'react-native-tab-view';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {RenderSceneType} from '@src/shared/types/types';

const RenderTabBar = (props: RenderSceneType) => {
  const colors = useColors();

  return (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors.bgTabViewColor}}
      style={styles.tabbar}
      getLabelText={({route}) => route.title}
      renderLabel={({route, focused}) => {
        const text = route.title || '';

        let content = (
          <AppText
            weight={'700'}
            style={[styles.text, {color: colors.primaryTextColor}]}
            text={text}
          />
        );

        if (focused) {
          content = (
            <GradientText style={styles.text} weight={'700'} text={text} />
          );
        }

        return content;
      }}
    />
  );
};

interface TabViewProps {
  renderScene: (props: any) => React.ReactNode;
  tabNames: Route[];
  setIndex: (index: number) => void;
  index: number;
}

export const TabView = React.memo((props: TabViewProps) => {
  const {renderScene, tabNames, setIndex, index} = props;
  const layout = useWindowDimensions();

  const onIndexChange = React.useCallback(
    (newIndex: number) => {
      setIndex(newIndex);
    },
    [setIndex],
  );

  return (
    <View style={styles.TabView}>
      <TabV
        navigationState={{index: index, routes: tabNames}}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        initialLayout={{width: layout.width}}
        renderTabBar={RenderTabBar}
        swipeEnabled={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  TabView: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  text: {
    textTransform: 'capitalize',
  },
});
