"use client";

// Jotai imports
import { useAtomValue } from "jotai";

// Component imports
import Header from "../components/header";
import Book from "../components/book";

// Library imports
import { userInfoAtom } from "../lib/atoms";
import { BookType } from "../lib/booklist";

// CSS import
import styles from "@/app/styles/library.module.css";

// Define constants
const CHUNK_SIZE = 5; // Library's row length

export default function Library() {
  const userInfo = useAtomValue(userInfoAtom);

  const userBooks: Array<BookType> = userInfo ? userInfo.userBooks : [];
  let splitUserBooks: Array<Array<BookType>> = [];

  let chunk: Array<BookType> = [];
  for (let i = 0; i < userBooks.length; i++) {
    chunk.push(userBooks[i]);

    if ((i + 1) % CHUNK_SIZE === 0) {
      splitUserBooks.push(chunk);
      chunk = [];
    }
  }

  let bgColor = "#CBC0AE";
  if (userInfo) {
    bgColor = userInfo.userConfig.theme === "dark" ? "#CBC0AE" : "#5D707F";
  }

  let i = 0;
  return (
    <>
      <Header />
      <main className={styles.libraryMain} style={{ backgroundColor: bgColor }}>
        <div className={(styles.sticky, styles.controls)}>
          <span className={styles.controlPlaceholder}></span>
          <div className={styles.controlButtonsContainer}>
            <button type="button" className={styles.controlButton}>
              New Book
            </button>
            <button type="button" className={styles.controlButton}>
              New List
            </button>
            <button type="button" className={styles.controlButton}>
              Sort
            </button>
          </div>
        </div>
        {userBooks.length > 0 &&
          splitUserBooks.map((slice: Array<BookType>) => {
            return (
              <ul key={i++}>
                {slice.map((book) => {
                  return (
                    <li key={book.id}>
                      <Book book={book}></Book>
                    </li>
                  );
                })}
              </ul>
            );
          })}
        {userBooks.length === 0 && (
          <button
            type="button"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();

              console.log("TODO!");
            }}
          >
            Add Book
          </button>
        )}
      </main>
    </>
  );
}
