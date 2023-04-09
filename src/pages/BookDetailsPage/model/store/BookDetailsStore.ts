import {makeAutoObservable} from 'mobx';

import {BookType} from '@src/entities/Book';
import {booksStore} from '@src/pages/BooksPage';

class BookDetailsStore {
  currentBook: BookType | null = null;

  constructor() {
    makeAutoObservable(this);
  }
  getCurrentBook = (id: string) => {
    const currentBook =
      booksStore.booksList.find(book => {
        return book.id === id;
      }) || null;
    this.currentBook = currentBook;
  };
}

export default new BookDetailsStore();
