var Bot = require('node-telegram-bot-api');
var unirest = require('unirest');
var config = require('./config.json');
var vulgarities = require('./vulgarities.json');
var vulgarRegex = new RegExp(vulgarities.words);
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

// TODO: add bible verse source api to bibleUrl
var bibleUrl = "";

/*  Command: /bible
 *  Bot replies with the bible verse queried
 *  TODO: make valid REST request to api endpoint
 *  TODO: transform response for formatted display
 */
bot.onText(/^\/bible(.+)/, function (msg, match) {
    var verseArgs = match[1];
    verseArgs = verseArgs.trim();
    console.log(verseArgs);
    verseQuery = bibleUrl + verseArgs;
    /*
    unirest.post(verseQuery).end(function (result) {
        console.log(result);
    });
    */
});

// keyboard configurations for study session settings
var hours_keyboard = [[
    {text: "1hr", callback_data: '1'}, 
    {text: "2hrs", callback_data: '2'}, 
    {text: "3hrs", callback_data: '3'}
    ]];
var reply_markup = JSON.stringify({
    inline_keyboard: hours_keyboard
});
var opts = {'reply_markup':reply_markup};

/*  Command: /study
 *  For user to start a timed study session.
 *  Bot responds with a prompt to set length of study session.
 */
bot.onText(/^\/study$/, function(msg, match) {
    var chatId = msg.chat.id;
    var qn = "Ok, how long would you like to study for?";
    bot.sendMessage(chatId, qn, opts);
});

/* After the study session starts, Bot messages user at 30min 
 * intervals to remind user to take a break.
 */
bot.on('callback_query', function (msg) {
    console.log("callback_query", msg);
    
    //TODO: verify that this is callback_query to qn about how many hours to study
    var numHours = msg.data;
    var reply = "Ok, your " + numHours + " hours starts now!";
    bot.answerCallbackQuery(msg.id, reply);
    
    // set study breaks 
    var numBreaks = numHours / 0.5;
    numBreaks = 3;
    var interval = 30 * 60 * 1000; // 30 mins
    var timer = setInterval(breakReminder, interval);
    function breakReminder () {
        bot.sendMessage(msg.from.id, 'Time to take a study break!');
        numBreaks--;
        //TODO: tell user how much longer to go
        if (numBreaks === 0) clearInterval(timer);
    };
});
/* Detects vulgarities and swearing in conversation
 * TODO: not working for group chat yet
 * TODO: implement a way to store/reset swear count
 */
var swearCount = {};
bot.onText(vulgarRegex, function (msg) {
    var content = msg.text;
    var chatId = msg.chat.id;
    var name = msg.chat.first_name;
    var resp = "";
    if (!(chatId in swearCount)) {
        swearCount[chatId] = 0;
        resp = "Please refrain from using vulgarities, "+ name + "!";
    } else {
        resp = "You are swearing again, "+ name + "!";
    }
    swearCount[chatId]++;
    bot.sendMessage(chatId, resp);
});
