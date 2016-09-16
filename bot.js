var Bot = require('node-telegram-bot-api');
var unirest = require('unirest');
var config = require('./config.json');
var botToken = config.TelegramBotToken;
var quoteUrl = config.MashapeApiUrl;
var quoteKey = config.MashapeApiKey;

var bot = new Bot(botToken, {polling: true});

console.log('bot server started...');

/*  Command: /iam <name>
 *  For user to introduce himself/herself.
 *  Bot replies with a greeting and a question.
 */
bot.onText(/^\/iam(.+)$/, function (msg, match) {
    //TODO: strip left-trailing spaces from name
    var name = match[1].trim();
    name = name.charAt(0).toUpperCase() + name.substring(1);
    var string = '\nWhat would you like to do today?';
    var reply = 'Sup ' + name + '!' + string;
    bot.sendMessage(msg.chat.id, reply);
});

/*  Command: /quote
 *  Bot replies with a random famous quote. 
 */
bot.onText(/^\/quote$/, function (msg, match) {
    unirest.post(quoteUrl)
    .header("X-Mashape-Key", quoteKey)
    .header("Content-Type", "application/x-www-form-urlencoded")
    .header("Accept", "application/json")
    .end(function (result) {
        console.log(result.status, result.headers, result.body);
        var data = JSON.parse(result.body);
        var string = '"' + data.quote + '"' + '\n- ' + data.author;
        bot.sendMessage(msg.chat.id, string);
    });
});
