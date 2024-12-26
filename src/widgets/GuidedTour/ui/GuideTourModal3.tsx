
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { horizontalScale, moderateScale, verticalScale } from "@src/shared/lib/Metrics";
import { AppText, TextSize } from "@src/shared/ui/AppText/AppText";
import {useColors} from '@src/app/providers/colorsProvider';
import {useTheme} from '@src/app/providers/themeProvider';
import {useTranslation} from 'react-i18next';
import { Button, ButtonTheme } from "@src/shared/ui/Button/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import splitText from "@src/shared/utils/splitText";
import { memo } from "react";


interface guideModalProps {
  visible: boolean,
  hideModal: Function,
}

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =
  Platform.OS === "ios"
    ? Dimensions.get("window").height
    : require("react-native-extra-dimensions-android").get(
        "REAL_WINDOW_HEIGHT"
      );

function GuidedTourModal3({visible, hideModal }: guideModalProps) {
  const toggleNextModal = () => {
    hideModal();
  };
  const colors = useColors();
  const {t} = useTranslation();
  const {isDark} = useTheme();

  const text2 = splitText(t('common.guide_modal3_text1'));
  const text3 = splitText(t('common.guide_modal3_text2'));
  const text4 = splitText(t('common.guide_modal3_text3'));

  return (
      <Modal
         coverScreen={false}
         isVisible={visible} 
         backdropOpacity={0}
         animationIn={"slideInDown"}
         animationOut={"fadeOutUp"}
         animationOutTiming={2000}
         animationInTiming={2000}
         deviceWidth={deviceWidth}
         deviceHeight={deviceHeight}
        >
        <View style={[
          styles.content,
          {
            backgroundColor: colors.bgColor
          },
        ]}>
          <AppText
            style={styles.title}
            size={TextSize.LEVEL_5}
            weight={'600'}
            text={t('common.guide_modal3_title')}
          />
          <View>
            <Text 
              style={{
              textAlign: "center",
              marginBottom: verticalScale(10),
            }}
            >
              <AppText
                weight="600"
                size={TextSize.LEVEL_4}
                text={text2.firstWord}
              />
              <AppText
                size={TextSize.LEVEL_4}
                text={text2.otherText}
              />
            </Text>
            <Text
                style={{
                textAlign: "center",
                marginBottom: verticalScale(10),
              }}
            >
              <AppText 
                weight="600"
                size={TextSize.LEVEL_4}
                text={text3.firstWord}
              />
              <AppText
                size={TextSize.LEVEL_4}
                text={text3.otherText}
              />
            </Text>
            <Text
              style={{textAlign: "center",}}
            >
              <AppText 
                size={TextSize.LEVEL_4}
                weight="600"
                text={text4.firstWord}
              />
              <AppText
                size={TextSize.LEVEL_4} 
                text={text4.otherText}
              />
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
                onPress={()=>{ toggleNextModal() }}
                theme={ButtonTheme.GRADIENT}
                style={styles.btn}>
                <AppText
                  style={{color: isDark ? colors.white : colors.bgQuinaryColor}}
                  size={TextSize.LEVEL_5}
                  weight={'600'}
                  text={t('common.next')}
                />
              </Button>
          </View>
        </View>
      </Modal>
  );
}

const styles = StyleSheet.create<any>({
  content: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    alignItems: 'center',
    borderRadius: moderateScale(25),
    position: 'absolute',
    zIndex: 100,
    width: '100%',
    top: verticalScale(15),
    shadowColor: "rgba(105, 95, 203, 0.3)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: verticalScale(20),
  },
  btn: {
    width: '100%',
  },

  settingDescription: {
    marginTop: verticalScale(15),
  },
  arrowIcon: {
    height: horizontalScale(15),
    width: horizontalScale(15),
    marginLeft: horizontalScale(10),
  },
});


export default memo(GuidedTourModal3);