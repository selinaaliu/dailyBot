var token = "217076975:AAGu6shAF25MrRZvCCiX2fALTJk1cbLU-2E";

var Bot = require('node-telegram-bot-api');
var bot = new Bot(token, {polling: true});

console.log('bot server started...');

bot.onText(/^\/say_hello(.+)$/, function (msg, match) {
    var name = match[1];
    bot.sendMessage(msg.chat.id, 'Hello ' + name + ', good morning!')
    .then(function () {
        // reply sent!
    });
});
