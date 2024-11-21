// Jotai imports
import { atom } from "jotai";

// Libary imports
import { Config } from "./config";
import { BookList } from "./booklist";

export interface UserInfo {
  userConfig: Config;
  userBooks: BookList;
}

export interface LibrarySortState {
  sortBy: "title" | "author" | "pageCount";
  order: "ascending" | "descending";
}

// Define atoms for user account details
export const userInfoAtom = atom<UserInfo | null>(null);

export const registeredBookListsAtom = atom<string[]>([]);

// Shared state between Header component and library page for how the library should be sorted
export const librarySortAtom = atom<LibrarySortState | null>(null);
