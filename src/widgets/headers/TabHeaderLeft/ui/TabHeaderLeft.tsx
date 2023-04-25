import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {useColors} from '@src/app/providers/colorsProvider';

interface TabHeaderProps {
  title: string;
}

const TabHeaderLeft = (props: TabHeaderProps) => {
  const {title} = props;
  const colors = useColors();
  return (
    <View
      style={[
        styles.TabHeaderRight,
        {paddingRight: globalPadding, width: windowWidth * 0.7},
      ]}>
      <AppText
        weight={'500'}
        size={TextSize.LEVEL_6}
        style={{paddingLeft: globalPadding, color: colors.primaryTextColor}}
        text={title}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  TabHeaderRight: {
    justifyContent: 'center',
  },
});

export default memo(TabHeaderLeft);
