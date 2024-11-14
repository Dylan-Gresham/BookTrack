import Image from "next/image";

import { BookType } from "../lib/booklist";

import styles from "../styles/book.module.css";
import Link from "next/link";

import ProgressBar from "@ramonak/react-progress-bar";

export default function Book({ book }: { book: BookType }) {
  let showPBar =
    book.list === "Completed" || book.list === "Planned" ? false : true;
  let barColor = undefined;
  switch (book.list) {
    case "In Progress":
      barColor = "#36c22f";
      break;
    case "Aside":
      barColor = "#d4691e";
      break;
    case "Dropped":
      barColor = "#ba2a25";
      break;
    default:
      barColor = "#6a1b9a";
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
            completed={Number(
              ((book.pages_read / book.total_pages) * 100.0).toFixed(2),
            )}
            maxCompleted={100.0}
            labelAlignment="left"
            labelColor="#000000"
            bgColor={barColor}
          />
        )}
        {!showPBar && book.list === "Completed" && (
          <p style={{ color: "green" }}> ✔ </p>
        )}
      </div>
    </Link>
  );
}
