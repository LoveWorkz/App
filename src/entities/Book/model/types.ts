export interface BookImage {
  front: string;
  back: string;
}

export interface BookType {
  author: string;
  rubrics: string[];
  description: string;
  id: string;
  image: BookImage;
  name: string;
  rate: number;
}
