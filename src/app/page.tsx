"use client";

// React imports
import { useRef, useEffect, MutableRefObject } from "react";

// Jotai imports
import { useAtom } from "jotai";

// Tauri imports
import { invoke } from "@tauri-apps/api/tauri";

// Style imports
import { Cormorant_Garamond } from "next/font/google";
import styles from "./styles/page.module.css";

// Component imports
import Header from "./components/header";

// Library imports
import {
  openDownloadDB,
  openManageBook,
  openManageDB,
  openManageList,
  openSetup,
  openUpgrade,
} from "./lib/openers";
import { Config } from "./lib/config";
import { userInfoAtom, UserInfo } from "./lib/atoms";
import { BookList } from "./lib/booklist";

// Define font
const garamond500 = Cormorant_Garamond({ subsets: ["latin"], weight: "500" });

// Home Component
export default function Home() {
  // Import the userInfo setter function
  //const setUserInfo = useSetAtom(userInfoAtom);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);

  // Define guides scroller
  const guidesRef = useRef() as MutableRefObject<HTMLDivElement>;
  function scrollToGuides(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    window.scrollTo({
      top: guidesRef.current.offsetTop,
      behavior: "smooth",
    });
  }

  // Define behavior to do on first render
  useEffect(() => {
    const initialize = async () => {
      let userConfig = await invoke<Config>("get_config_from_state");
      let userBooks = await invoke<BookList>("get_booklist_from_state");

      let newUserInfo: UserInfo = { userConfig, userBooks };

      setUserInfo(newUserInfo);
    };

    initialize().catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Header />
      {/* Define main home page layout.
       * Eventually there will need to be logic here that will tell
       * it to either render this on launch or the user's library page
       * when that's made.
       */}
      <main className={styles.main}>
        <div className={styles.welcomeContainer}>
          <h1>Welcome to BookTrack!</h1>
          <p className={garamond500.className}>
            BookTrack is a user-friendly application designed to help you easily
            keep track of your reading. Regardless of what type of reader you
            are, this app makes it simple to organize your library, set personal
            goals, and stay motivated!
          </p>
          {/* Testing button for running database get all query */}
          <button
            type="button"
            onClick={async (e: any) => {
              e.preventDefault();
              e.stopPropagation();

              let books: {
                title: string;
                author: string;
                page_count: number;
                pages_read: number;
                image: string;
              }[] = await invoke("get_all_books");
              books.map((book) => console.log(book));
            }}
          >
            Testing DB Button
          </button>
        </div>
        <div className={styles.typContainer}>
          <h1>Track Your Progress</h1>
          <h4>Manage your personal library efficiently and easily</h4>
          <span>
            <button
              type="button"
              id="getStartedButton"
              onClick={scrollToGuides}
            >
              Get Started! &rarr;
            </button>
          </span>
        </div>
        {/* The ref here is used for scrolling. See the `scrollToGuides` function for details */}
        <div ref={guidesRef} className={styles.guideContainer}>
          <h1>Guides</h1>
          <p>
            Visit these guides to learn more about the various capabilities of
            BookTrack!
          </p>
          <div className={styles.guidesContainer}>
            <button
              type="button"
              id="setupButton"
              className={styles.guideButton}
              onClick={openSetup}
            >
              Setup
            </button>
            <button
              type="button"
              id="upgradeButton"
              className={styles.guideButton}
              onClick={openUpgrade}
            >
              Upgrade
            </button>
            <button
              type="button"
              id="manageBookButton"
              className={styles.guideButton}
              onClick={openManageBook}
            >
              Manage a Book
            </button>
            <button
              type="button"
              id="manageListButton"
              className={styles.guideButton}
              onClick={openManageList}
            >
              Manage a List
            </button>
            <button
              type="button"
              id="manageDBButton"
              className={styles.guideButton}
              onClick={openManageDB}
            >
              Manage Your Database
            </button>
            <button
              type="button"
              id="downloadDBButton"
              className={styles.guideButton}
              onClick={openDownloadDB}
            >
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
                Easily find a book you've already got in your list or find books
                to add to your list!
              </p>
            </button>
            <button type="button" className={styles.featureButton}>
              <h3>Reading Progress</h3>
              <p className={garamond500.className}>
                Track your current progress for each book with both percentage
                completion and page counts!
              </p>
            </button>
            <button type="button" className={styles.featureButton}>
              <h3>Custom Lists</h3>
              <p className={garamond500.className}>
                Create your own lists of books on top of the default lists we
                provide for you
              </p>
            </button>
            <button type="button" className={styles.featureButton}>
              <h3>Set and Track Goals</h3>
              <p className={garamond500.className}>
                Set personal goals and choose to have reminders sent to you
                regularly.
              </p>
            </button>
          </div>
          <button type="button" className={styles.dbButton}>
            <h3>Database Management</h3>
            <p className={garamond500.className}>
              Your own personal database that you can manage and have complete
              control over!
            </p>
            <p className={garamond500.className}>
              Learn more about Turso
              <a className={garamond500.className}> here!</a>
            </p>
          </button>
        </div>
      </main>
    </>
  );
}
