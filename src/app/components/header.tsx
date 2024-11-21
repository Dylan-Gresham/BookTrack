// NextJS imports
import Link from "next/link";

// Jotai imports
import { userInfoAtom, librarySortAtom } from "../lib/atoms";
import { useAtom, useAtomValue } from "jotai";

// CSS imports
import styles from "../styles/header.module.css";

export default function Header({ inLibrary = false }: { inLibrary: boolean }) {
  const userInfo = useAtomValue(userInfoAtom);
  let [librarySortValue, setLibrarySort] = useAtom(librarySortAtom);

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

            <select name="library-sort-by" id="library-sort-by" value={librarySortValue.sortBy} onChange={(e) => {
              const newSortKey = e.target.value as "default" | "title" | "author" | "pageCount";

              if (newSortKey !== librarySortValue.sortBy) {
                librarySortValue.sortBy = newSortKey;
                librarySortValue.order = "descending";
              }

              setLibrarySort({sortBy: librarySortValue.sortBy, order: librarySortValue.order});
            }}>
              <option value="default">No Sort</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="pageCount">Page Count</option>
            </select>

            <button
              type="button"
              className={styles.libraryControlButton}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();

                if (librarySortValue.order === "descending") {
                  librarySortValue.order = "ascending";
                } else {
                  librarySortValue.order = "descending";
                }

                setLibrarySort({...librarySortValue, order: librarySortValue.order});
              }}
            >
              {librarySortValue.order === "descending" ? "↓" : "↑"}
            </button>

            <button
              type="button"
              className={styles.libraryControlButton}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();

                console.log("New Book button TODO!");
              }}
            >
              New Book
            </button>
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
