// Defining the Book interface
export interface BookType {
  id: number;
  title: string;
  author: string;
  image: string;
  totalPages: number;
  pagesRead: number;
  list: string;
}

// Defining the BookList type
export type BookList = BookType[];

/**
 * Checks if the object is an instance of the Book interface
 */
export function instanceOfBook(object: any): object is BookType {
  if (
    object.id !== undefined &&
    object.title !== undefined &&
    object.author !== undefined &&
    object.image !== undefined &&
    object.totalPages !== undefined &&
    object.pagesRead !== undefined &&
    object.list !== undefined
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Checks if the object is an instance of the BookList type
 */
export function instanceOfBookList(object: any): object is BookList {
  if (!Array.isArray(object)) {
    return false;
  } else {
    return object.every((item: any) => instanceOfBook(item));
  }
}
