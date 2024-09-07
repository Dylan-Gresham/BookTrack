"use client";

// React imports
import { useRef, useEffect, MutableRefObject } from "react";

// Jotai imports
import { useSetAtom } from "jotai";

// Tauri imports
import { invoke } from "@tauri-apps/api/tauri";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

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
import { Config, instanceOfConfig } from "./lib/config";
import { userInfoAtom, UserInfo } from "./lib/atoms";
import { BookList, instanceOfBookList } from "./lib/booklist";

// Define font
const garamond500 = Cormorant_Garamond({ subsets: ["latin"], weight: "500" });

// Home Component
export default function Home() {
  // Import the userInfo setter function
  const setUserInfo = useSetAtom(userInfoAtom);

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
    invoke("print_to_console", { msg: "Entering useEffect" });
    let configGotten = false;
    let config: Config = {
      username: "",
      dbName: "",
      dbUrl: "",
      dbToken: "",
      theme: "dark",
    };
    let booksGotten = false;
    let books: BookList = [];

    invoke("print_to_console", { msg: "Listening to START_CONFIG" });

    listen("START_CONFIG", (payload: any) => {
      // If the payload from the event is able to be casted to a Config...
      if (instanceOfConfig(payload.payload)) {
        // Do the cast and set the appropriate variable
        config = payload.payload as Config;
      } else {
        console.log("No default config found");
      }

      invoke("print_to_console", { msg: "Config gotten set to true" });
      configGotten = true;
    }).then((f) => f());

    invoke("print_to_console", { msg: "Listening to START_BOOKS" });

    listen("START_BOOKS", (payload: any) => {
      // If the payload from the event is able to be casted to a BookList...
      if (instanceOfBookList(payload.payload)) {
        // Do the cast and set the appropriate variable
        books = payload.payload as BookList;
      } else {
        console.log("No books in database at start");
      }

      invoke("print_to_console", { msg: "Books gotten set to true" });
      booksGotten = true;
    }).then((f) => f());

    invoke("print_to_console", { msg: "Starting potential infinite while" });

    // Loop until both listeners finish
    while (!configGotten);
    while (!booksGotten);

    invoke("print_to_console", { msg: "End potential infinite while" });

    let newUserInfo: UserInfo = { userConfig: config, userBooks: books };

    setUserInfo(newUserInfo);

    invoke("print_to_console", { msg: "State set" });
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
