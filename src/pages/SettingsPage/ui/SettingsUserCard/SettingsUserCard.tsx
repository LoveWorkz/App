import React, {memo, useState} from 'react';
import {View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {observer} from 'mobx-react-lite';

import {LogOutIcon} from '@src/shared/assets/icons/LogOut';
import {UserCard} from '@src/shared/ui/UserCard/UserCard';
import {LogOutModal} from '@src/features/LogOut';
import {useColors} from '@src/app/providers/colorsProvider';
import {userStore} from '@src/entities/User';

const SettingsUserCard = () => {
  const colors = useColors();
  const [visible, setVisible] = useState(false);

  const user = userStore.user;
  if (!user) {
    return <></>;
  }

  const onLogoutHandler = () => {
    setVisible(true);
  };

  return (
    <View>
      <UserCard
        nameStyle={{color: colors.primaryTextColor}}
        titleStyle={{color: '#9A9AA5'}}
        onIconPressHandler={onLogoutHandler}
        imageUrl={user.photo || ''}
        name={user.name || ''}
        title={user.email || ''}
        Icon={<SvgXml xml={LogOutIcon} stroke={colors.primaryTextColor} />}
      />
      <LogOutModal visible={visible} setVisible={setVisible} />
    </View>
  );
};

export default memo(observer(SettingsUserCard));
