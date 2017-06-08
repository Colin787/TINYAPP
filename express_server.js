"use strict";
var express = require("express");
var app = express();
var cookieParser = require('cookie-parser');
app.set("view engine", "ejs");
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

function randomString() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = 6; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "userColin": {
    id: "userColin",
    email: "colinpark4@gmail.com",
    password: "peaches777"
  }
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.render('home');
});

//GET URLS
app.get("/urls", (req, res) => {
  const user_id = req.cookies['user_id'];
  let templateVars = {
    urls: urlDatabase,
    user: users[user_id]
  };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
  user: users[req.cookies["user_id"]],
  userData: users,
  };
  res.render("urls_new", templateVars);
});

app.get('/register', (req, res) => {
  let templateVars = {
    username: req.cookies["user_id"],
    user: users[req.cookies["user_id"]],
  };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  if(!req.body.email || !req.body.password){
    ////Send status code with response
    res.send("ERROR 400, Email or Pass is invalid/empty");
  }
  for (var obj in users) {
    if (req.body.email === users[obj]['email']){
      res.send("ERROR 400, Email exists in database already!");
    }
  }
  const user_id = randomString();

  // if initializing object then use the {}
  users[user_id] = {};
  users[user_id]['id'] = user_id;
  users[user_id]['password'] = req.body.password;
  users[user_id]['email'] = req.body.email;
  res.cookie('user_id', user_id);
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = randomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies['user_id'],
    userData: users
 };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = req.params.id
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:url/delete', (req, res) => {
  delete urlDatabase[req.params.url];
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  let username = req.cookies['user_id'];
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

//Post LOGIN
app.post('/login', (req, res) => {
  //this will set user id to undefined
  res.cookie('user_id',req.body.user_id);
  res.redirect('/urls');

});

app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




