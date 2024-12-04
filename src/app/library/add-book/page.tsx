"use client";

// NextJS Imports
import Link from "next/link";

// React imports
import { ChangeEvent, useState } from "react";

// Tauri imports
import { invoke } from "@tauri-apps/api";
import { message } from "@tauri-apps/api/dialog";

// Jotai imports
import { registeredBookListsAtom, userInfoAtom } from "@/app/lib/atoms";
import { useAtom, useAtomValue } from "jotai";

// Library imports
import { BookType, DEFAULT_BOOK } from "../../lib/booklist";

// Third party imporst
import { Dropdown } from "primereact/dropdown";

// Style imports
import styles from "@/app/styles/editBook.module.css";

export default function Page() {
  const lists = useAtomValue(registeredBookListsAtom);
  const [newBook, setNewBook] = useState<BookType>(DEFAULT_BOOK);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);

  function validateInputs(): boolean {
    let flag = true;
    if (
      newBook.title === "" ||
      newBook.author !== "" ||
      newBook.list !== "" ||
      newBook.total_pages !== 0 ||
      newBook.image === ""
    ) {
      flag = false;
    }

    return flag;
  }

  async function addBook(newBook: BookType) {
    if (userInfo) {
      let newUserBooks: Array<BookType> = userInfo.userBooks;

      newUserBooks.push({
        ...newBook,
        id: Math.max(...userInfo.userBooks.map((book) => book.id)) + 1,
      });

      await invoke("update_db", { book: newBook });

      setUserInfo({ ...userInfo, userBooks: newUserBooks });
    }
  }

  return (
    <div className={styles.container}>
      <h1>Add a New Book</h1>
      <form className={styles.formContainer}>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="title">
            Title:
          </label>
          <input
            type="text"
            className={styles.textInput}
            value={newBook.title}
            placeholder="The Way of Kings"
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
            placeholder="Brandon Sanderson"
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
            name="totPages"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewBook({ ...newBook, total_pages: Number(e.target.value) });
            }}
            placeholder="1008"
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
            placeholder="0"
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
            placeholder="https://m.media-amazon.com/images/I/81pJXhRLdoL.jpg"
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
          <Link href="/library">
            <button type="button">Cancel</button>
          </Link>
          <Link href="/library">
            <button
              type="button"
              onClick={async (_) => {
                await addBook(newBook);
              }}
            >
              Add Book
            </button>
          </Link>
          <button
            type="button"
            onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              e.preventDefault();

              let prediction: number = await invoke("comp_then_predict", {
                book: newBook,
              });

              await message(
                `Brak thinks there's a ${prediction.toFixed(2)}%% chance that you enjoy ${newBook.title} by ${newBook.author}.`,
                { title: "Brak Recommender", type: "info" },
              );
            }}
          >
            Evaluate
          </button>
        </div>
      </form>
    </div>
  );
}
