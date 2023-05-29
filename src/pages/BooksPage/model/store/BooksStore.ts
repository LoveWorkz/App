import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections} from '@src/shared/types/firebase';
import {BookType} from '@src/entities/Book';
import {rubricFilterItemStore} from '@src/entities/RubricFilterItem';
import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

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
    rubricFilterItemStore.clearInfo();
    this.booksFilteredList = this.booksList;
  };

  init = async () => {
    try {
      crashlytics().log('Fetching books page.');

      runInAction(() => {
        this.isBooksPageLoading = true;
      });
      await this.getBooks();
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isBooksPageLoading = false;
      });
    }
  };

  getBooks = async () => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.BOOKS)
        .get({source});
      const booksList = data.docs.map(book => book.data());
      runInAction(() => {
        this.booksSize = data.size;
        this.booksList = booksList as BookType[];
        this.booksFilteredList = booksList as BookType[];
        this.recommendedBooksList = booksList as BookType[];
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  filterBooks = (name: string) => {
    try {
      crashlytics().log('User tried to filter books by rubrics.');

      rubricFilterItemStore.toggleRubricStatus({name});
      if (rubricFilterItemStore.rubricskeys.includes(name)) {
        this.booksFilteredList = rubricFilterItemStore.turnOffFilterByKey({
          key: name,
          list: this.booksList,
        }) as BookType[];

        // after filtering books by rubric name filter by search name if the search bar is active
        if (this.searchBooksText) {
          this.searchBooks({
            isSearchBarFilterActive: false,
            list: this.booksFilteredList,
            searchBooksText: this.searchBooksText,
          });
        }
      } else {
        this.booksFilteredList = rubricFilterItemStore.filterByKey({
          key: name,
          list: this.booksFilteredList,
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
  }: {
    searchBooksText: string;
    list?: BookType[];
    isSearchBarFilterActive?: boolean;
  }) => {
    try {
      crashlytics().log('User tried to filter books by text.');

      this.booksFilteredList = list.filter(book => {
        const lowercaseBookInfo = searchBooksText.toLocaleLowerCase();
        const bookName = book.name.toLocaleLowerCase();
        const bookAuthor = book.author.toLocaleLowerCase();
        const bookDescription = book.description.toLocaleLowerCase();

        return (
          bookName.includes(lowercaseBookInfo) ||
          bookAuthor.includes(lowercaseBookInfo) ||
          bookDescription.includes(lowercaseBookInfo)
        );
      });

      // after searching filter books by rubric name, if the rubrics are active
      if (isSearchBarFilterActive && rubricFilterItemStore.rubricskeys.length) {
        rubricFilterItemStore.rubricskeys.forEach(key => {
          this.booksFilteredList = rubricFilterItemStore.filterByKey({
            key: key,
            list: this.booksFilteredList,
          });
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new BooksStore();
