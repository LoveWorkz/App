
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
import { memo } from "react";

interface guideModalProps {
  visible: boolean,
  hideModal: Function,
  onModalHide: () => void
}

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =
  Platform.OS === "ios"
    ? Dimensions.get("window").height
    : require("react-native-extra-dimensions-android").get(
        "REAL_WINDOW_HEIGHT"
      );

function GuidedTourModal4({visible, hideModal, onModalHide }: guideModalProps) {
  const toggleNextModal = () => {
    hideModal();
  };
  const colors = useColors();
  const {t} = useTranslation();
  const {isDark} = useTheme();

  const text2 = t('common.guide_modal4_text1');
  const text3 = t('common.guide_modal4_text2');

  return (
      <Modal
        onModalHide={onModalHide}
        coverScreen={false}
        isVisible={visible} 
        backdropOpacity={0}
        animationOutTiming={2000}
        animationInTiming={2000}
        animationIn={"slideInUp"}
        animationOut={"fadeOutUp"}
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
            text={t('common.guide_modal4_title')}
          />
          <View>
            <Text 
              style={{
              textAlign: "center",
              marginBottom: verticalScale(10),
            }}
            >
              <AppText
                size={TextSize.LEVEL_4}
                text={text2}
              />
            </Text>
            <Text
                style={{
                textAlign: "center",
                marginBottom: verticalScale(10),
              }}
            >
              <AppText
                size={TextSize.LEVEL_4}
                text={text3}
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
    top: verticalScale(80),
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


export default memo(GuidedTourModal4);