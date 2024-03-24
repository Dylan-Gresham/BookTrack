import { Auth, createUserWithEmailAndPassword } from 'firebase/auth';
import styles from '../../styles/signup.module.css';
import { useState } from 'react';

export default function Signup(
    { setRegisterOpen, auth }: {
        setRegisterOpen: Function,
        auth: Auth
    }
) {
    const [inputs, setInputs] = useState({email: "", password: ""});

    function signUpNewUser(email: string, password: string): boolean {
        let retVal = false;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log(user);

                retVal = true;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMsg = error.message;
                console.log(`Error creating new user: Error Code = ${errorCode}: ${errorMsg}`);

                retVal = false;
            });

        return retVal;
    }

    return (
        <div className={styles.signupContainer}>
            <dialog className={styles.dialog}>
                <form name="signupForm" action="dialog" className={styles.form}>
                    <p className={styles.xButton} onClick={(e) => {
                        e.preventDefault();

                        setRegisterOpen(false);
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

                                setRegisterOpen(false);
                        }}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.formButton}
                         onClick={(e) => {
                            e.preventDefault();

                            if(signUpNewUser(inputs.email, inputs.password)) {
                                console.log("New user added!");
                            } else {
                                    console.log("Failed to add new user");
                            }

                            setRegisterOpen(false);
                        }}>
                            Register!
                        </button>
                    </div>
                </form>
            </dialog>
        </div>
    );
}
