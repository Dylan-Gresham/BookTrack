import styles from './styles/footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footerContainer}>
            <h6>&#169; 2024 Dylan Gresham, All Rights Reserved</h6>
            <button type="button">GitHub</button>
        </footer>
    );
}
