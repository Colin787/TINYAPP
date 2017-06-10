//functions for generating random number and error messages
module.exports.randomNumber = function randomString() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = 6; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}

module.exports.errorFunc = function(message, retryToRegister, res) {
  let firstmessage = `<html><body><p>${message}</p>`

  let secmessage = `<div><a href=\"/register\">Retry Registration</a></div>
                          <div><a href=\"/login\">Login</a></div></body></html>`;

  let thirdmessage = `<div><a href=\"/login\">Retry Logging In</a></div>
                          <div><a href=\"/register\">Register</a></div></body></html>`;

  if (retryToRegister) {
    res.status(400).send(`${firstmessage} ${secmessage}`);
  } else {
    res.status(400).send(`${firstmessage} ${thirdmessage}`);
  }
};
