export interface BookImage {
  front: string;
  back: string;
}

export interface BookType {
  author: string;
  Categories: string[];
  description: string;
  id: string;
  image: BookImage;
  name: string;
  rate: number;
}
