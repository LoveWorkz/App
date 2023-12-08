import React, {memo, useMemo} from 'react';
import {StyleSheet, View, Modal, TouchableOpacity} from 'react-native';
import {SvgXml} from 'react-native-svg';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {
  globalPadding,
  windowHeight,
  windowHeightMinusPaddings,
  windowWidth,
} from '@src/app/styles/GlobalStyle';
import {CloseIcon} from '@src/shared/assets/icons/Close';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import {BookImage} from '../../model/types';

interface CarouselItemProps {
  bookImage: string;
}

interface BookPreviewItemProps {
  image: string;
}

interface BookProps {
  image: string;
  fullImage: BookImage;
  visible: boolean;
  onClose: () => void;
}

const CarouselItem = (props: CarouselItemProps) => {
  const {bookImage} = props;

  return <BookPreviewItem image={bookImage} />;
};

const BookPreviewItem = (props: BookPreviewItemProps) => {
  const {image} = props;

  const uri = useMemo(() => {
    return {
      uri: image,
      priority: FastImage.priority.normal,
    };
  }, [image]);

  return (
    <View style={styles.itemWrapper}>
      <FastImage resizeMode={'stretch'} style={styles.image} source={uri} />
    </View>
  );
};

const BookPreviewModal = (props: BookProps) => {
  const {image, fullImage, visible, onClose} = props;
  const colors = useColors();

  const onCloseHandler = () => {
    onClose?.();
  };

  const data = useMemo(() => {
    return [{bookImage: fullImage.front}, {bookImage: fullImage.back}];
  }, [fullImage]);

  const initialIndex = fullImage.front === image ? 0 : 1;

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onCloseHandler}>
      <View
        style={[
          styles.content,
          {
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
        <View style={styles.carouselWrapper}>
          <Carousel
            initialIndex={initialIndex}
            itemWidth={windowWidth}
            contentContainerStyle={styles.contentContainerStyle}
            data={data}
            isBottomPagination
            Component={CarouselItem}
            paginationStyle={styles.paginationStyle}
          />
        </View>
      </View>
    </Modal>
  );
};

export default memo(BookPreviewModal);

const styles = StyleSheet.create({
  closeIconWrapper: {
    position: 'absolute',
    right: horizontalScale(30),
    top: verticalScale(50),
  },
  image: {
    borderRadius: moderateScale(5),
    height: windowHeight * 0.64,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight,
  },
  carouselWrapper: {
    height: windowHeightMinusPaddings * 0.7,
  },
  contentContainerStyle: {
    paddingHorizontal: horizontalScale(10),
  },
  paginationStyle: {
    marginLeft: globalPadding,
  },

  itemWrapper: {
    paddingHorizontal: horizontalScale(10),
    width: windowWidth - globalPadding,
  },
});
