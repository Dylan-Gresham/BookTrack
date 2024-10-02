import { BookType } from "../lib/booklist";

export default function Book({ book }: { book: BookType }) {
  return (
    <>
      <h6>{book.title}</h6>
    </>
  );
}
