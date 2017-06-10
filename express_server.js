// Essential requirements
var express = require("express");
var app = express();
app.set("view engine", "ejs");
var PORT = process.env.PORT || 8080;
var cookieSession = require('cookie-session');

// For encrypting passwords:
const bcrypt = require('bcrypt');

//Bodyparser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: false
}));

//parses cookies
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

function randomString() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = 6; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}

var urlDatabase = {
  "b2xVn2": {longurl: "http://www.lighthouselabs.ca", userId: "admin"},
  "9sm5xK": {longurl: "http://www.google.com", userId: "admin"}
};


var users = {};

var templateVars = {
      urls: urlDatabase,
      userId: "",
      email: "",
      password: "",
      shortURL: "",
      longURL: ""
    };

app.get("/", (req, res) => {
  if (req.session.userId){
    templateVars.userId = req.session.userId;
    templateVars.email = users[req.session.userId].email;
  } else {
    templateVars.userId = "";
    templateVars.email = "";
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/user", (req, res) => {
  templateVars.userId = req.session.userId;
  templateVars.email = users[req.session.userId].email;
  res.render("urls_user", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  templateVars.shortURL = req.params.id;
  templateVars.longURL = urlDatabase[req.params.id].longurl;
  res.render("urls_show", templateVars);
});

app.get("/urls/:id/edit", (req, res) => {
  if (urlDatabase[req.params.id].userId === req.session.userId) {
    templateVars.shortURL = req.params.id;
    templateVars.longURL = urlDatabase[req.params.id].longurl;
    res.render("urls_update", templateVars);
  }
});


app.get("/register", (req, res) => {
  res.render("registration");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/urls/create", (req, res) => {
  let theUrl = req.body.longURL;
  if (!(theUrl.slice(0,6) == "http://" || theUrl.slice(0,7) == "https://")) {
    theUrl = `http://${theUrl}`;
  }
  urlDatabase[randomString()] = {longurl: theUrl, userId: req.session.userId};
  res.redirect("/");
});

app.post("/urls/:id/delete", (req, res) => {
  if (urlDatabase[req.params.id].userId === req.session.userId) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls/user");
  }
});

app.post("/urls/:id/update", (req, res) => {
  let updatedUrl = req.body.longURL;
  if (!(updatedUrl.slice(0,7) == "http://" || updatedUrl.slice(0,8) == "https://")) {
    updatedUrl = `http://${updatedUrl}`;
  }
  if (urlDatabase[req.params.id].userId === req.session.userId) {
    urlDatabase[req.params.id].longurl = updatedUrl;
    res.redirect("/");
  }
});

app.post("/register", (req, res) => {
  let newUserID = generateRandomString();

  if (!req.body.email || !req.body.password) {

     res.send("error!");
  }
  else {
    var alreadyRegistered;
    for (var entry in users) {
      if (req.body.email === users[entry].email) {
         res.send("error!");
        alreadyRegistered = true;
      }
    }
    if (!alreadyRegistered) {
      const password = req.body.password;
      //
      users[newUserID] = {
        userId: newUserID,
        email: req.body.email,
        password: password
        //
      };

      req.session.userId = newUserID;
      res.redirect('/');
    }
  }
});

app.post("/login", (req, res) => {
  if (req.body.register) {
    res.redirect('/register');
  } else {

    if (!req.body.email || !req.body.password) {
       res.send("error!");
    } else {

      var userId;
      for (var entry in users) {
        if (req.body.email === users[entry].email) {
          userId = entry;
        }
      }
      if (!userId) {
         res.send("error!");
      } else {

        var user = users[userId];

        req.session.userId = user.userId;
        res.redirect('/');
      //
      }
    }
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});













































