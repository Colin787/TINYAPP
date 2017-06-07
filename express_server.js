"use strict";
var express = require("express");
var app = express();
app.set("view engine", "ejs");
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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
  res.render('index');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.post('/urls/:url/delete', (req, res) => {
  delete urlDatabase[req.params.url];
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  urlDatabase[shortURL] = longURL;
  console.log(shortURL);
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  let valueOfDb = urlDatabase[req.params.id];
  let templateVars = { shortURL: req.params.id, longURL:valueOfDb };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = req.params.id
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
