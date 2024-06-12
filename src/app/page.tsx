'use client';

// React imports
import { useState, useEffect, useRef, MutableRefObject } from 'react';

// Style imports
import { Cormorant_Garamond } from "next/font/google";
import styles from "./styles/page.module.css";

// Tauri imports
import { open } from '@tauri-apps/api/shell';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

// Component imports
import Header from './components/header';
import Footer from './components/footer';
import Signup from './components/authentication/signup';
import Signin from './components/authentication/signin';

// Define Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBDn6KtWHcjq04dMHyvBhr6kg492EBF4wk",
    authDomain: "booktrack-2d95a.firebaseapp.com",
    projectId: "booktrack-2d95a",
    storageBucket: "booktrack-2d95a.appspot.com",
    messagingSenderId: "117581302631",
    appId: "1:117581302631:web:2a7d8523e12b0e186b7dc2"
};

// Openers
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

// Define font
const garamond500 = Cormorant_Garamond({ subsets: ["latin"], weight: "500" });

// Initialize Firebase app and authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Home Component
export default function Home() {
    const [userInfo, setUserInfo] = useState({
        registerOpen: false,
        loginOpen: false,
        currentUser: auth.currentUser,
    });

    useEffect( () => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setUserInfo({...userInfo, registerOpen: false, loginOpen: false, currentUser: user});
            } else {
                setUserInfo({...userInfo, registerOpen: false, loginOpen: false, currentUser: null});
            }
        });
    }, []);

    console.log(userInfo.currentUser);

    function setLoginOpen(value: boolean) {
        setUserInfo({...userInfo, loginOpen: value});
    }

    function setRegisterOpen(value: boolean) {
        setUserInfo({...userInfo, registerOpen: value});
    }

    function setCurrentUser(user: User | null) {
        setUserInfo({loginOpen: false, registerOpen: false, currentUser: user});
    }

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

        setRegisterOpen(!userInfo.registerOpen);
    }

    function loginOnClick(e: Event) {
        e.preventDefault();

        setLoginOpen(!userInfo.loginOpen);
    }

    function signOutOnClick(e: Event) {
        e.preventDefault();

        auth.signOut();
    }

    useEffect(() => {
        // Get all the buttons
        const loginButton = document.getElementById('loginButton');
        const registerButton = document.getElementById('registerButton');
        const signOutButton = document.getElementById('signOutButton');
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
        signOutButton?.addEventListener("click", signOutOnClick);
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
            signOutButton?.removeEventListener("click", signOutOnClick);
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
        <>
            <Header currentUser={userInfo.currentUser}/>
            <main className={styles.main}>
                {userInfo.registerOpen === true && userInfo.currentUser === null && <Signup
                    setRegisterOpen={setRegisterOpen}
                    auth={auth}
                />}
                {userInfo.loginOpen === true && userInfo.currentUser === null  && <Signin
                    setLoginOpen={setLoginOpen}
                    auth={auth}
                    setCurrentUser={setCurrentUser}
                />}
                <div className={styles.welcomeContainer}>
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
                    <p>Visit these guides to learn more about the various capabilities of BookTrack!</p>
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
            </main>
            <Footer />
        </>
    );
}
