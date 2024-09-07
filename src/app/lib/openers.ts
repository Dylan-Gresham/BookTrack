// Tauri imports
import { open } from "@tauri-apps/api/shell";

/* Openers */

/**
 * Opens the setup instruction guide in the GitHub repo in the user's
 * default browser.
 */
export function openSetup(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();

  open(
    "https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Setup.md",
  );
}

/**
 * Opens the upgrade instruction guide in the GitHub repo in the user's
 * default browser.
 */
export function openUpgrade(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();

  open(
    "https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Upgrade.md",
  );
}

/**
 * Opens the manage books instruction guide in the GitHub repo in the user's
 * default browser.
 */
export function openManageBook(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();

  open(
    "https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Managing_a_Book.md",
  );
}

/**
 * Opens the manage lists instruction guide in the GitHub repo in the user's
 * default browser.
 */
export function openManageList(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();

  open(
    "https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Manage_a_List.md",
  );
}

/**
 * Opens the manage database instruction guide in the GitHub repo in the user's
 * default browser.
 */
export function openManageDB(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();

  open(
    "https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Manage_Your_Database.md",
  );
}

/**
 * Opens the download database instruction guide in the GitHub repo in the user's
 * default browser.
 */
export function openDownloadDB(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();

  open(
    "https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Download_Your_Database.md",
  );
}
