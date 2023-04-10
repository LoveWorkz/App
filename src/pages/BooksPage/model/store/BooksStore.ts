import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/firebase';
import {BookType} from '@src/entities/Book';
import {booksCategories} from '../consts/consts';
import {BooksCategoriesTypes} from '../types/booksTypes';

class BooksStore {
  booksList: BookType[] = [];
  booksFilteredList: BookType[] = [];
  recommendedBooksList: BookType[] = [];
  booksSize: number = 0;
  booksCategories: BooksCategoriesTypes[] = booksCategories;
  categorieskeys: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getBooks = async () => {
    try {
      const data = await firestore().collection(Collections.BOOKS).get();
      const booksList = data.docs.map(book => book.data());
      runInAction(() => {
        this.booksSize = data.size;
        this.booksList = booksList as BookType[];
        this.booksFilteredList = booksList as BookType[];
        this.recommendedBooksList = booksList as BookType[];
      });
    } catch (e) {
      console.log(e);
    }
  };

  filterBooks = (key: string) => {
    try {
      this.toggleCategoryStatus({key});

      if (this.categorieskeys.includes(key)) {
        this.turnOffFilterByKey(key);
      } else {
        this.filterBooksByKey(key);
      }
    } catch (e) {
      console.log(e);
    }
  };

  toggleCategoryStatus = ({key, status}: {key: string; status?: boolean}) => {
    this.booksCategories = this.booksCategories.map(category => {
      if (typeof status === 'boolean') {
        return {...category, active: status};
      }

      if (category.key === key) {
        return {
          ...category,
          active: !category.active,
        };
      }
      return category;
    });
  };

  turnOffFilterByKey = (key: string) => {
    // delete category key from keys
    this.categorieskeys = this.categorieskeys.filter(item => item !== key);

    let currentBooksList = this.booksList;
    // if the keys are empty, set to 1 and make the loop run at least once to remove the first active category
    const keysLength = this.categorieskeys.length
      ? this.categorieskeys.length
      : 1;

    for (let i = 0; i < keysLength; i++) {
      currentBooksList = currentBooksList.filter(book => {
        if (this.categorieskeys[i]) {
          return book.Categories.includes(this.categorieskeys[i]);
        }
        return true;
      });
    }
    this.booksFilteredList = currentBooksList;
  };

  filterBooksByKey = (key: string) => {
    this.categorieskeys.push(key);

    this.booksFilteredList = this.booksFilteredList.filter(book => {
      return book.Categories.includes(key);
    });
  };

  clearBooksInfo = () => {
    this.categorieskeys = [];
    this.toggleCategoryStatus({key: '', status: false});
    this.booksFilteredList = this.booksList;
  };
}

export default new BooksStore();
