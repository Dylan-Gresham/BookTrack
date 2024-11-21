"use client";

// Jotai imports
import { useAtomValue } from "jotai";

// Component imports
import Header from "../components/header";
import Book from "../components/book";

// Library imports
import { registeredBookListsAtom, userInfoAtom, librarySortAtom } from "../lib/atoms";
import { BookType } from "../lib/booklist";

// CSS import
import styles from "@/app/styles/library.module.css";

// Define constants
const CHUNK_SIZE = 5; // Library's row length

export default function Library() {
  const userInfo = useAtomValue(userInfoAtom);
  const registeredLists = useAtomValue(registeredBookListsAtom);
  const librarySort = useAtomValue(librarySortAtom);

  const userBooks: Array<BookType> = userInfo ? userInfo.userBooks : [];

  if (librarySort.sortBy !== "default") {
    userBooks.sort((a, b): number => {
      let sortValue = 0;

      switch (librarySort.sortBy) {
        case "title":
          sortValue = a.title.localeCompare(b.title);
          break;
        case "author":
          sortValue = a.author.localeCompare(b.author);
          break;
        case "pageCount":
          sortValue = b.total_pages - a.total_pages;
          break;
      }

      return librarySort.order === "descending" ? sortValue : sortValue * -1;
    });
  }

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
  let row = 1;
  return (
    <>
      <Header inLibrary={true} />
      <main className={styles.libraryMain} style={{ backgroundColor: bgColor }}>
        {userBooks.length > 0 &&
          splitUserBooks.map((slice: Array<BookType>) => {
            return (
              <ul
                key={i++}
                className={styles.noBullets}
                style={{ gridRow: row++ }}
              >
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
            className={styles.centeredButton}
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
