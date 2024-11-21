# BookTrack

A book tracking application made by
[Dylan Gresham](https://www.github.com/Dylan-Gresham), [Brenek Harrison](https://github.com/BrenekH), and [Francisco Murguia](https://github.com/FranciscoMurguia) using Tauri & Next.js.

# Getting Started

## Requirements

- [NodeJS](https://nodejs.org/en/download/package-manager/current)
- [Yarn 1](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
- [Rust](https://www.rust-lang.org/tools/install)

## Setting up the Environment

```bash
$ git clone https://github.com/Dylan-Gresham/Booktrack.git
$ cd Booktrack
$ yarn
$ cd src-tauri
$ cargo build
```

The above commands will clone the repository, switch directories into the project, install all the JavaScript packages needed for running the program, change directories into the directory that contains all the Rust code, and then install all the packages for Rust.

## Running

To run Booktrack, simply run the below command from anywhere within the Booktrack directory (including directories within Booktrack).

```bash
$ yarn tauri dev
```

# Current Capabilities

On launch, a splashscreen with a simple loading spinner and message will appear. While it's shown, the backend (Rust) is sending an HTTP request to the SQLite database, hosted in the cloud for free by Turso, and retrieves all entries (books) in the database. Once the HTTP request completes and a resposne is given back, the results are printed to console and can be seen from the terminal where you can the run command.

Once the splashscreen closes, you can view the home page of Booktrack. The home page contains a header with the title of the app and a "Create Account" button. Below the header is a brief introduction to Booktrack, what it is, and what it's used for. Below the welcome section, there's a button to take you to the Getting Started section (the next section). The Getting Started section has buttons that will open links in your machine's default web browser. The links that are opened will eventually contain guides written in Markdown that teach users how to setup the app, upgrade/update the app and the underlying database (if using Turso), how to manage books/lists/database, and how to retrieve all the information that's contained within your app's database. Below the getting starteed section is the features section. The features section contains more links to eventual Markdown guides that will provide a brief introduction to each of the core functionalities of Booktrack. Finally there's the footer which shows the copyright for creation of the app and a link to the project's GitHub repository.

When the create account button is clicked, it opens a (very ugly) "account" creation page (route). This page contains fields for your username, database name, database URL, database token, and the app's theme. There's also a create account button and a cancel button at the bottom. The create account button will create a file in the `$CONFIG/booktrack` directory called `config.json` which will contain the data that you input. The cancel button will reset the username field (global state variable) to it's value when you first clicked the create account button from the home page. Both buttons will bring you back to the home page after clicking them, except for in the case where you try to create an account without filling in all the information.

# Contributors

## Core Developers

- [Dylan Gresham](https://github.com/Dylan-Gresham)

Special thanks to these guys for all their help throughout the lifetime of BookTrack. From start to finish I've been bouncing ideas off of these two and getting feedback from them.

- [Brenek Harrison](https://github.com/BrenekH)
- [Francisco Murguia](https://github.com/FranciscoMurguia)

# Scrum Linter

[Click here to go to the scrum linter page](https://scrumlinter.boisestate.edu/CS471F24ScrumLinterReports/CS471-F24-Team16_zJfC6vmp4zDCxbu7BAJvZEdKreMdp17gk36Q6Pj2/)
