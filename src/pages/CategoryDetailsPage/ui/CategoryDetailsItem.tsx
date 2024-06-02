import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import FastImage from 'react-native-fast-image';

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {globalStyles} from '@src/app/styles/GlobalStyle';
import {LockIconWithoutStyle} from '@src/shared/assets/icons/Lock';
import {
  CategoryImageType,
  CategoryKey,
  categoryStore,
} from '@src/entities/Category';
import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {DisplayText} from '@src/shared/types/types';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {isPlatformIos} from '@src/shared/consts/common';

interface CategoryDetailsItemProps {
  levelName: CategoryKey;
  displayName: DisplayText;
  image: CategoryImageType;
  isBlocked: boolean;
  allSessionsCount: number;
}

const CategoryDetailsItem = (props: CategoryDetailsItemProps) => {
  const {levelName, displayName, image, isBlocked, allSessionsCount} = props;

  const colors = useColors();
  const language = useLanguage();

  const uri = useMemo(() => {
    return {
      uri: image.middle,
    };
  }, [image]);

  const isContentLocked = categoryStore.checkContentLock(levelName);

  return (
    <FastImage style={styles.image} source={uri}>
      {isContentLocked ||
        (isBlocked && (
          <>
            <View style={[styles.layout, {backgroundColor: '#6C5DAE'}]} />
            <View style={[styles.lockIconWrapper]}>
              <SvgXml
                xml={LockIconWithoutStyle}
                fill={colors.white}
                style={styles.lockIcon}
              />
            </View>
          </>
        ))}
      <View style={styles.imageContent}>
        <AppText
          style={{color: colors.white}}
          weight={'700'}
          size={TextSize.SIZE_24}
          text={`${displayName[language]} Level`}
        />
        <AppText
          style={{color: colors.white}}
          weight={'700'}
          size={TextSize.LEVEL_4}
          text={`${allSessionsCount} sessions`}
        />
      </View>
    </FastImage>
  );
};

export default memo(CategoryDetailsItem);

const height = 180;
const width = horizontalScale(isPlatformIos ? 333 : 335);

const styles = StyleSheet.create({
  image: {
    height,
    borderRadius: moderateScale(20),
    padding: horizontalScale(10),
    marginHorizontal: horizontalScale(10),
    width,
  },
  imageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...globalStyles.zIndex_1,
  },

  layout: {
    position: 'absolute',
    opacity: 0.7,
    width,
    borderRadius: moderateScale(20),
    height,
    ...globalStyles.categoryLayoutZIndex,
  },
  lockIconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height,
    width,
    ...globalStyles.categoryLayoutIconZIndex,
  },
  lockIcon: {
    height: verticalScale(50),
    width: horizontalScale(40),
  },
});
