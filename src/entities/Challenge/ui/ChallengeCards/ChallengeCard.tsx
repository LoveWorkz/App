import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgUri, SvgXml} from 'react-native-svg';
import {WebView} from 'react-native-webview';

import {TextSize} from '@src/shared/ui/AppText/AppText';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {
  getShadowOpacity,
  globalStyles,
  windowHeight,
} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {HeartsIcon} from '@src/shared/assets/icons/Hearts';
import {
  CARD_HEIGHT,
  CARD_HEIGHT_SPECIAL,
  CARD_WIDTH,
} from '@src/shared/consts/common';
import {useColors} from '@src/app/providers/colorsProvider';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {DisplayText} from '@src/shared/types/types';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {APPLICATION_NAME} from '@src/app/config/appConfig';

import storage from '@react-native-firebase/storage';

interface ChallengeCardProps {
  title: DisplayText;
  showButton: boolean;
  body: DisplayText;
  specialChallengeId: string;
  isSelectingChallenge: boolean;
  isChecked: boolean;
  cardId?: string;
  svgName?: string;
  isSvg?: boolean;
}

const ChallengeCard = (props: ChallengeCardProps) => {
  const {body, isSvg, svgName} = props;
  const {theme, isDark} = useTheme();
  const colors = useColors();
  const language = useLanguage();
  const [svgUrl, setSvgUrl] = useState<string>();

  const [_numberOfLines, _setNumberOfLines] = useState<number | null>(null);

  useEffect(() => {
    const asyncEffect = async () => {
      const url = await storage()
        .ref(
          `/challenges_svg/${svgName ?? 'card-1-1'}-${
            !isDark ? language : language + '-dark'
          }.svg`,
        )
        .getDownloadURL();

      setSvgUrl(url);
    };
    asyncEffect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={[
        styles.ChallengeCard,
        {
          ...getShadowOpacity(theme, colors.bgColor).shadowOpacity_level_2,
          backgroundColor: isDark ? colors.bgTertiaryColor : colors.white,
        },
      ]}>
      {/* <View style={styles.iconWrapper}>
        <SvgXml
          xml={HeartsIcon}
          width={horizontalScale(60)}
          height={horizontalScale(60)}
        />
      </View> */}

      {isSvg && svgUrl && <SvgUri width="100%" height="100%" uri={svgUrl} />}

      {!isSvg && (
        <WebView
          source={{
            html: `
         <!DOCTYPE html>
         <html>
           <head>
             <meta name="viewport" content="initial-scale=1.0">
             <style>
            body, html {
              -webkit-user-select: none;
              -ms-user-select: none;
              user-select: none;
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
          </style>
           </head>
           <body>
            ${body[language]}
           </body>
         </html>`,
          }}
          style={styles.htmlStyle}
          bounces={false}
          scalesPageToFit={false}
        />
      )}

      {/* <View style={styles.appNameWrapper}>
        <GradientText
          size={TextSize.LEVEL_2}
          weight={'700'}
          text={`...${APPLICATION_NAME}`}
        />
      </View> */}
    </View>
  );
};

export default memo(ChallengeCard);

const paddingHorizontal = horizontalScale(20);

const styles = StyleSheet.create({
  ChallengeCard: {
    // height: '100%',
    flex: 1,
    // marginBottom: 20,
    // width: horizontalScale(CARD_WIDTH),
    aspectRatio: 0.576,
    borderRadius: moderateScale(20),
    // paddingHorizontal,
    // paddingTop: verticalScale(30),
    overflow: 'hidden',
  },
  content: {
    marginTop: verticalScale(20),
  },
  iconWrapper: {
    position: 'absolute',
    bottom: verticalScale(-18),
    left: 0,
    ...globalStyles.zIndex_1,
  },
  btnWrapper: {
    width: horizontalScale(CARD_WIDTH),
    position: 'absolute',
    bottom: verticalScale(45),
    alignItems: 'center',
    ...globalStyles.zIndex_1,
  },
  btn: {
    width: '87%',
  },

  htmlStyle: {
    ...globalStyles.Quicksand_Regular,
  },
  appNameWrapper: {
    position: 'absolute',
    bottom: paddingHorizontal,
    right: paddingHorizontal,
  },
});
