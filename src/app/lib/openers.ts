// Tauri imports
import { open } from '@tauri-apps/api/shell';

// Openers
export function openSetup(e: Event) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Setup.md");
}

export function openUpgrade(e: Event) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Upgrade.md");
}

export function openManageBook(e: Event) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Managing_a_Book.md");
}

export function openManageList(e: Event) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Manage_a_List.md");
}

export function openManageDB(e: Event) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Manage_Your_Database.md");
}

export function openDownloadDB(e: Event) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Download_Your_Database.md");
}

