
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import Modal from "react-native-modal";
import { horizontalScale, moderateScale, verticalScale } from "@src/shared/lib/Metrics";
import { AppText, TextSize } from "@src/shared/ui/AppText/AppText";
import {useColors} from '@src/app/providers/colorsProvider';
import {useTheme} from '@src/app/providers/themeProvider';
import {useTranslation} from 'react-i18next';
import { Button, ButtonTheme } from "@src/shared/ui/Button/Button";
import { getArrowRightIcon } from "@src/shared/assets/icons/ArrowRight";
import { SvgXml } from "react-native-svg";
import {APPLICATION_NAME} from '@src/app/config/appConfig';
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

function GuidedTourModal5({visible, hideModal, onModalHide }: guideModalProps) {
  const toggleNextModal = () => {
    hideModal();
  };
  const colors = useColors();
  const {t} = useTranslation();
  const {isDark} = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <Modal 
        isVisible={visible} 
        backdropOpacity={0}
        animationOutTiming={1000}
        animationInTiming={3000}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
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
            size={TextSize.LEVEL_6}
            align="center"
            weight={'600'}
            text={`${t('common.welcome_to')} ${APPLICATION_NAME}`}
          />
          <AppText
            style={styles.title}
            size={TextSize.LEVEL_5}
            align="center"
            text={t('common.welcome_to_desc')}
          />
          <View style={styles.buttonContainer}>
            <Button
                onPress={()=>{ toggleNextModal() }}
                theme={ButtonTheme.GRADIENT}
                style={styles.btn}>
                <AppText
                  style={{color: isDark ? colors.white : colors.bgQuinaryColor}}
                  size={TextSize.LEVEL_5}
                  weight={'600'}
                  text={t('common.start_tour_here')}
                />
                <SvgXml
                   xml={getArrowRightIcon({})}
                   style={styles.arrowIcon}
                   fill={isDark ? colors.white : colors.bgQuinaryColor}
                />
              </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create<any>({
  content: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    alignItems: 'center',
    borderRadius: moderateScale(25),
    width: '100%',
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
    marginBottom: verticalScale(4),
  },
  buttonContainer: {
    width: '100%',
    marginTop: verticalScale(20),
  },
  btn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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


export default memo(GuidedTourModal5);