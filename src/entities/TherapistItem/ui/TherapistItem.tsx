import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import firebaseStorage from '@react-native-firebase/storage';
import {Avatar} from '@src/shared/ui/Avatar/Avatar';
import {useColors} from '@src/app/providers/colorsProvider';
import {useTheme} from '@src/app/providers/themeProvider';
import {AppText} from '@src/shared/ui/AppText/AppText';

type Props = {
  imageName: string;
  fullName: string;
  headline: string;
  isOdd?: boolean;
  onPress?: (avatarUri: string) => void;
};

export const TherapistItem = ({
  fullName,
  headline,
  imageName,
  isOdd,
  onPress,
}: Props) => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const colors = useColors();
  const {isDark} = useTheme();

  useEffect(() => {
    const asyncEffect = async () => {
      const url = await firebaseStorage()
        .ref(`therapists_data/${imageName}`)
        .getDownloadURL();
      setAvatarUrl(url);
    };
    asyncEffect();
  }, [imageName]);

  return (
    <View
      style={[styles.container, isOdd ? styles.oddStyles : styles.evenStyles]}>
      <TouchableOpacity
        onPress={() => onPress?.(avatarUrl)}
        style={[
          styles.tile,
          {backgroundColor: isDark ? colors.bgTertiaryColor : colors.white},
        ]}>
        <Avatar size={80} imageUrl={avatarUrl} />
        <AppText weight="700" style={styles.fullName} text={fullName} />
        <AppText style={styles.headline} text={headline} />
      </TouchableOpacity>
    </View>
  );
};

export default TherapistItem;

export const styles = StyleSheet.create({
  container: {
    width: '50%',
  },
  oddStyles: {
    paddingRight: 6,
  },
  evenStyles: {
    paddingLeft: 6,
  },
  tile: {
    minHeight: 220,
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 24,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  fullName: {
    fontSize: 16,
    marginTop: 12,
  },
  headline: {
    fontSize: 16,
    marginTop: 12,
    paddingBottom: 24,
  },
});
