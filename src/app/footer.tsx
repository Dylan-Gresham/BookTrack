'use client'

import styles from './styles/footer.module.css';
import { open } from '@tauri-apps/api/shell';
import { useEffect } from 'react';

function openGitHubPage(e: any) {
    e.preventDefault();

    open("https://github.com/Dylan-Gresham")
}

export default function Footer() {
    useEffect(() => {
        const ghButton = document.getElementById('ghButton');
        ghButton?.addEventListener("click", openGitHubPage);

        return () => {
            ghButton?.removeEventListener("click", openGitHubPage);
        }
    }, []);

    return (
        <footer className={styles.footerContainer}>
            <h6>&#169; 2024 Dylan Gresham, All Rights Reserved</h6>
            <button type="button"><a id="ghButton">GitHub</a></button>
        </footer>
    );
}
