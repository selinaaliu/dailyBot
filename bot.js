var token = "217076975:AAGu6shAF25MrRZvCCiX2fALTJk1cbLU-2E";

var Bot = require('node-telegram-bot-api');
var unirest = require('unirest');
var bot = new Bot(token, {polling: true});

console.log('bot server started...');

bot.onText(/^\/say_hello(.+)$/, function (msg, match) {
    var name = match[1];
    var string = '\n What are you up to today?';
    bot.sendMessage(msg.chat.id, 'Sup' + name + string)
    .then(function () {
        // reply sent!
    });
});

bot.onText(/^\/quote$/, function (msg, match) {
    unirest.post("https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous")
    .header("X-Mashape-Key", "zBULkZgMzamshDNXKLHPRvoNv7ipp1haR75jsnIhDyzxLGjO7w")
    .header("Content-Type", "application/x-www-form-urlencoded")
    .header("Accept", "application/json")
    .end(function (result) {
          console.log(result.status, result.headers, result.body);
          var data = JSON.parse(result.body);
          console.log("the quote: " + data.quote);
          bot.sendMessage(msg.chat.id, data.quote).then(function () {
              // reply sent!
          });
    });
});
