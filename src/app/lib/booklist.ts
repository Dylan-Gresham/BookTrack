// Defining the Book interface
export interface BookType {
  id: number;
  title: string;
  author: string;
  image: string;
  total_pages: number;
  pages_read: number;
  list: string;
  synopsis: string;
}

export interface GbApiResult {
  volumes: BookType[];
}

export const DEFAULT_BOOK: BookType = {
  id: 0,
  title: "",
  author: "",
  image: "",
  total_pages: 0,
  pages_read: 0,
  list: "",
  synopsis: "",
};

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
    object.synopsis !== undefined &&
    object.totalPages !== undefined &&
    object.pagesRead !== undefined &&
    object.list !== undefined &&
    object.synopsis !== undefined
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Modifies the input book's list field.
 *
 * Parameters:
 *
 * - book `BookType` The book to modify
 * - newList `string` The list to move the book to
 */
export function changeBookList(book: BookType, newList: string) {
  book.list = newList;
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
