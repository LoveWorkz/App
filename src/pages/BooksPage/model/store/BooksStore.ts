import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import i18n from '@src/shared/config/i18next/i18next';

import {Collections} from '@src/shared/types/firebase';
import {BookType} from '@src/entities/Book';
import {rubricFilterItemStore} from '@src/entities/RubricFilterItem';
import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';

class BooksStore {
  booksList: BookType[] = [];
  booksFilteredList: BookType[] = [];
  recommendedBooksList: BookType[] = [];
  booksSize: number = 0;
  searchBooksText: string = '';
  isBooksPageLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setSearchBooksText = (searchBooksText: string) => {
    this.searchBooksText = searchBooksText;
  };

  clearBooksInfo = () => {
    rubricFilterItemStore.clearFilteredInfo();
    this.booksFilteredList = this.booksList;
    this.setSearchBooksText('');
  };

  init = async () => {
    try {
      crashlytics().log('Fetching books page.');

      runInAction(() => {
        this.isBooksPageLoading = true;
      });
      await this.setBooks();
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isBooksPageLoading = false;
      });
    }
  };

  fetchBooks = async () => {
    const source = await userStore.checkIsUserOfflineAndReturnSource();

    const data = await firestore().collection(Collections.BOOKS).get({source});
    const booksList = data.docs.map(book => book.data());

    return booksList as BookType[];
  };

  setBooks = async () => {
    try {
      const booksList = await this.fetchBooks();
      if (!booksList) {
        return;
      }

      runInAction(() => {
        this.booksSize = booksList.length;
        this.booksList = booksList as BookType[];
        this.booksFilteredList = booksList as BookType[];
        this.recommendedBooksList = booksList as BookType[];
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  filterBooks = (name: string, lang: string) => {
    try {
      crashlytics().log('User tried to filter books by rubrics.');

      //@ts-ignore
      this.booksFilteredList = rubricFilterItemStore.startFilterLogic({
        //@ts-ignore
        list: this.booksList,
        key: name,
        lang,
      });

      // after filtering books by rubric name filter by search name if the search bar is active
      if (this.searchBooksText) {
        this.searchBooks({
          isSearchBarFilterActive: false,
          list: this.booksFilteredList,
          searchBooksText: this.searchBooksText,
          lang,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  searchBooks = ({
    searchBooksText,
    list = this.booksList,
    isSearchBarFilterActive = true,
    lang,
  }: {
    searchBooksText: string;
    list?: BookType[];
    isSearchBarFilterActive?: boolean;
    lang?: string;
  }) => {
    try {
      crashlytics().log('User tried to filter books by text.');

      const language = i18n.language;

      this.booksFilteredList = list.filter(book => {
        const displayName = book.displayName[language as LanguageValueType];
        const description = book.description[language as LanguageValueType];

        const lowercaseBookInfo = searchBooksText.toLocaleLowerCase();
        const bookName = displayName.toLocaleLowerCase();
        const bookAuthor = book.author.toLocaleLowerCase();
        const bookDescription = description.toLocaleLowerCase();

        return (
          bookName.includes(lowercaseBookInfo) ||
          bookAuthor.includes(lowercaseBookInfo) ||
          bookDescription.includes(lowercaseBookInfo)
        );
      });

      const selectedRubricKey = rubricFilterItemStore.selectedRubricKey;
      // after searching filter books by rubric name, if the rubrics are active
      if (isSearchBarFilterActive && selectedRubricKey) {
        this.booksFilteredList = rubricFilterItemStore.filterByKey({
          key: selectedRubricKey,
          list: this.booksFilteredList,
          lang: lang as string,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new BooksStore();
