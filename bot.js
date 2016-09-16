var Bot = require('node-telegram-bot-api');
var unirest = require('unirest');
var config = require('./config.json');
var botToken = config.TelegramBotToken;
var quoteUrl = config.MashapeApiUrl;
var quoteKey = config.MashapeApiKey;

var bot = new Bot(botToken, {polling: true});

console.log('bot server started...');

bot.onText(/^\/say_hello(.+)$/, function (msg, match) {
    var name = match[1];
    var string = '\nWhat are you up to today?';
    bot.sendMessage(msg.chat.id, 'Sup' + name + string)
    .then(function () {
        // reply sent!
    });
});

bot.onText(/^\/quote$/, function (msg, match) {
    unirest.post(quoteUrl)
    .header("X-Mashape-Key", quoteKey)
    .header("Content-Type", "application/x-www-form-urlencoded")
    .header("Accept", "application/json")
    .end(function (result) {
          console.log(result.status, result.headers, result.body);
          var data = JSON.parse(result.body);
          var string = '"' + data.quote + '"' + '\n- ' + data.author;
          bot.sendMessage(msg.chat.id, string).then(function () {
              // reply sent!
          });
    });
});
