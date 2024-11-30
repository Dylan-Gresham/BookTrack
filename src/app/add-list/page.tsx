"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAtom } from "jotai";
import { registeredBookListsAtom } from "../lib/atoms";

import styles from "@/app/styles/newlist.module.css";
import { invoke } from "@tauri-apps/api";

export default function Page() {
  const router = useRouter();
  const [newList, setNewList] = useState<string>("");
  const [registeredListsObj, setRegisteredListsObj] = useAtom(
    registeredBookListsAtom,
  );
  const inputElement = document.getElementById("listInput");

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    // Check if invalid input
    if (inputElement?.classList.contains(styles.invalid)) {
      return;
    }

    // Update list
    let newLists = registeredListsObj.lists;
    newLists.push(newList);

    // Update state and change route
    setRegisteredListsObj({ lists: newLists, open: false });

    invoke("update_lists", { newList: newList })
      .then((_: any) => router.push("/library"))
      .catch((msg: string) => {
        console.error(msg);
        router.push("/library");
      });
  }

  return (
    <form>
      <div className={styles.inputContainer}>
        <label htmlFor="newList">New List:</label>
        <input
          type="text"
          name="newList"
          className={styles.listInput}
          id="listInput"
          placeholder="Priority"
          value={newList}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            e.stopPropagation();
            let newVal = e.target.value;
            if (
              newVal === "" ||
              registeredListsObj.lists.indexOf(newVal) !== -1
            ) {
              inputElement?.classList.add(styles.invalid);
            } else if (inputElement?.classList.contains(styles.invalid)) {
              inputElement?.classList.remove(styles.invalid);
            }

            setNewList(newVal);
          }}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button
          type="button"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();

            router.push("/library");
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e)}
        >
          Add List
        </button>
      </div>
    </form>
  );
}
