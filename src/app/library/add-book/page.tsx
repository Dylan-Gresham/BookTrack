"use client";

// React imports
import { useState } from "react";

// Next.js imports
import Link from "next/link";

// Third-party imports
import { Dropdown } from "primereact/dropdown";

// Jotai & atom imports
import {
  registeredBookListsAtom,
  UserInfo,
  userInfoAtom,
} from "@/app/lib/atoms";
import { useAtom, useAtomValue } from "jotai";

// Library imports
import { BookList, BookType, GbApiResult } from "@/app/lib/booklist";
import { invoke } from "@tauri-apps/api";
import { Config, defaultConfig } from "@/app/lib/config";

export default function Page() {
  const [userInfo, setUserInfo] = useAtom<UserInfo | null>(userInfoAtom);
  let numBooks = userInfo !== null ? userInfo.userBooks.length : 0;
  const [book, setBook] = useState<BookType>({
    id: numBooks,
    title: "",
    author: "",
    image: "",
    synopsis: "",
    total_pages: 0,
    pages_read: 0,
    list: "Planned",
  });
  const lists = useAtomValue<Array<string>>(registeredBookListsAtom);

  async function insertNewBook() {
    let gb_api_res: GbApiResult = await invoke("make_gb_api_req", {
      title: book.title,
      author: book.author,
    });

    let imageLink = gb_api_res.volumes[0].image;
    let synopsis = gb_api_res.volumes[0].synopsis;

    let newBook: BookType = { ...book, image: imageLink, synopsis: synopsis };
    let newUserBooks: BookList = userInfo !== null ? userInfo.userBooks : [];
    newUserBooks.push(newBook);

    await invoke("update_db", { book: newBook });

    setUserInfo({
      userBooks: newUserBooks,
      userConfig: userInfo !== null ? userInfo.userConfig : defaultConfig,
    });
  }

  return (
    <div>
      <h1>Add a Book</h1>
      <form>
        <div>
          <label>Title</label>
          <input
            type="text"
            placeholder="The Way of Kings"
            value={book.title}
            onChange={(e) => setBook({ ...book, title: e.target.value })}
          />
        </div>
        <div>
          <label>Author</label>
          <input
            type="text"
            placeholder="Brandon Sanderson"
            value={book.author}
            onChange={(e) => setBook({ ...book, author: e.target.value })}
          />
        </div>
        <div>
          <label>Total Number of Pages</label>
          <input
            type="number"
            value={book.total_pages}
            onChange={(e) =>
              setBook({ ...book, total_pages: e.target.valueAsNumber })
            }
          />
        </div>
        {book.list === "In Progress" && (
          <div>
            <label>Pages Read so Far</label>
            <input
              type="number"
              value={book.pages_read}
              onChange={(e) =>
                setBook({ ...book, pages_read: e.target.valueAsNumber })
              }
            />
          </div>
        )}
        <div>
          <label>List</label>
          <Dropdown
            value={book.list}
            onChange={(e) => setBook({ ...book, list: e.value })}
            options={lists}
            optionLabel="List"
            placeholder="Select a list"
          />
        </div>
        <div>
          <Link href="/library">
            <button type="button">Cancel</button>
          </Link>
          <Link href="/library">
            <button
              type="button"
              onClick={async (_: React.MouseEvent<HTMLButtonElement>) => {
                await insertNewBook();
              }}
            >
              Submit
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
