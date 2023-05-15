import React, {memo, useCallback, useMemo, useState} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  RubricFilterItem,
  BookCategorySize,
} from '@src/entities/RubricFilterItem';
import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import {
  getShadowOpacity,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {StarRatings} from '@src/shared/ui/StarRatings/StarRatings';
import {useTheme} from '@src/app/providers/themeProvider';
import {BookType} from '../model/types';
import BookPreviewModal from './BookPreviewModal/BookPreviewModal';
import Description from './Description/Description';

interface BookPreview {
  image: string;
}

const BookPreview = memo((props: BookPreview) => {
  const {image} = props;

  const {theme} = useTheme();

  const [isBookModalVisible, setIsBookModalVisible] = useState(false);

  const onModalCloseHandler = useCallback(() => {
    return setIsBookModalVisible(false);
  }, []);

  const onModalOpenHandler = () => {
    setIsBookModalVisible(true);
  };

  const uri = useMemo(() => {
    return {
      uri: image,
      priority: FastImage.priority.normal,
    };
  }, [image]);

  return (
    <Pressable
      onPress={onModalOpenHandler}
      style={[
        styles.imageWrapper,
        {
          ...getShadowOpacity(theme).shadowOpacity_level_2,
        },
      ]}>
      <FastImage style={styles.image} resizeMode={'stretch'} source={uri} />
      <BookPreviewModal
        image={image}
        visible={isBookModalVisible}
        onClose={onModalCloseHandler}
      />
    </Pressable>
  );
});

interface BookProps {
  bookInfo: BookType;
}

export const Book = (props: BookProps) => {
  const {bookInfo} = props;
  const {image, name, description, author, rubrics, rate} = bookInfo;

  const colors = useColors();

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
            isTopPagination
            data={bookCarouselData}
            Component={({bookImage}: {bookImage: string}) => {
              return <BookPreview image={bookImage} />;
            }}
          />
        </View>
        <View style={styles.bookInfo}>
          <AppText
            style={{color: colors.primaryTextColor}}
            weight={'600'}
            size={TextSize.LEVEL_7}
            text={name}
          />
          <AppText
            style={[styles.author, {color: colors.primaryTextColor}]}
            weight={'500'}
            size={TextSize.LEVEL_4}
            text={author}
          />
          <View style={styles.rateWrapper}>
            <StarRatings size={5} count={rate} />
          </View>
          <View style={styles.categories}>
            {rubrics.map(category => {
              return (
                <View style={styles.category} key={category}>
                  <RubricFilterItem
                    rubric={category}
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
    marginTop: 10,
  },
  bookInfo: {
    width: '50%',
    marginTop: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  author: {
    marginTop: 5,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -4,
  },
  category: {
    padding: 4,
  },
  rateWrapper: {
    marginTop: 15,
    marginBottom: 25,
    marginLeft: -4,
  },
});
