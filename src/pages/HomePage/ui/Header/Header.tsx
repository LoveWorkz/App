import React, {memo} from 'react';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {SettingsIcon} from '@src/shared/assets/icons/Settings';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {UserCard} from '@src/shared/ui/UserCard/UserCard';
import {useColors} from '@src/app/providers/colorsProvider';

interface HeaderProps {
  imageUrl: string;
  name: string;
}

const Header = (props: HeaderProps) => {
  const {imageUrl, name} = props;
  const {t} = useTranslation();
  const colors = useColors();

  const onSettingsPressHandler = () => {
    navigation.navigate(AppRouteNames.SETTINGS);
  };

  const onProfilePressHandler = () => {
    navigation.navigate(AppRouteNames.PROFILE);
  };

  return (
    <UserCard
      nameStyle={{color: colors.primaryTextColor}}
      titleStyle={{color: colors.primaryTextColor}}
      onContentPressHandler={onProfilePressHandler}
      onIconPressHandler={onSettingsPressHandler}
      title={t('home.welcome_back')}
      name={name}
      imageUrl={imageUrl}
      Icon={
        <SvgXml
          fillOpacity={''}
          xml={SettingsIcon}
          fill={colors.primaryTextColor}
          height={24}
          width={24}
        />
      }
    />
  );
};

export const ComponentWrapper = memo(Header);
