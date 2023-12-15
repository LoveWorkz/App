import React, {memo} from 'react';
import {StyleSheet} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import SettingItems from '../SettingItems/SettingItems';
import {SettingItemType} from '../../model/types/settingsType';

interface SettingGroupProps {
  title: string;
  items: SettingItemType[];
}

const SettingGroup = (props: SettingGroupProps) => {
  const {title, items} = props;
  const colors = useColors();

  return (
    <>
      <AppText
        style={[styles.title, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_8}
        text={title}
      />
      <SettingItems items={items} />
    </>
  );
};

export default memo(SettingGroup);

const styles = StyleSheet.create({
  title: {
    marginBottom: verticalScale(15),
  },
});
