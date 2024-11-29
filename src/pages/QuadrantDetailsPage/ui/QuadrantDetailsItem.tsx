import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {DisplayText} from '@src/shared/types/types';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {getQuadrantsImageUrls} from '@src/entities/Session';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {QUADRANT_DETAILS_CONTENT_TOP} from '../model/lib/QuadrantDetailsPageLib';
import {useTranslation} from 'react-i18next';

interface QuadrantDetailsItemProps {
  step: DisplayText;
  displayName: DisplayText;
  id: string;
  bottomTextComponent?: React.JSX.Element;
}

const QuadrantDetailsItem = (props: QuadrantDetailsItemProps) => {
  const {step, displayName, id} = props;
  const colors = useColors();
  const language = useLanguage();
  const {t} = useTranslation();

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, [colors]);

  const source = useMemo(() => {
    const image = getQuadrantsImageUrls()[id];

    return {
      uri: image,
    };
  }, [id]);

  return (
    <View style={{}}>
      <View style={styles.imageWrapper}>
        <FastImage style={styles.quadrantImage} source={source} />
      </View>

      <View style={styles.content}>
        <AppText
          style={textStyle}
          size={TextSize.LEVEL_2}
          weight={'600'}
          text={step?.[language]}
        />
        <View style={styles.quadrantTitle}>
          <View style={styles.quadrantName}>
            <AppText
              style={textStyle}
              size={TextSize.SIZE_32}
              weight={'900'}
              text={displayName?.[language]}
            />
          </View>
          <AppText
            style={textStyle}
            size={TextSize.LEVEL_5}
            weight={'700'}
            text={t('common.the_heart_of_relationship')}
          />
        </View>
        <View style={styles.bottomWrapper}>{props.bottomTextComponent}</View>
      </View>
    </View>
  );
};

export default memo(QuadrantDetailsItem);

const styles = StyleSheet.create({
  imageWrapper: {
    height: 470,
    width: windowWidth,
    top: 10,
  },
  quadrantImage: {
    height: '100%',
    width: '100%',
  },
  content: {
    padding: globalPadding,
    top: QUADRANT_DETAILS_CONTENT_TOP,
    width: windowWidth,
  },
  quadrantName: {
    marginVertical: verticalScale(5),
    maxWidth: horizontalScale(350),
  },
  quadrantTitle: {height: 170},
  bottomWrapper: {
    paddingHorizontal: globalPadding,
    flex: 1,
    width: '100%',
  },
});
