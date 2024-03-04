import styles from './styles/header.module.css';

export default function Header() {
    return (
        <header className={styles.headerContainer}>
            <h2>BookTrack</h2>
            <div className={styles.headerButtonsContainer}>
                <button type="button" className={styles.headerButton}>Login</button>
                <button type="button" className={styles.headerButton}>Register</button>
            </div>
        </header>
    );
}
