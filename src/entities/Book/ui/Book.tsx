import React, {memo, useCallback, useMemo, useState} from 'react';
import {StyleSheet, View, Image, Pressable} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {BookCategory, BookCategorySize} from '@src/entities/BookCategory';
import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import {
  globalStyles,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {BookType} from '../model/types';
import BookPreviewModal from './BookPreviewModal/BookPreviewModal';
import Description from './Description/Description';

interface BookPreview {
  image: string;
  onModalOpenHandler: () => void;
}

const BookPreview = memo((props: BookPreview) => {
  const {image, onModalOpenHandler} = props;

  const uri = useMemo(() => {
    return {
      uri: image,
    };
  }, [image]);

  return (
    <Pressable onPress={onModalOpenHandler} style={styles.imageWrapper}>
      <Image style={styles.image} source={uri} />
    </Pressable>
  );
});

interface BookProps {
  bookInfo: BookType;
}

export const Book = (props: BookProps) => {
  const {bookInfo} = props;
  const {image, name, description, author, Categories} = bookInfo;

  const colors = useColors();
  const [isBookModalVisible, setIsBookModalVisible] = useState(false);

  const onModalCloseHandler = useCallback(() => {
    return setIsBookModalVisible(false);
  }, []);

  const onModalOpenHandler = () => {
    setIsBookModalVisible(true);
  };

  const bookCarouselData = [
    {
      bookImage: image.front,
    },
    {
      bookImage: image.back,
    },
  ];

  return (
    <View style={styles.Book}>
      <View style={styles.topBlock}>
        <View style={[{width: windowWidthMinusPaddings * 0.5}]}>
          <Carousel
            itemWidth={windowWidthMinusPaddings * 0.5}
            itemStyle={[
              {
                ...globalStyles.shadowOpacity,
              },
            ]}
            isTopPagination
            data={bookCarouselData}
            Component={({bookImage}: {bookImage: string}) => {
              return (
                <BookPreview
                  onModalOpenHandler={onModalOpenHandler}
                  image={bookImage}
                />
              );
            }}
          />
        </View>

        <BookPreviewModal
          image={image.front}
          visible={isBookModalVisible}
          onClose={onModalCloseHandler}
        />

        <View style={styles.bookInfo}>
          <AppText
            style={{color: colors.primaryTextColor}}
            weight={'600'}
            size={TextSize.LEVEL_7}
            text={name}
          />
          <AppText
            style={{color: colors.primaryTextColor}}
            weight={'500'}
            size={TextSize.LEVEL_4}
            text={author}
          />
          <View style={styles.categories}>
            {Categories.map(category => {
              return (
                <View style={styles.category} key={category}>
                  <BookCategory
                    category={category}
                    size={BookCategorySize.SMALL}
                    text={category}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <Description description={description} />
    </View>
  );
};

export const Wrapper = memo(Book);

const styles = StyleSheet.create({
  Book: {
    flex: 1,
  },
  topBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    height: 210,
    width: 150,
    borderRadius: 5,
    marginTop: 15,
  },
  bookInfo: {
    width: '50%',
    marginTop: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    borderRadius: 5,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  category: {
    padding: 4,
  },
});
