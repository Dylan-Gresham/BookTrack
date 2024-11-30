"use client";

// Jotai imports
import { useAtomValue } from "jotai";

// Component imports
import Header from "../components/header";
import Book from "../components/book";

// Library imports
import {
  registeredBookListsAtom,
  userInfoAtom,
  librarySortAtom,
} from "../lib/atoms";
import { BookType } from "../lib/booklist";

// CSS import
import styles from "@/app/styles/library.module.css";
import Link from "next/link";

export default function Library() {
  const userInfo = useAtomValue(userInfoAtom);
  const registeredLists = useAtomValue(registeredBookListsAtom);
  const librarySort = useAtomValue(librarySortAtom);

  let userBooks: Array<BookType> = userInfo ? userInfo.userBooks : [];

  if (librarySort.sortBy !== "default") {
    userBooks = userBooks.toSorted((a, b): number => {
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
          registeredLists.map((list: string) => {
            return (
              <div className={styles.rowContainer} style={{ gridRow: row++ }}>
                <h3 className={styles.listTitle}>
                  {list
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </h3>
                <ul key={i++} className={styles.noBullets}>
                  {userBooks &&
                    userBooks
                      .filter((book) => book.list === list)
                      .map((book: BookType) => {
                        return (
                          <li key={book.id}>
                            <Book book={book}></Book>
                          </li>
                        );
                      })}
                </ul>
              </div>
            );
          })}
        {userBooks.length === 0 && (
          <Link href="/library/add-book">
            <button type="button" className={styles.libraryControlButton}>
              New Book
            </button>
          </Link>
        )}
      </main>
    </>
  );
}
