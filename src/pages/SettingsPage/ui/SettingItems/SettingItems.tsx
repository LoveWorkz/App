import React, {memo} from 'react';

import SettingItem from '../SettingItem/SettingItem';
import {SettingItemType} from '../../model/types/settingsType';

interface SettingItemsProps {
  items: SettingItemType[];
}

const SettingItems = (props: SettingItemsProps) => {
  const {items} = props;

  return (
    <>
      {items.map(item => {
        return (
          <SettingItem
            RightSideComponent={item.RightSideComponent}
            Icon={item.Icon}
            text={item.text}
            key={item.text}
            path={item.path}
            onPress={item.onPress}
            isPressable={item.isPressable}
          />
        );
      })}
    </>
  );
};

export default memo(SettingItems);
