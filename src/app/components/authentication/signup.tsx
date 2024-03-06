import styles from '../../styles/signup.module.css';

export default function Signup() {
    return (
        <div className={styles.signupContainer}>
            <dialog className={styles.dialog}>
                <form name="signupForm" action="dialog" className={styles.form}>
                    <div className={styles.inputRow}>
                        <label htmlFor="emailInput" className={styles.inputLabel}>
                            E-Mail:
                        </label>
                        <input type="email" name="emailInput" className={styles.emailInput}
                            placeholder="johndoe@gmail.com">
                        </input>
                    </div>
                    <div className={styles.inputRow}>
                        <label htmlFor="passwordInput" className={styles.inputLabel}>
                               Password:
                        </label>
                        <input type="password" name="passwordInput"
                               className={styles.passwordInput}
                               placeholder="Pass_word-1234">
                        </input>
                    </div>
                </form>
            </dialog>
        </div>
    );
}
