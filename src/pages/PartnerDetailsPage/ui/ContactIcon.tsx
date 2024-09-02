import EmailIcon from '@src/shared/assets/icons/social/EmailIcon';
import InstagramIcon from '@src/shared/assets/icons/social/InstagramIcon';
import {LinkedInIcon} from '@src/shared/assets/icons/social/LinkedInIcon';
import WebsiteIcon from '@src/shared/assets/icons/social/WebsiteIcon';
import PhoneIcon from '@src/shared/assets/icons/social/PhoneIcon';
import YoutubeIcon from '@src/shared/assets/icons/social/YoutubeIcon';
import React from 'react';
import {useTheme} from '@src/app/providers/themeProvider';
import {useColors} from '@src/app/providers/colorsProvider';
import {StyleProp, ViewStyle} from 'react-native';

type IconProps = {
  iconName: string;
  style?: StyleProp<ViewStyle>;
};

const ContactIcon: React.FC<IconProps> = ({iconName, style}) => {
  const {isDark} = useTheme();
  const colors = useColors();
  switch (iconName) {
    case 'linkedin':
      return (
        <LinkedInIcon
          style={style}
          stroke={isDark ? colors.white : colors.primaryTextColor}
        />
      );
    case 'email':
      return (
        <EmailIcon
          style={style}
          stroke={isDark ? colors.white : colors.primaryTextColor}
        />
      );
    case 'website':
      return (
        <WebsiteIcon
          style={style}
          stroke={isDark ? colors.white : colors.primaryTextColor}
        />
      );
    case 'phone':
      return (
        <PhoneIcon
          style={style}
          stroke={isDark ? colors.white : colors.primaryTextColor}
        />
      );
    case 'instagram':
      return (
        <InstagramIcon
          style={style}
          stroke={isDark ? colors.white : colors.primaryTextColor}
        />
      );
    case 'youtube':
      return (
        <YoutubeIcon
          style={style}
          stroke={isDark ? colors.white : colors.primaryTextColor}
        />
      );
    default:
      return null;
  }
};

export default ContactIcon;
