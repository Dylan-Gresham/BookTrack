import styles from "./styles/page.module.css";
import { Cormorant_Garamond } from "next/font/google";

const garamond500 = Cormorant_Garamond({ subsets: ["latin"], weight: "500" });

export default function Home() {
    return (
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
            </div>
            <div className={styles.typContainer}>
                <h1>Track Your Progress</h1>
                <h4>Manage your personal library efficiently and easily</h4>
                <span>
                    <button type="button">Get Started! &rarr;</button>
                </span>
            </div>
            <div className={styles.guideContainer}>
                <h1>Guides</h1>
                <div className={styles.guidesContainer}>
                    <button type="button" className={styles.guideButton}>
                        Setup
                    </button>
                    <button type="button" className={styles.guideButton}>
                        Upgrade
                    </button>
                    <button type="button" className={styles.guideButton}>
                        Manage a Book
                    </button>
                    <button type="button" className={styles.guideButton}>
                        Manage a List
                    </button>
                    <button type="button" className={styles.guideButton}>
                        Manage Your Database
                    </button>
                    <button type="button" className={styles.guideButton}>
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
    );
}
