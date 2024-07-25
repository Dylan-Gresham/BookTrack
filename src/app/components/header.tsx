import { User } from 'firebase/auth';
import styles from '../styles/header.module.css';

function createAccount() {
}

export default function Header(
    {currentUser,}:
    {
        currentUser: User | null,
    }
) {
    if(currentUser !== null) {
        return (
            <header className={styles.headerContainer}>
                <h2>BookTrack</h2>
                <div className={styles.headerButtonsContainer}>
                    <p>FILL USERNAME HERE</p>
                </div>
            </header>
        );
    } else {
        return (
            <header className={styles.headerContainer}>
                <h2>BookTrack</h2>
                <div className={styles.headerButtonsContainer}>
                    <button type='button' onClick={ (event: React.MouseEvent<HTMLElement>) => {
                        event.preventDefault();
                        event.stopPropagation();

                        // Logic for controlling all the screen changes for account creation.
                        // Another modal then update config file?
                        console.log("Create Account TODO!");
                    }}>Create Account</button>
                </div>
            </header>
        );
    }
}
