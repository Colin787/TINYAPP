"use strict";
var express = require("express");
var app = express();
var cookieParser = require('cookie-parser');
app.set("view engine", "ejs");
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.redirect('/urls');
});

//GET URLS
app.get("/urls", (req, res) => {
  let templateVars = {
    username: req.cookies['username'],
    urls: urlDatabase
  };
  console.log("we are in the urls");
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  let username = req.cookies['name'];
  let templateVars = {
  username: req.cookies["username"],

  };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  urlDatabase[shortURL] = longURL;
  console.log(shortURL);
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies['username'],
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
  let username = req.cookies['name'];
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

//Post LOGIN
app.post('/login', (req, res) => {
  res.cookie('username',req.body.username);
  res.redirect('/urls');

});

app.post('/logout', (req, res) => {
  res.clearCookie("username",req.body.username);
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




