export class Book {
  id!: number;
  bookName!: string;
  author: string = "";
  description: string = "";
  price!: number;
  size: string = "";
  picture: string = "";
   category!:[ {
        main: String,
        sub: String
    } ]
}
