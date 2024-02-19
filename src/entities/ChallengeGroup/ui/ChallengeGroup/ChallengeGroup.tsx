import React, {memo, useCallback, useState} from 'react';
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
import {challengeImage} from '@src/shared/assets/images';

interface ChallengeGroupProps {
  title: string;
  children: any;
  description: string;
  challengesCount: number;
  activeChallengesCount: number;
}

const borderRadius = moderateScale(20);

const ChallengeGroup = (props: ChallengeGroupProps) => {
  const {title, description, children, challengesCount, activeChallengesCount} =
    props;

  const colors = useColors();
  const [isActive, setIsActive] = useState(false);

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
        <View style={[styles.ChallengeGroup, {backgroundColor: colors.white}]}>
          <FastImage
            style={styles.img}
            resizeMode={'stretch'}
            source={challengeImage}
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
