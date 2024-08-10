import Link from 'next/link';
import styles from '../styles/header.module.css';

export default function Header(
    {currentUser,}:
    {
        currentUser: string | null,
    }
) {
    if(currentUser !== null) {
        return (
            <header className={styles.headerContainer}>
                <h2>BookTrack</h2>
                <div className={styles.headerButtonsContainer}>
                    <p>{currentUser}</p>
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
