// NextJS imports
import Link from "next/link";

// Jotai imports
import { userInfoAtom } from "../lib/atoms";
import { useAtomValue } from "jotai";

// CSS imports
import styles from "../styles/header.module.css";

export default function Header() {
  const userInfo = useAtomValue(userInfoAtom);

  if (userInfo !== null && userInfo.userConfig.username !== "") {
    return (
      <header className={styles.headerContainer}>
        <Link href="/" className={styles.link}>
          <h2>BookTrack</h2>
        </Link>
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
        <h2>BookTrack</h2>
        <div className={styles.headerButtonsContainer}>
          <Link href="/create-account" className={styles.link}>
            Create Account
          </Link>
        </div>
      </header>
    );
  }
}
