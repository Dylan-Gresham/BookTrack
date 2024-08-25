// NextJS imports
import Link from "next/link";

// Jotai
import { useAtomValue } from "jotai";

// CSS import
import styles from "../styles/header.module.css";
import { userAtom } from "../lib/atoms";

export default function Header() {
  const user = useAtomValue(userAtom);

  if (user !== null) {
    return (
      <header className={styles.headerContainer}>
        <h2>BookTrack</h2>
        <div className={styles.headerButtonsContainer}>
          <p>{user}</p>
        </div>
      </header>
    );
  } else {
    return (
      <header className={styles.headerContainer}>
        <h2>BookTrack</h2>
        <div className={styles.headerButtonsContainer}>
          <Link href="/create-account">Create Account</Link>
        </div>
      </header>
    );
  }
}
