import Image from "next/image";

import { BookType } from "../lib/booklist";

import styles from "../styles/book.module.css";
import Link from "next/link";

import ProgressBar from "@ramonak/react-progress-bar";

export default function Book({ book }: { book: BookType }) {
  let showPBar =
    book.list === "Completed" || book.list === "Planned" ? false : true;
  let completedClassName = undefined;
  switch (book.list) {
    case "In Progress":
      completedClassName = styles.inProgressBar;
      break;
    case "Aside":
      completedClassName = styles.asideBar;
      break;
    case "Dropped":
      completedClassName = styles.droppedBar;
      break;
    default:
      completedClassName = styles.defaultBar;
      break;
  }

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
        {showPBar && (
          <ProgressBar
            completed={(book.pages_read / book.total_pages) * 100.0}
            maxCompleted={100}
            completedClassName={completedClassName}
            barContainerClassName={styles.progressBar}
          />
        )}
        {!showPBar && book.list === "Completed" && (
          <p style={{ color: "green" }}> ✔ </p>
        )}
      </div>
    </Link>
  );
}
