"use client";

// React imports
import { FormEvent, useState } from "react";

// Jotai import
import { useAtom } from "jotai";

// NextJS import
import Link from "next/link";

// Tauri import
import { invoke } from "@tauri-apps/api/tauri";

// CSS import
import style from "../styles/createAccount.module.css";

// Library import
import { UserInfo, userInfoAtom } from "../lib/atoms";
import { Config } from "../lib/config";

export default function Page() {
  // Define state variables
  const [userInfo, setUserInfo] = useAtom<UserInfo | null>(userInfoAtom);
  const [startingName, _] = useState<string | null>(
    userInfo ? userInfo.userConfig.username : null,
  );

  const [dbName, setDbName] = useState<string>("");
  const [dbURL, setDbURL] = useState<string>("");
  const [dbToken, setDbToken] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Define wrapper function for handling the form submission
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    invoke("update_config", {
      username: userInfo?.userConfig.username,
      dbName: dbName,
      dbUrl: dbURL,
      dbToken: dbToken,
      theme: theme,
    })
      .then((msg) => console.log(msg))
      .catch((errMsg) => console.error(errMsg));
  }

  // Define account creation interface
  return (
    <div className={style.container}>
      <h1 className={style.title}>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div className={style.formGroup}>
          <label htmlFor="username" className={style.label}>
            Username:
          </label>
          <input
            className={style.textInput}
            type="text"
            id="username"
            value={userInfo ? userInfo.userConfig.username : ""}
            onChange={(e) => {
              // Define default user config
              let defaultUserConfig: Config = {
                username: "",
                dbName: "",
                dbUrl: "",
                dbToken: "",
                theme: "dark",
              };

              // Check nullity for TypeScript to be happy
              if (userInfo) {
                // If it's not null, spread the previous userInfo out
                setUserInfo({
                  ...userInfo,
                  userConfig: {
                    ...userInfo.userConfig,
                    // And update the username field
                    username: e.target.value,
                  },
                });
              } else {
                // If it's null, spread the default config out
                setUserInfo({
                  userConfig: {
                    ...defaultUserConfig,
                    // And update the username field
                    username: e.target.value,
                  },
                  userBooks: [],
                });
              }
            }}
            required
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="databaseName" className={style.label}>
            Database Name:
          </label>
          <input
            className={style.textInput}
            type="text"
            id="databaseName"
            value={dbName}
            onChange={(e) => setDbName(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="databaseURL" className={style.label}>
            Database URL:
          </label>
          <input
            className={style.textInput}
            type="url"
            id="databaseURL"
            value={dbURL}
            onChange={(e) => setDbURL(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="databaseToken" className={style.label}>
            Database Token:
          </label>
          <input
            className={style.textInput}
            type="text"
            id="databaseToken"
            value={dbToken}
            onChange={(e) => setDbToken(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroup}>
          <label className={style.label}>Theme:</label>
          <div>
            <label className={style.label}>
              <input
                className={style.radioInput}
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={(_) => setTheme("light")}
              />
              Light
            </label>
            <label className={style.label}>
              <input
                className={style.radioInput}
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={(_) => setTheme("dark")}
              />
              Dark
            </label>
          </div>
        </div>
        <div className={style.formButtons}>
          <Link href="/" id="submitButton">
            <button
              type="submit"
              className={style.formButton}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();

                invoke("update_config", {
                  username: userInfo ? userInfo.userConfig.username : "",
                  dbName: dbName,
                  dbUrl: dbURL,
                  dbToken: dbToken,
                  theme: theme,
                })
                  .then((msg) => console.log(msg))
                  .catch((errMsg) => console.error(errMsg));

                const linkToHome = document.getElementById("submitButton");
                linkToHome?.click();
              }}
            >
              Create Account
            </button>
          </Link>
          <Link href="/">
            <button
              type="button"
              className={style.formButton}
              onClick={(_: React.MouseEvent<HTMLButtonElement>) => {
                // Define default user config
                let defaultUserConfig: Config = {
                  username: "",
                  dbName: "",
                  dbUrl: "",
                  dbToken: "",
                  theme: "dark",
                };

                // Check nullity for TypeScript to be happy
                if (userInfo) {
                  // If it's not null, spread the previous userInfo out
                  setUserInfo({
                    ...userInfo,
                    userConfig: {
                      ...userInfo.userConfig,
                      // And revert the username field
                      username: startingName ? startingName : "",
                    },
                  });
                } else {
                  // If it's null, spread the default config out
                  setUserInfo({
                    userConfig: {
                      ...defaultUserConfig,
                      // And revert the username field
                      username: startingName ? startingName : "",
                    },
                    userBooks: [],
                  });
                }
              }}
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
