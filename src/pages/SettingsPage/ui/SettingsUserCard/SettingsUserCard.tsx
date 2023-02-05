import React, {memo, useState} from 'react';
import {View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {observer} from 'mobx-react-lite';

import {profileStore} from '@src/entities/Profile';
import {LogOutIcon} from '@src/shared/assets/icons/LogOut';
import {UserCard} from '@src/shared/ui/UserCard/UserCard';
import {LogOutModal} from '@src/features/LogOut';

const SettingsUserCard = () => {
  const profile = profileStore.profileData;

  const [visible, setVisible] = useState(false);

  const onLogoutHandler = () => {
    setVisible(true);
  };

  return (
    <View>
      <UserCard
        onIconPressHandler={onLogoutHandler}
        imageUrl={profile?.photo || ''}
        name={profile?.name || ''}
        title={profile?.email || ''}
        Icon={<SvgXml xml={LogOutIcon} />}
      />
      {visible && <LogOutModal visible={visible} setVisible={setVisible} />}
    </View>
  );
};

export const Wrapper = memo(observer(SettingsUserCard));
