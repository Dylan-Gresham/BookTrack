// Jotai imports
import { atom } from "jotai";

// Libary imports
import { Config } from "./config";
import { BookList } from "./booklist";

export interface UserInfo {
  userConfig: Config;
  userBooks: BookList;
}

// Define atoms for user account details
export const userInfoAtom = atom<UserInfo | null>(null);
