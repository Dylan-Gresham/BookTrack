"use client";

import Header from "../components/header";

import styles from "@/app/styles/library.module.css";

export default function Library() {
  return (
    <>
      <Header />
      <main className={styles.libraryMain}></main>
    </>
  );
}
