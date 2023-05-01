import React, {memo, useState} from 'react';
import {View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {observer} from 'mobx-react-lite';

import {profileStore} from '@src/entities/Profile';
import {LogOutIcon} from '@src/shared/assets/icons/LogOut';
import {UserCard} from '@src/shared/ui/UserCard/UserCard';
import {LogOutModal} from '@src/features/LogOut';
import {useColors} from '@src/app/providers/colorsProvider';

const SettingsUserCard = () => {
  const colors = useColors();

  const profile = profileStore.profileData;

  const [visible, setVisible] = useState(false);

  const onLogoutHandler = () => {
    setVisible(true);
  };

  return (
    <View>
      <UserCard
        nameStyle={{color: colors.primaryTextColor}}
        titleStyle={{color: '#9A9AA5'}}
        onIconPressHandler={onLogoutHandler}
        imageUrl={profileStore.avatar || ''}
        name={profile?.name || ''}
        title={profile?.email || ''}
        Icon={<SvgXml xml={LogOutIcon} stroke={colors.primaryTextColor} />}
      />
      <LogOutModal visible={visible} setVisible={setVisible} />
    </View>
  );
};

export default memo(observer(SettingsUserCard));
