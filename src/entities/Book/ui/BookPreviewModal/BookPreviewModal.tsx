import React, {memo, useMemo} from 'react';
import {StyleSheet, View, Modal, TouchableOpacity} from 'react-native';
import {SvgXml} from 'react-native-svg';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {globalPadding, windowHeight} from '@src/app/styles/GlobalStyle';
import {CloseIcon} from '@src/shared/assets/icons/Close';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';

interface BookProps {
  image: string;
  visible: boolean;
  onClose: () => void;
}

const BookPreviewModal = (props: BookProps) => {
  const {image, visible, onClose} = props;
  const colors = useColors();

  const onCloseHandler = () => {
    onClose?.();
  };

  const uri = useMemo(() => {
    return {
      uri: image,
      priority: FastImage.priority.normal,
    };
  }, [image]);

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onCloseHandler}>
      <View
        style={[
          styles.content,
          {
            height: windowHeight,
            padding: globalPadding,
            backgroundColor: colors.bgColor,
          },
        ]}>
        <TouchableOpacity
          style={styles.closeIconWrapper}
          onPress={onCloseHandler}>
          <SvgXml
            xml={CloseIcon}
            fill={colors.primaryTextColor}
            height={15}
            width={15}
          />
        </TouchableOpacity>

        <View />
        <FastImage
          resizeMode={'stretch'}
          style={[styles.image, {height: windowHeight * 0.6}]}
          source={uri}
        />
      </View>
    </Modal>
  );
};

export default memo(BookPreviewModal);

const styles = StyleSheet.create({
  closeIconWrapper: {
    position: 'absolute',
    right: horizontalScale(30),
    top: verticalScale(60),
  },
  image: {
    width: '100%',
    borderRadius: moderateScale(5),
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
