// Tauri imports
import { open } from '@tauri-apps/api/shell';

// Openers
export function openSetup(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Setup.md");
}

export function openUpgrade(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Upgrade.md");
}

export function openManageBook(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Managing_a_Book.md");
}

export function openManageList(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Manage_a_List.md");
}

export function openManageDB(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Manage_Your_Database.md");
}

export function openDownloadDB(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham/BookTrack/blob/nextjs/guides/Download_Your_Database.md");
}

