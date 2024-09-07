"use client";

// Tauri imports
import { open } from "@tauri-apps/api/shell";

// CSS imports
import styles from "../styles/footer.module.css";

// Function to open my GitHub page
function openGitHubPage(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();

  open("https://github.com/Dylan-Gresham");
}

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <h6>&#169; 2024 Dylan Gresham, All Rights Reserved</h6>
      <button type="button" onClick={openGitHubPage}>
        <a id="ghButton">GitHub</a>
      </button>
    </footer>
  );
}
