# Library Management App

Library management app with basic access Authentication.

The application has a single admin login.

It has a catalog (with the option to add, update and delete books, authors and book copies), a borrower section (with the option to add and modify a borrower and search borrowers) and an admin dashboard (which gives the statistics of total books present, books available and issued).

Apart from managing the catalog and borrower information, an admin can issue and return a book issued to a particular borrower.

## To run the app

Needs `nodejs` and `npm` to run and use the app.
Using `node` version: `v12.18.2` and `npm` version: `6.14.5`here.

To run the app, follow the steps below:

- Install the required dependencies for the applicaiton with : `npm install`
- Add a `.env` file in the directory with `app.js` to add the environment variables. And add the following 3 environment variables to it:

  - `DB_URI` which is the path of the MongoDB Atlas database.
  - Add a`SESSION_SECRET`
  - `BASIC_AUTH_PASSWORD`

- To start app, do: `npm start`. It starts the app at port `5000`. Open the app at: `http://localhost:5000/` and login to use the app. The username is `admin` and the password is whatever you set above.
