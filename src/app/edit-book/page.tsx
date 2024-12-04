"use client";

// NextJS Imports
import Link from "next/link";

// React imports
import { ChangeEvent, useState } from "react";

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
import { ask } from "@tauri-apps/api/dialog";

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

      await invoke("update_book_in_db", { book: newBook });

      setUserInfo({ ...userInfo, userBooks: newUserBooks });
    }
  }

  return (
    <div className={styles.container}>
      <h1>Edit {clickedBook !== undefined ? clickedBook.title : "Book"}</h1>
      <form className={styles.formContainer}>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="title">
            Title:
          </label>
          <input
            type="text"
            className={styles.textInput}
            value={newBook.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewBook({ ...newBook, title: e.target.value });
            }}
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
            value={newBook.author}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewBook({ ...newBook, author: e.target.value });
            }}
            name="author"
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="totPages">
            Total Pages:
          </label>
          <input
            type="number"
            value={newBook.total_pages}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewBook({ ...newBook, total_pages: Number(e.target.value) });
            }}
            name="totPages"
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="pagRead">
            Pages Read:
          </label>
          <input
            type="number"
            value={newBook.pages_read}
            name="pagRead"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewBook({ ...newBook, pages_read: Number(e.target.value) });
            }}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="covImg">
            Cover Image:
          </label>
          <input
            type="url"
            className={styles.textInput}
            value={newBook.image}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewBook({ ...newBook, image: e.target.value });
            }}
            name="covImg"
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="list">
            List:
          </label>
          <Dropdown
            value={newBook.list}
            onChange={(e) => setNewBook({ ...newBook, list: e.value })}
            options={lists.lists}
            optionLabel="List"
            placeholder="Select a list"
            name="name"
          />
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            style={{ backgroundColor: "#913521" }}
            onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();

              const yes = await ask(
                `Are you sure you want to delete ${newBook.title} by ${newBook.author} from your library? If you want to add it back later you won't be able to recover this information.`,
                { title: "Delete this book?", type: "warning" },
              );

              if (yes && clickedBook) {
                await invoke("delete_from_db", { book: clickedBook });
              }
            }}
          >
            Delete
          </button>
          <Link href="/library">
            <button type="button">Cancel</button>
          </Link>
          <Link href="/library">
            <button
              type="button"
              onClick={async (_: any) => {
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
