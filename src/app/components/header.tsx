// NextJS imports
import Link from "next/link";

// Jotai imports
import { userInfoAtom } from "../lib/atoms";
import { useAtomValue } from "jotai";

// CSS imports
import styles from "../styles/header.module.css";

export default function Header() {
  const userInfo = useAtomValue(userInfoAtom);

  if (userInfo !== null) {
    return (
      <header className={styles.headerContainer}>
        <h2>BookTrack</h2>
        <div className={styles.headerButtonsContainer}>
          <p>{userInfo.userConfig.username}</p>
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
