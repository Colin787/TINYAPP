// Essential requirements
var express = require("express"); //
var app = express();
app.set("view engine", "ejs");
var PORT = process.env.PORT || 8080;
var cookieSession = require('cookie-session');
const funcyjs = require('./funcy');//file where my functions are stored
var users = {
  // object format below:
// "user": {id: "user", email: "", password: ""}
};

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
var urlDatabase = {
  "b2xVn2": {longurl: "http://www.lighthouselabs.ca", userId: "admin"},
  "9sm5xK": {longurl: "http://www.google.com", userId: "admin"}
};

var templateVars = {
      urls: urlDatabase,
      userId: "",
      email: "",
      password: "",
      shortURL: "",
      longURL: ""
    };
//page with all short urls/ links to websites to
app.get("/", (req, res) => {
  if (req.session.userId){
    templateVars.userId = req.session.userId;
    templateVars.email = users[req.session.userId].email;
    res.render("urls_index", templateVars);
  } else {
    res.render('login');
  }
});
//currently looged in users page with urls they added
app.get("/urls/user", (req, res) => {
  templateVars.userId = req.session.userId;
  templateVars.email = users[req.session.userId].email;
  res.render("urls_user", templateVars);
});
//create new url page
app.get("/urls/new", (req, res) => {
  res.render("urls_new", templateVars);
});
//page for said url you want to examine
app.get("/urls/:id", (req, res) => {
  templateVars.shortURL = req.params.id;
  templateVars.longURL = urlDatabase[req.params.id].longurl;
  res.render("urls_show", templateVars);
});
//user can edit urls here/update them
app.get("/urls/:id/edit", (req, res) => {
  if (urlDatabase[req.params.id].userId === req.session.userId) {
    templateVars.shortURL = req.params.id;
    templateVars.longURL = urlDatabase[req.params.id].longurl;
    res.render("urls_update", templateVars);
  }
});
//user registration page
app.get("/register", (req, res) => {
  res.render("registration");
});
//login page
app.get("/login", (req, res) => {
  res.render("login");
});
//create new short url
app.post("/urls/create", (req, res) => {
  let theUrl = req.body.longURL;
  if (!(theUrl.slice(0,6) == "http://" || theUrl.slice(0,7) == "https://")) {
    theUrl = `http://${theUrl}`;
  }
  urlDatabase[funcyjs.randomNumber()] = {longurl: theUrl, userId: req.session.userId};
  res.redirect("/");
});
//delete url and redirects back to /urls/user....aka updating the page
app.post("/urls/:id/delete", (req, res) => {
  if (urlDatabase[req.params.id].userId === req.session.userId) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls/user");
  }
});
//update the short url
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
//new user registration
app.post("/register", (req, res) => {
  let newUserID = funcyjs.randomNumber();

  if (!req.body.email || !req.body.password) {
    funcyjs.errorFunc("400! Fill in all the blanks please :)", true, res);
  }
  else {
    var registered;
    for (var id in users) {
      if (req.body.email === users[id].email) {
        funcyjs.errorFunc("400! This email address is already registered.", true, res);
        registered = true;
      }
    }
    if (!registered) {
      const password = req.body.password;
      const hashed_password = bcrypt.hashSync(password, 10);
      users[newUserID] = {
        userId: newUserID,
        email: req.body.email,
        password: hashed_password
      };

      req.session.userId = newUserID;
      res.redirect('/');
    }
  }
});
//log said user in
app.post("/login", (req, res) => {
  if (req.body.register) {
    res.redirect('/register');
  } else {

    if (!req.body.email || !req.body.password) {
      funcyjs.errorFunc("400! Email or pass is blank... Please fill in :)", false, res);
    } else {

      var userId;
      for (var id in users) {
        if (req.body.email === users[id].email) {
          userId = id;
        }
      }
      if (!userId) {
        funcyjs.errorFunc("400! Email not found.", false, res);
      } else {

        var user = users[userId];
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          funcyjs.errorFunc("Incorrect password, please try again.", false, res);
        } else {
          req.session.userId = user.userId;
          res.redirect('/');
        }
      }
    }
  } //
});// this is bracket for app.post
//user log out
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/');
});

//listening function also console logs port number
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});













































