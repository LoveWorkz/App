import React, {memo, useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useFocusEffect} from '@react-navigation/native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {ArrowDownIcon} from '@src/shared/assets/icons/ArrowDown';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';

interface ChallengeGroupProps {
  title: string;
  children: any;
  description: string;
  isLoading: boolean;
}

const borderRadius = moderateScale(20);

const ChallengeGroup = (props: ChallengeGroupProps) => {
  const {title, description, isLoading, children} = props;

  const colors = useColors();
  const [isActive, setIsActive] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => setIsActive(false);
    }, []),
  );

  if (isLoading) {
    return <Skeleton width={'100%'} height={120} borderRadius={borderRadius} />;
  }

  const onPressHandler = () => {
    setIsActive(!isActive);
  };

  return (
    <View>
      <TouchableOpacity onPress={onPressHandler}>
        <View style={[styles.ChallengeGroup, {backgroundColor: colors.white}]}>
          <View
            style={[styles.iconWrapper, {backgroundColor: colors.bgColor}]}
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
                text={`${'10'}/${'100'}`}
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
  listWrapper: {
    marginTop: verticalScale(10),
  },
  iconWrapper: {
    height: horizontalScale(60),
    width: horizontalScale(60),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(20),
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
