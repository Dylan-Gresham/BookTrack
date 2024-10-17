import Image from "next/image";

import { BookType } from "../lib/booklist";

import styles from "../styles/book.module.css";
import Link from "next/link";

export default function Book({ book }: { book: BookType }) {
  return (
    <Link href="/edit-book" className={styles.bookCardLink}>
      <div className={styles.bookCard}>
        <Image
          src={book.image}
          width={100}
          height={150}
          alt={`Cover image for ${book.title}`}
          className={styles.bookImg}
          unoptimized
        />
        <h5 className={styles.bookTitle}>{book.title}</h5>
        <h6 className={styles.bookAuthor}>{book.author}</h6>
      </div>
    </Link>
  );
}
