"use client";

// NextJS Imports
import Link from "next/link";

// React imports
import { useState } from "react";

// Tauri imports
import { invoke } from "@tauri-apps/api";

// Jotai imports
import {
  clickedBookAtom,
  registeredBookListsAtom,
  userInfoAtom,
} from "@/app/lib/atoms";
import { useAtom, useAtomValue } from "jotai";

// Library imports
import { BookType, DEFAULT_BOOK } from "../lib/booklist";

// Third party imporst
import { Dropdown } from "primereact/dropdown";

// Style imports
import styles from "@/app/styles/editBook.module.css";

export default function Page() {
  const clickedBook = useAtomValue(clickedBookAtom);
  const lists = useAtomValue(registeredBookListsAtom);
  const [newBook, setNewBook] = useState<BookType>(
    clickedBook !== undefined ? clickedBook : DEFAULT_BOOK,
  );
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);

  async function updateBook(newBook: BookType) {
    if (userInfo && clickedBook) {
      let newUserBooks = userInfo.userBooks;
      newUserBooks[newUserBooks.indexOf(clickedBook)] = newBook;

      await invoke("update_db", { book: newBook });

      setUserInfo({ ...userInfo, userBooks: newUserBooks });
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.formContainer}>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="title">
            Title:
          </label>
          <input
            type="text"
            className={styles.textInput}
            value={clickedBook?.title}
            name="title"
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="author">
            Author:
          </label>
          <input
            type="text"
            className={styles.textInput}
            value={clickedBook?.author}
            name="author"
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="totPages">
            Total Pages:
          </label>
          <input
            type="number"
            value={clickedBook?.total_pages}
            name="totPages"
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="pagRead">
            Pages Read:
          </label>
          <input type="number" value={clickedBook?.pages_read} name="pagRead" />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="covImg">
            Cover Image:
          </label>
          <input
            type="url"
            className={styles.textInput}
            value={clickedBook?.image}
            name="covImg"
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="list">
            List:
          </label>
          <Dropdown
            value={clickedBook?.list}
            onChange={(e) => setNewBook({ ...newBook, list: e.value })}
            options={lists}
            optionLabel="List"
            placeholder="Select a list"
            name="name"
          />
        </div>
        <div className={styles.buttonContainer}>
          <Link href="/library">
            <button
              type="button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Cancel
            </button>
          </Link>
          <Link href="/library">
            <button
              type="button"
              onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();

                await updateBook(newBook);
              }}
            >
              Save Changes
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
