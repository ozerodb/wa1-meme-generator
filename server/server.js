'use strict';

const express = require('express');
const morgan = require('morgan');
const memeDao = require('./dao-meme');
const userDao = require('./dao-user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

/* SETTING UP PASSPORT */
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect email and/or password.' });

      return done(null, user);
    }).catch(err => {
      return done(err, null);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'not authenticated' });
}

// init express
const app = new express();
app.use(morgan('dev'));
app.use(express.json());
const port = 3001;

// setup the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

// activate the server
app.listen(port, () => {
  console.log(`meme.boh server listening at http://localhost:${port}`);
});


/* USER AUTH APIs */

// POST /api/sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /api/sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /api/sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});

/* MEMES APIs */

// GET /api/memes
app.get('/api/memes', (req, res) => {
  memeDao.getMemes(req.isAuthenticated())
    .then(memes => res.json(memes))
    .catch(() => res.status(500).end());
});

// DELETE /api/memes/<id>
app.delete('/api/memes/:id', isLoggedIn, async (req, res) => {
  try {
    await memeDao.deleteMeme(req.params.id, req.user.id);
    res.status(204).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the deletion of meme ${req.params.id}.` });
  }
});

// POST /api/new_meme
app.post('/api/new_meme', isLoggedIn, async (req, res) => {

  const meme = req.body;

  try {
    await memeDao.createMeme(meme);
    res.status(201).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the creation of meme ${meme.title}.` });
  }
});