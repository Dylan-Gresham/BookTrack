'use client';

// React imports
import { useState, FormEvent } from 'react';

// NextJS imports
import Link from "next/link";

// Tauri imports
import { invoke } from '@tauri-apps/api/tauri';

// CSS import
import style from '../styles/createAccount.module.css';

export default function Page() {
    const [username, setUsername] = useState<string>('');
    const [dbName, setDbName] = useState<string>('');
    const [dbURL, setDbURL] = useState<string>('');
    const [dbToken, setDbToken] = useState<string>('');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();

        invoke('update_config', {
            username: username,
            db_name: dbName,
            db_url: dbURL,
            db_token: dbToken,
            theme: theme
        })
        .then( (msg) => console.log(msg))
        .catch( (errMsg) => console.error(errMsg));
    }

    return (
        <div className={style.container}>
            <h1 className={style.title}>Create Account</h1>
            <form onSubmit={handleSubmit}>
                <div className={style.formGroup}>
                    <label htmlFor="username" className={style.label}>Username:</label>
                    <input
                        className={style.textInput}
                        type="text"
                        id="username"
                        value={username}
                        onChange={ (e) => setUsername(e.target.value) }
                        required
                    />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="databaseName" className={style.label}>Database Name:</label>
                    <input
                        className={style.textInput}
                        type="text"
                        id="databaseName"
                        value={dbName}
                        onChange={ (e) => setDbName(e.target.value) }
                        required
                    />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="databaseURL" className={style.label}>Database URL:</label>
                    <input
                        className={style.textInput}
                        type="url"
                        id="databaseURL"
                        value={dbURL}
                        onChange={ (e) => setDbURL(e.target.value) }
                        required
                    />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="databaseToken" className={style.label}>Database Token:</label>
                    <input
                        className={style.textInput}
                        type="text"
                        id="databaseToken"
                        value={dbToken}
                        onChange={ (e) => setDbToken(e.target.value) }
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
                                checked={theme === 'light'}
                                onChange={ (_) => setTheme('light') }
                            />
                            Light
                        </label>
                        <label className={style.label}>
                            <input
                                className={style.radioInput}
                                type="radio"
                                name="theme"
                                value="dark"
                                checked={theme === 'dark'}
                                onChange={ (_) => setTheme('dark') }
                            />
                            Dark
                        </label>
                    </div>
                </div>
                <div className={style.formButtons}>
                    <Link href="/"><button type="submit" className={style.formButton}>Create Account</button></Link>
                    <Link href="/"><button type="button" className={style.formButton}>Cancel</button></Link>
                </div>
            </form>
        </div>
    );
}
