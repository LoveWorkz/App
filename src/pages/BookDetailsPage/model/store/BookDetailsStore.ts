import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {BookType} from '@src/entities/Book';
import {booksStore} from '@src/pages/BooksPage';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

class BookDetailsStore {
  currentBook: BookType | null = null;
  isBookDetailsPageLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }
  getCurrentBook = (id: string) => {
    try {
      crashlytics().log('Fetching books details page.');

      runInAction(() => {
        this.isBookDetailsPageLoading = true;
      });

      const currentBook =
        booksStore.booksList.find(book => {
          return book.id === id;
        }) || null;
      this.currentBook = currentBook;
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isBookDetailsPageLoading = false;
      });
    }
  };
}

export default new BookDetailsStore();
