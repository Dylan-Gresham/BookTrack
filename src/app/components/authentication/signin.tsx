import { Auth, User, signInWithEmailAndPassword } from 'firebase/auth';
import styles from '../../styles/signin.module.css';
import { useState } from 'react';

export default function Signup(
    { setLoginOpen, auth, setCurrentUser }: {
        setLoginOpen: Function,
        auth: Auth,
        setCurrentUser: Function,
    }
) {
    const [inputs, setInputs] = useState({email: "", password: ""});

    function loginUser(email: string, password: string): Promise<User | null> {
        let user = signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const u = userCredentials.user;
                console.log(u);

                return u;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMsg = error.message;
                console.log(`Error logging in user: Error Code = ${errorCode}: ${errorMsg}`);

                return null;
            });

        return user;
    }

    return (
        <div className={styles.signupContainer}>
            <dialog className={styles.dialog}>
                <form name="signupForm" action="dialog" className={styles.form}>
                    <p className={styles.xButton} onClick={(e) => {
                        e.preventDefault();

                        setLoginOpen(false);
                    }}>X</p>
                    <div className={styles.inputRow}>
                        <label htmlFor="emailInput" className={styles.inputLabel}>
                            E-Mail:
                        </label>
                        <input type="email"
                            name="emailInput"
                            className={`${styles.emailInput} ${styles.formInput}`}
                            placeholder="johndoe@gmail.com"
                            content={inputs.email}
                            onChange={(e) => {
                                e.preventDefault();

                                setInputs({...inputs, email: e.target.value});
                            }}>
                        </input>
                    </div>
                    <div className={styles.inputRow}>
                        <label htmlFor="passwordInput" className={styles.inputLabel}>
                               Password:
                        </label>
                        <input type="password" name="passwordInput"
                            className={`${styles.passwordInput} ${styles.formInput}`}
                            placeholder="Pass_word-1234"
                            content={inputs.password}
                            onChange={(e) => {
                                e.preventDefault();

                                setInputs({...inputs, password: e.target.value});
                            }}>
                        </input>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type="button" className={styles.formButton}
                         onClick={(e) => {
                                e.preventDefault();

                                setLoginOpen(false);
                        }}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.formButton}
                         onClick={async (e) => {
                            e.preventDefault();

                            let user = await loginUser(inputs.email, inputs.password);

                            console.log(user);

                            if(user) {
                                console.log("Logged in user!");
                                setCurrentUser(user)
                            } else {
                                console.log("Failed to log in user");
                                setCurrentUser(user);
                            }
                        }}>
                            Log In!
                        </button>
                    </div>
                </form>
            </dialog>
        </div>
    );
}
