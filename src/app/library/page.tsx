"use client";

// Jotai imports
import { useAtomValue } from "jotai";
import Header from "../components/header";

import styles from "@/app/styles/library.module.css";
import { userInfoAtom } from "../lib/atoms";

export default function Library() {
  const bookList = useAtomValue(userInfoAtom);

  return (
    <>
      <Header />
      <main className={styles.libraryMain}>
        <ul></ul>
      </main>
    </>
  );
}
