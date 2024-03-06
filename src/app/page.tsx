'use client';

import styles from "./styles/page.module.css";
import { Cormorant_Garamond } from "next/font/google";
import { useState, useEffect, useRef, MutableRefObject } from 'react';
import { open } from '@tauri-apps/api/shell';
import { initializeApp } from 'firebase/app';
import  { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Signup from './components/authentication/signup';

const firebaseConfig = {
};

function openSetup(e: Event) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Setup.md");
}

function openUpgrade(e: Event) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Upgrade.md");
}

function openManageBook(e: Event) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Managing_a_Book.md");
}

function openManageList(e: Event) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Manage_a_List.md");
}

function openManageDB(e: Event) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Manage_Your_Database.md");
}

function openDownloadDB(e: Event) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Download_Your_Database.md");
}

const garamond500 = Cormorant_Garamond({ subsets: ["latin"], weight: "500" });

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Home() {
    const [registerOpen, setRegisterOpen] = useState(false);

    const guidesRef = useRef() as MutableRefObject<HTMLDivElement>;
    function scrollToGuides(e: Event) {
        e.preventDefault();

        window.scrollTo({
            top: guidesRef.current.offsetTop,
            behavior: "smooth"
        })
    }

    function registerOnClick(e: Event) {
        e.preventDefault();

        if(registerOpen) {
            setRegisterOpen(false);
        } else {
            setRegisterOpen(true);
        }
    }

    function loginOnClick(e: Event) {
        e.preventDefault();

        // TODO!
        return;
    }

    useEffect(() => {
        // Get all the buttons
        const loginButton = document.getElementById('loginButton');
        const registerButton = document.getElementById('registerButton');
        const setupButton = document.getElementById('setupButton');
        const upgradeButton = document.getElementById('upgradeButton');
        const manageBookButton = document.getElementById('manageBookButton');
        const manageListButton = document.getElementById('manageListButton');
        const manageDBButton = document.getElementById('manageDBButton');
        const downloadDBButton = document.getElementById('downloadDBButton');
        const getStartedButton = document.getElementById('getStartedButton');

        // Add the listeners on attach
        loginButton?.addEventListener("click", loginOnClick);
        registerButton?.addEventListener("click", registerOnClick);
        setupButton?.addEventListener("click", openSetup);
        upgradeButton?.addEventListener("click", openUpgrade);
        manageBookButton?.addEventListener("click", openManageBook);
        manageListButton?.addEventListener("click", openManageList);
        manageDBButton?.addEventListener("click", openManageDB);
        downloadDBButton?.addEventListener("click", openDownloadDB);
        getStartedButton?.addEventListener("click", scrollToGuides);

        return () => {
            // Remove the listeners on detach
            loginButton?.removeEventListener("click", loginOnClick);
            registerButton?.removeEventListener("click", registerOnClick);
            setupButton?.removeEventListener("click", openSetup);
            upgradeButton?.removeEventListener("click", openUpgrade);
            manageBookButton?.removeEventListener("click", openManageBook);
            manageListButton?.removeEventListener("click", openManageList);
            manageDBButton?.removeEventListener("click", openManageDB);
            downloadDBButton?.removeEventListener("click", openDownloadDB);
            getStartedButton?.removeEventListener("click", scrollToGuides);
        }
    }, []);

    return (
        <main className={styles.main}>
                <div className={registerOpen ?
                                `${styles.welcomeContainer} ${styles.backmost}`
                                : styles.welcomeContainer}>
                    <h1>Welcome to BookTrack!</h1>
                    <p className={garamond500.className}>BookTrack is a
                        user-friendly application designed to help you
                        easily keep track of your reading. Regardless of
                        what type of reader you are, this app makes it
                        simple to organize your library, set personal goals,
                        and stay motivated!
                    </p>
                </div>
                <div className={styles.typContainer}>
                    <h1>Track Your Progress</h1>
                    <h4>Manage your personal library efficiently and easily</h4>
                    <span>
                        <button type="button" id="getStartedButton">Get Started! &rarr;</button>
                    </span>
                </div>
                <div ref={guidesRef} className={styles.guideContainer}>
                    <h1>Guides</h1>
                    <div className={styles.guidesContainer}>
                        <button type="button" id="setupButton" className={styles.guideButton}>
                            Setup
                        </button>
                        <button type="button" id="upgradeButton" className={styles.guideButton}>
                            Upgrade
                        </button>
                        <button type="button" id="manageBookButton" className={styles.guideButton}>
                            Manage a Book
                        </button>
                        <button type="button" id="manageListButton" className={styles.guideButton}>
                            Manage a List
                        </button>
                        <button type="button" id="manageDBButton" className={styles.guideButton}>
                            Manage Your Database
                        </button>
                        <button type="button" id="downloadDBButton" className={styles.guideButton}>
                            Download Your Database
                        </button>
                    </div>
                </div>
                <div className={styles.featuresContainer}>
                    <h1>Features</h1>
                    <h4>Discover how BookTrack can benefit your library.</h4>
                    <div className={styles.featureButtons}>
                        <button type="button" className={styles.featureButton}>
                            <h3>Book Search</h3>
                            <p className={garamond500.className}>
                                Easily find a book you've already got in
                                your list or find books to add to your list!
                            </p>
                        </button>
                        <button type="button" className={styles.featureButton}>
                            <h3>Reading Progress</h3>
                            <p className={garamond500.className}>
                                Track your current progress for each book
                                with both percentage completion and page counts!
                            </p>
                        </button>
                        <button type="button" className={styles.featureButton}>
                            <h3>Custom Lists</h3>
                            <p className={garamond500.className}>
                                Create your own lists of books on top of
                                the default lists we provide for you
                            </p>
                        </button>
                        <button type="button" className={styles.featureButton}>
                            <h3>Set and Track Goals</h3>
                            <p className={garamond500.className}>
                                Set personal goals and choose to have
                                reminders sent to you regularly.
                            </p>
                        </button>
                    </div>
                    <button type="button" className={styles.dbButton}>
                        <h3>Database Management</h3>
                        <p className={garamond500.className}>
                            Your own personal database that you can manage
                            and have complete control over!
                        </p>
                        <p className={garamond500.className}>
                            Learn more about Turso
                            <a className={garamond500.className}> here!</a>
                        </p>
                    </button>
                </div>
                <div className={registerOpen ? styles.regular : styles.backmost}>
                    <div className={registerOpen ? styles.modelCover : ''}></div>
                    <div className={registerOpen ? styles.registerDiv : ''}>
                        <Signup />
                    </div>
                </div>
        </main>
    );
}
