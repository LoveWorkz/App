import {makeAutoObservable} from 'mobx';

import {BookType} from '@src/entities/Book';
import {booksStore} from '@src/pages/BooksPage';

class BookDetailsStore {
  currentBook: BookType | null = null;
  isBookDetailsPageLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }
  getCurrentBook = (id: string) => {
    try {
      this.isBookDetailsPageLoading = true;

      const currentBook =
        booksStore.booksList.find(book => {
          return book.id === id;
        }) || null;
      this.currentBook = currentBook;
    } catch (e) {
      console.log(e);
    } finally {
      this.isBookDetailsPageLoading = false;
    }
  };
}

export default new BookDetailsStore();
