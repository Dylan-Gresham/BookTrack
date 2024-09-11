"use client";

// Tauri imports
import { open } from "@tauri-apps/api/shell";

// CSS imports
import styles from "@/app/styles/footer.module.css";

function openDylanGitHubPage(e: any) {
  e.preventDefault();

  open("https://github.com/Dylan-Gresham");
}

function openFranciscoMurguiaGitHubPage(e: any) {
  e.preventDefault();

  open("https://github.com/FranciscoMurguia");
}
function openBrenekGitHubPage(e: any) {
  e.preventDefault();

  open("https://github.com/BrenekH");
}

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <h6>
        &#169; 2024{" "}
        <a className={styles.ghButton} onClick={openDylanGitHubPage}>
          Dylan Gresham
        </a>
        ,{" "}
        <a className={styles.ghButton} onClick={openFranciscoMurguiaGitHubPage}>
          Francisco Murguia
        </a>
        ,{" "}
        <a className={styles.ghButton} onClick={openBrenekGitHubPage}>
          Brenek Harrison
        </a>
        {" All Rights Reserved"}
      </h6>
    </footer>
  );
}
