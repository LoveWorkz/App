import React, {memo, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {SvgXml} from 'react-native-svg';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {UnlockedIcon} from '@src/shared/assets/icons/Unlocked';
import {ArrowDownIcon} from '@src/shared/assets/icons/ArrowDown';
import {CategoryKey} from '@src/entities/Category';
import SessionsList from '../SessionsList/SessionsList';
import {SessionType} from '../../model/types/sessionType';
import {getSessionsImages} from '../../model/lib/sessionLib';

interface CategoryBlockProps {
  title: string;
  sessions: SessionType[];
  categoryKey: CategoryKey;
}

const CategoryBlock = (props: CategoryBlockProps) => {
  const {title, sessions, categoryKey} = props;

  const colors = useColors();

  const [isActive, setIsActive] = useState(false);

  const onPressHandler = () => {
    setIsActive(!isActive);
  };

  const sessionImage = getSessionsImages(categoryKey);

  return (
    <View>
      <TouchableOpacity onPress={onPressHandler}>
        <FastImage style={styles.CategoryBlock} source={sessionImage}>
          <View style={styles.leftPart}>
            <View
              style={[
                styles.iconWrapper,
                {backgroundColor: colors.bgTertiaryColor},
              ]}>
              <View
                style={[
                  styles.content,
                  {
                    backgroundColor: colors.bgChallengeContentColor,
                  },
                ]}>
                <SvgXml xml={UnlockedIcon} style={styles.unlockedIcon} />
              </View>
            </View>
            <View style={styles.textWrapper}>
              <AppText
                style={[styles.title, {color: colors.white}]}
                weight={'500'}
                size={TextSize.LEVEL_4}
                text={title}
                lineHeight={20}
              />
              <AppText
                style={{color: colors.white}}
                weight={'500'}
                size={TextSize.LEVEL_4}
                text={'Lorem ipsum dolor sit amet, consectetur '}
                lineHeight={20}
                align={'justify'}
              />
            </View>
          </View>
          <View style={styles.arrowIcon}>
            <SvgXml
              xml={ArrowDownIcon}
              stroke={colors.white}
              style={styles.arrowIcon}
            />
          </View>
        </FastImage>
      </TouchableOpacity>
      {isActive && (
        <View style={styles.listWrapper}>
          <SessionsList sessions={sessions} />
        </View>
      )}
    </View>
  );
};

export default memo(CategoryBlock);

const styles = StyleSheet.create({
  CategoryBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#7CB9E8',
    borderRadius: moderateScale(20),
    padding: horizontalScale(15),
  },
  listWrapper: {
    marginTop: verticalScale(30),
  },
  leftPart: {
    flexDirection: 'row',
  },
  iconWrapper: {
    height: horizontalScale(60),
    width: horizontalScale(60),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(20),
  },
  content: {
    height: horizontalScale(50),
    width: horizontalScale(50),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    maxWidth: '60%',
  },
  title: {
    marginBottom: horizontalScale(10),
  },

  unlockedIcon: {
    width: horizontalScale(30),
    height: horizontalScale(35),
  },

  arrowIcon: {
    height: horizontalScale(15),
    width: horizontalScale(15),
  },
});
