import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {useColors} from '@src/app/providers/colorsProvider';

interface TabHeaderProps {
  title: string;
}

const TabHeaderLeft = (props: TabHeaderProps) => {
  const {title} = props;
  const colors = useColors();
  const {t} = useTranslation();

  return (
    <View style={[styles.TabHeaderRight, {paddingRight: globalPadding}]}>
      <AppText
        weight={'700'}
        size={TextSize.LEVEL_6}
        style={[
          styles.title,
          {paddingLeft: globalPadding, color: colors.primaryTextColor},
        ]}
        text={t(title)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  TabHeaderRight: {
    justifyContent: 'center',
    width: windowWidth * 0.8,
  },
  title: {
    textTransform: 'capitalize',
  },
});

export default memo(TabHeaderLeft);
