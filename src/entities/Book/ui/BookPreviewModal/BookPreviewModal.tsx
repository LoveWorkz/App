import React, {memo, useMemo} from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  Modal,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {globalPadding} from '@src/app/styles/GlobalStyle';
import {CloseIcon} from '@src/shared/assets/icons/Close';

interface BookProps {
  image: string;
  visible: boolean;
  onClose: () => void;
}

const BookPreviewModal = (props: BookProps) => {
  const {image, visible, onClose} = props;
  const colors = useColors();

  const {height} = useWindowDimensions();

  const onCloseHandler = () => {
    onClose?.();
  };

  const uri = useMemo(() => {
    return {
      uri: image,
    };
  }, [image]);

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onCloseHandler}>
      <View style={[styles.content, {height, padding: globalPadding}]}>
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
        <ImageBackground
          resizeMode={'stretch'}
          style={[styles.image, {height: height * 0.6}]}
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
    right: 30,
    top: 60,
  },
  image: {
    width: '100%',
    borderRadius: 5,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
