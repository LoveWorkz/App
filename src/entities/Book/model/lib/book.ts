import {BookType} from '@src/entities/Book';

export const booksFilterItems = [
  {
    name: 'Fun',
    active: false,
  },
  {
    name: 'Intimacy',
    active: false,
  },
  {
    name: 'Respect',
    active: false,
  },
  {
    name: 'Conflict',
    active: false,
  },
];

export const bookExample: BookType = {
  id: 'book_1',
  author: 'Gary Chapman',
  image: {
    back: 'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/books%2FRectangle%20432-2.png?alt=media&token=06c8734e-cb7c-49c3-94cf-80fa1979676d&_gl=1*2jzx2z*_ga*Nzc1Nzk2MjMxLjE2Nzg0MjgxNjE.*_ga_CW55HF8NVT*MTY4NTUyODEzMi4zNy4xLjE2ODU1MzA0NTkuMC4wLjA.',
    front:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/books%2FRectangle%20432-2.png?alt=media&token=06c8734e-cb7c-49c3-94cf-80fa1979676d&_gl=1*2jzx2z*_ga*Nzc1Nzk2MjMxLjE2Nzg0MjgxNjE.*_ga_CW55HF8NVT*MTY4NTUyODEzMi4zNy4xLjE2ODU1MzA0NTkuMC4wLjA.',
  },
  description: {
    en: 'hello Lorem ipsum dolor sit amet, consectetur adipiscing Show more Lorem ipsum dolor sit amet, consectetur adipiscing',
    pt: 'pt Lorem ipsum dolor sit amet, consectetur adipiscing Show more Lorem ipsum dolor sit amet, consectetur adipiscing',
    de: 'de Lorem ipsum dolor sit amet, consectetur adipiscing Show more Lorem ipsum dolor sit amet, consectetur adipiscing',
  },
  displayName: {
    en: 'All about love',
    pt: 'pt All about love',
    de: 'de All about love',
  },
  quotes: [
    {
      en: 'Lorem ipsum dolor sit amet, consectetur adipiscing Show more Lorem ipsum dolor sit amet, consectetur adipiscing',
      pt: 'pt Lorem ipsum dolor sit amet, consectetur adipiscing Show more Lorem ipsum dolor sit amet, consectetur adipiscing',
      de: 'de Lorem ipsum dolor sit amet, consectetur adipiscing Show more Lorem ipsum dolor sit amet, consectetur adipiscing',
    },
  ],
  rate: 3.5,
  rubrics: {en: ['Fun'], de: ['Fun'], pt: ['Fun']},
  link: {
    en: 'https://www.google.com/?client=safari',
    pt: 'https://www.youtube.com',
    de: 'https://www.google.com/?client=safari',
  },
  storage: {
    back_file_name: 'book_1_back.jpg',
    front_file_name: 'book_1_front.jpg',
  },
};
