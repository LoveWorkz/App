import React, {memo, useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {ArrowDownIcon} from '@src/shared/assets/icons/ArrowDown';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useTheme} from '@src/app/providers/themeProvider';
import firebaseStorage from '@react-native-firebase/storage';

interface ChallengeGroupProps {
  title: string;
  children: any;
  description: string;
  challengesCount: number;
  activeChallengesCount: number;
  imageName: string;
  isCore?: boolean;
}

const borderRadius = moderateScale(20);

const ChallengeGroup = (props: ChallengeGroupProps) => {
  const {
    title,
    description,
    children,
    challengesCount,
    activeChallengesCount,
    imageName,
    isCore,
  } = props;

  const colors = useColors();
  const [isActive, setIsActive] = useState(false);
  const {isDark} = useTheme();
  const [imageUrl, setImageUrl] = React.useState('');

  const imageVariant = isDark ? 'dark' : 'light';
  const mainImagePath = isCore
    ? 'core_challenges_groups'
    : 'special_challenge_groups';

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const url = await firebaseStorage()
          .ref(`${mainImagePath}/images/${imageVariant}/${imageName}`)
          .getDownloadURL();
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image URL:', error);
      }
    };

    if (imageName) {
      fetchImageUrl();
    }
  }, [imageName, imageVariant, mainImagePath]);

  useFocusEffect(
    useCallback(() => {
      return () => setIsActive(false);
    }, []),
  );

  const onPressHandler = () => {
    setIsActive(!isActive);
  };

  return (
    <View>
      <TouchableOpacity onPress={onPressHandler}>
        <View
          style={[
            styles.ChallengeGroup,
            {backgroundColor: isDark ? colors.bgTertiaryColor : colors.white},
          ]}>
          <FastImage
            style={styles.img}
            resizeMode={'stretch'}
            source={{uri: imageUrl}}
          />
          <View style={styles.textWrapper}>
            <AppText
              style={[styles.title, {color: colors.primaryTextColor}]}
              weight={'600'}
              size={TextSize.LEVEL_4}
              text={title}
              lineHeight={20}
            />
            <AppText
              style={{color: colors.primaryTextColor}}
              weight={'600'}
              size={TextSize.LEVEL_2}
              text={description}
              lineHeight={20}
            />
          </View>
          <View style={styles.arrowIconWrapper}>
            <View style={styles.countWrapper}>
              <GradientText
                weight={'500'}
                size={TextSize.LEVEL_3}
                text={`${activeChallengesCount || 0}/${challengesCount || 0}`}
              />
            </View>
            <SvgXml
              xml={ArrowDownIcon}
              stroke={colors.primaryTextColor}
              style={styles.arrowIcon}
            />
          </View>
        </View>
      </TouchableOpacity>
      {isActive && <View style={styles.listWrapper}>{children}</View>}
    </View>
  );
};

export default memo(ChallengeGroup);

const padding = horizontalScale(15);

const styles = StyleSheet.create({
  ChallengeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius,
    padding,
  },
  img: {
    height: horizontalScale(70),
    width: horizontalScale(70),
    left: -5,
  },
  listWrapper: {
    marginTop: verticalScale(10),
  },
  textWrapper: {
    width: horizontalScale(220),
  },
  title: {
    marginBottom: horizontalScale(10),
    width: '75%',
  },
  arrowIconWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    right: padding,
    top: padding,
  },
  arrowIcon: {
    height: horizontalScale(13),
    width: horizontalScale(13),
  },
  countWrapper: {
    right: horizontalScale(8),
  },
});
