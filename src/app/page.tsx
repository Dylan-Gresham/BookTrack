'use client';

// React imports
import { useEffect, useRef, MutableRefObject } from 'react';

// Tauri imports
import { invoke } from '@tauri-apps/api/tauri';

// Style imports
import { Cormorant_Garamond } from "next/font/google";
import styles from "./styles/page.module.css";

// Component imports
import Header from './components/header';
import Footer from './components/footer';

// Library imports
import { openDownloadDB, openManageBook, openManageDB, openManageList, openSetup, openUpgrade } from './lib/openers';

// Define font
const garamond500 = Cormorant_Garamond({ subsets: ["latin"], weight: "500" });

// Home Component
export default function Home() {
    const guidesRef = useRef() as MutableRefObject<HTMLDivElement>;
    function scrollToGuides(e: Event) {
        e.preventDefault();

        window.scrollTo({
            top: guidesRef.current.offsetTop,
            behavior: "smooth"
        })
    }

    useEffect(() => {
        // Get all the buttons
        const setupButton = document.getElementById('setupButton');
        const upgradeButton = document.getElementById('upgradeButton');
        const manageBookButton = document.getElementById('manageBookButton');
        const manageListButton = document.getElementById('manageListButton');
        const manageDBButton = document.getElementById('manageDBButton');
        const downloadDBButton = document.getElementById('downloadDBButton');
        const getStartedButton = document.getElementById('getStartedButton');

        // Add the listeners on attach
        setupButton?.addEventListener("click", openSetup);
        upgradeButton?.addEventListener("click", openUpgrade);
        manageBookButton?.addEventListener("click", openManageBook);
        manageListButton?.addEventListener("click", openManageList);
        manageDBButton?.addEventListener("click", openManageDB);
        downloadDBButton?.addEventListener("click", openDownloadDB);
        getStartedButton?.addEventListener("click", scrollToGuides);

        return () => {
            // Remove the listeners on detach
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
            <Header currentUser={null}/>
            <main className={styles.main}>
                <div className={styles.welcomeContainer}>
                    <h1>Welcome to BookTrack!</h1>
                    <p className={garamond500.className}>BookTrack is a
                        user-friendly application designed to help you
                        easily keep track of your reading. Regardless of
                        what type of reader you are, this app makes it
                        simple to organize your library, set personal goals,
                        and stay motivated!
                    </p>
                    <button type="button" onClick={ async (e: any) => {
                        e.preventDefault();
                        e.stopPropagation();

                        let books: {
                            title: string,
                            author: string,
                            page_count: number,
                            pages_read: number,
                            image: string,
                        }[] = await invoke('get_all_books');
                        books.map( (book) => console.log(book));
                    }}>
                        Testing DB Button
                    </button>
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
