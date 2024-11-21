// NextJS imports
import Link from "next/link";

// Jotai imports
import { userInfoAtom } from "../lib/atoms";
import { useAtomValue } from "jotai";

// CSS imports
import styles from "../styles/header.module.css";

export default function Header({ inLibrary = false }: { inLibrary: boolean }) {
  const userInfo = useAtomValue(userInfoAtom);

  if (userInfo !== null && userInfo.userConfig.username !== "") {
    return (
      <header className={styles.headerContainer}>
        <Link href="/" className={styles.link}>
          <h2>BookTrack</h2>
        </Link>
        {inLibrary && (
          <div className={styles.libraryControls}>
            <button
              type="button"
              className={styles.libraryControlButton}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();

                console.log("New List button TODO!");
              }}
            >
              New List
            </button>
            <button
              type="button"
              className={styles.libraryControlButton}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();

                console.log("Sort button TODO!");
              }}
            >
              Sort
            </button>
            <Link href="/library/add-book">
              <button type="button" className={styles.libraryControlButton}>
                New Book
              </button>
            </Link>
          </div>
        )}
        <div className={styles.headerButtonsContainer}>
          <Link href="/library" className={styles.link}>
            My Library
          </Link>
          <p>{userInfo.userConfig.username}</p>
        </div>
      </header>
    );
  } else {
    return (
      <header className={styles.headerContainer}>
        <Link href="/" className={styles.link}>
          <h2>BookTrack</h2>
        </Link>
        {inLibrary && (
          <div className={styles.libraryControls}>
            <button type="button" className={styles.libraryControlButton}>
              New List
            </button>
            <button type="button" className={styles.libraryControlButton}>
              Sort
            </button>
            <button type="button" className={styles.libraryControlButton}>
              New Book
            </button>
          </div>
        )}
        <div className={styles.headerButtonsContainer}>
          <Link href="/create-account" className={styles.link}>
            Create Account
          </Link>
        </div>
      </header>
    );
  }
}
