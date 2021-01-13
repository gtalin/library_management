const createError = require('http-errors');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const flash = require('express-flash');
const logger = require('morgan');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

// const {setLoginStatus} = require('./middleware/userStatus');
const indexRouter = require('./routes/index');
// const userRouter = require('./routes/user');
const catalogRouter = require('./routes/catalog');
const apiRouter = require('./routes/api');
const connectDB = require('./config/db');

// General setup
dotenv.config();
const app = express();

// Logging middleware
app.use(logger('dev'));

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to DB
connectDB();

/** *******
 * ------------ SESSION SETUP ----------------
 * Mongostore is used to store sesson data
 * Using the same connection for MongoStore as the one defined for DB
 */
const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: 'sessions',
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(flash());

/** *******
 * ------------ PASSPORT SETUP ----------------
 * passport authentication middleware initilaized after express-session
 * because it makes use of express-session
 */
// load the passport config file. This will register the strategies defiend by `passport.use` in the file
// require('./config/passport');
// app.use(passport.initialize());
// app.use(passport.session());

app.use('/', indexRouter);
// app.use('/user', userRouter);
app.use('/catalog', catalogRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
