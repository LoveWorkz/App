import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';

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
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {BookType, BookImage} from '../model/types';
import BookPreviewModal from './BookPreviewModal/BookPreviewModal';
import Description from './Description/Description';
import firebaseStorage from '@react-native-firebase/storage';

const bookPreviewheight = 210;
const bookPreviewWidth = horizontalScale(150);

const borderRadius = moderateScale(5);

interface BookPreview {
  image: string;
  fullImage: BookImage;
}

const BookPreview = memo((props: BookPreview) => {
  const {image, fullImage} = props;
  const {theme} = useTheme();
  const colors = useColors();

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
          ...getShadowOpacity(theme, colors.bgColor).shadowOpacity_level_2,
        },
      ]}>
      <FastImage style={styles.image} resizeMode={'stretch'} source={uri} />
      <BookPreviewModal
        image={image}
        fullImage={fullImage}
        visible={isBookModalVisible}
        onClose={onModalCloseHandler}
      />
    </Pressable>
  );
});

interface BookProps {
  bookInfo: BookType;
  isLoading: boolean;
}

export const Book = (props: BookProps) => {
  const {bookInfo, isLoading} = props;
  // console.log('Book -> bookInfo', bookInfo);
  const {
    image,
    displayName,
    description,
    author,
    rubrics,
    rate,
    link,
    storage,
  } = bookInfo;

  const {i18n} = useTranslation();
  const colors = useColors();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const language = i18n.language as LanguageValueType;
  const title = displayName[language];
  const translatedDescription = description[language];
  const translatedlinks = link[language];

  useEffect(() => {
    const urlFront = firebaseStorage()
      .ref(`books/${storage.front_file_name}`)
      .getDownloadURL();
    const urlBack = firebaseStorage()
      .ref(`books/${storage.back_file_name}`)
      .getDownloadURL();

    Promise.all([urlFront, urlBack]).then(urls => {
      setImageUrls(urls);
    });
    return () => {
      setImageUrls([]);
    };
  }, [storage.front_file_name, storage.back_file_name]);

  const bookCarouselData = [
    {
      bookImage: imageUrls[0],
    },
    {
      bookImage: imageUrls[1],
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.Book}>
        <View style={styles.paginSkeleton}>
          <Skeleton height={10} width={50} />
        </View>
        <View style={styles.topBlock}>
          <Skeleton
            height={bookPreviewheight}
            width={bookPreviewWidth}
            borderRadius={borderRadius}
          />
          <View style={styles.bookInfo}>
            <Skeleton height={22} width={160} />
            <View style={styles.authorSkeleton}>
              <Skeleton height={15} width={120} />
            </View>
            <View style={styles.rateWrapper}>
              <Skeleton height={15} width={90} />
            </View>
            <View style={styles.rubrics}>
              <View style={styles.category}>
                <Skeleton
                  height={30}
                  width={70}
                  borderRadius={moderateScale(10)}
                />
              </View>
              <View style={styles.category}>
                <Skeleton
                  height={30}
                  width={70}
                  borderRadius={moderateScale(10)}
                />
              </View>
            </View>
          </View>
        </View>
        <Description
          isLoading={isLoading}
          bookLink={translatedlinks}
          description={translatedDescription}
        />
      </View>
    );
  }

  return (
    <View style={styles.Book}>
      <View style={styles.topBlock}>
        <View style={[{width: windowWidthMinusPaddings * 0.5}]}>
          <Carousel
            itemWidth={windowWidthMinusPaddings * 0.5}
            isTopPagination
            data={bookCarouselData}
            // eslint-disable-next-line react/no-unstable-nested-components
            Component={({bookImage}: {bookImage: string}) => {
              return <BookPreview image={bookImage} fullImage={image} />;
            }}
          />
        </View>
        <View style={styles.bookInfo}>
          <AppText
            style={{color: colors.primaryTextColor}}
            weight={'600'}
            size={TextSize.LEVEL_7}
            text={title}
          />
          <AppText
            style={[styles.author, {color: colors.primaryTextColor}]}
            weight={'500'}
            size={TextSize.LEVEL_4}
            text={author}
          />
          <View style={styles.rateWrapper}>
            <StarRatings count={rate} isCentred={false} readOnly />
          </View>
          <View style={styles.rubrics}>
            {rubrics[language].map(rubric => {
              return (
                <View style={styles.category} key={rubric}>
                  <RubricFilterItem
                    rubric={rubric}
                    size={BookCategorySize.SMALL}
                    displayName={rubric}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <Description
        isLoading={isLoading}
        bookLink={translatedlinks}
        description={translatedDescription}
      />
    </View>
  );
};

export default memo(Book);

const styles = StyleSheet.create({
  Book: {
    flex: 1,
  },
  topBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    height: bookPreviewheight,
    width: bookPreviewWidth,
    borderRadius: borderRadius,
    marginTop: verticalScale(10),
  },
  bookInfo: {
    width: '50%',
    marginTop: 15,
    paddingLeft: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius,
  },
  author: {
    marginTop: 5,
  },
  rubrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -4,
  },
  category: {
    padding: 4,
  },
  rateWrapper: {
    marginTop: verticalScale(15),
    marginBottom: verticalScale(20),
  },

  paginSkeleton: {
    marginBottom: verticalScale(10),
  },
  authorSkeleton: {
    marginTop: verticalScale(20),
  },
});
