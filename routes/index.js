var labyokeFinderClass = require('./labyokerfinder');
var accounting = require('./accounting');
var dates = require('../config/staticvariables');

exports.LabYokeDepartment = LabYokeDepartment;
exports.LabYokeLab = LabYokeLab;
exports.LabYokeLabVenn = LabYokeLabVenn;
exports.LabYokeUsers = LabYokeUsers;
exports.LabYokeUserTransfer = LabYokeUserTransfer;

var LabYokerOrder = labyokeFinderClass.LabYokerOrder;
var LabYokeReporterOrders = labyokeFinderClass.LabYokeReporterOrders;
var LabYokeReporterShares = labyokeFinderClass.LabYokeReporterShares;
var LabYokeReporterSavings = labyokeFinderClass.LabYokeReporterSavings;
var LabYokerGetOrder = labyokeFinderClass.LabYokerGetOrder;
var LabyokerPasswordChange = labyokeFinderClass.LabyokerPasswordChange;
var LabyokerRegister = labyokeFinderClass.LabyokerRegister;
var LabYokeFinder = labyokeFinderClass.LabYokeFinder;
var LabYokeUploader = labyokeFinderClass.LabYokeUploader;
var Labyoker = labyokeFinderClass.Labyoker;
var LabYokeAgents = labyokeFinderClass.LabYokeAgents;
var LabyokerUserDetails = labyokeFinderClass.LabyokerUserDetails;
var LabYokerChangeShare = labyokeFinderClass.LabYokerChangeShare;
var LabYokeBotOrder = labyokeFinderClass.LabYokeBotOrder;
var moment = require('moment-timezone');
var jstz = require('jstimezonedetect');

var express = require('express');
var util = require('util');
var router = express.Router();

var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

var localeslist = ["en","fr","se"];

var globalocale = "en";
var globalemail = "";
var globalabadmin = "";
var globalab = "";
var globaluserlang = "en";
var globalres;
var initial_sharesnum = 0;

var builder = require('botbuilder');
var connector = new builder.ChatConnector({
 appId: "179eabf1-4e28-43ef-bfb4-22159b624bcc",
 appPassword: "whLEJQ31#!&gghhuBOO674["
});

/*var bot = new builder.UniversalBot(connector);

bot.dialog('/', function (session) {
session.send("Hello There!");
console.log("connecting");
});
*/

var bot = new builder.UniversalBot(connector, function (session) {
/*var options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.confused");
console.log("bot locale: " + session.preferredLocale());
console.log("req locale: "+globalocale);
console.log("options: " + options);
    session.send(options, session.message.text);
    */
});

bot.dialog('/greet', function (session) {
    session.preferredLocale(globalocale, function (err) {
            if (!err) {
                // Locale files loaded
console.log("greet globalocale: " + session.preferredLocale());
var options = session.localizer.gettext(session.preferredLocale(), "bot.greet");
console.log("greeting: " + options);
    session.say(options);//"Oh Hello to you! What can I help you with? Try asking for 'help' or 'order <reagent>' or 'cancel order <reagent> from <email>'");

                //session.endDialog('locale_updated '+globalocale);
            } else {
                // Problem loading the selected locale
                session.error(err);
            }
        });

})

bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id == message.address.bot.id) {
                // Bot is joining conversation
                // - For WebChat channel you'll get this on page load.
//var msg = new builder.Message()
//                        .address(message.address);
                        
   // msg.data.text("bot.greet");

        //msg.data.text = "I see that you clicked a button.";
bot.beginDialog(message.address, '/greet');
   // bot.send(msg);                //var reply = new builder.Message()
                //        .address(message.address)
                //        .text("Welcome to my page");
                //bot.send(options);
            } else {
                // User is joining conversation
                // - For WebChat channel this will be sent when user sends first message.
                // - When a user joins a conversation the address.user field is often for
                //   essentially a system account so to ensure we're targeting the right 
                //   user we can tweek the address object to reference the joining user.
                // - If we wanted to send a private message to teh joining user we could
                //   delete the address.conversation field from the cloned address.
                /*var address = Object.create(message.address);
                address.user = identity;
                var reply = new builder.Message()
                        .address(address)
                        .text("Hello %s", identity.name);
                bot.send(reply);*/
            }
        });
    }
});

// Install a custom recognizer to look for user saying 'help' or 'goodbye'.
bot.recognizer({
  recognize: function (context, done) {
  var intent = { score: 0.0 };
  var matched = false;

        if (context.message.text) {
            var s = context.message.text.toLowerCase();
            switch (s) {
                case 'hi':
                    intent = { score: 1.0, intent: 'HiIntent' };
                    //break;
                default:
                    console.log("default: " + s.match(/(hello|hi)/i));
                    if (s.match(/(hello|hi|bonjour|bonsoir|salut|hej)/i)) {
                        intent = { score: 1.0, intent: 'HiIntent' };
                        matched = true;
                    }
                    if (s.match(/(thank|thanks|merci|tack)/i)) {
                        intent = { score: 1.0, intent: 'ThankIntent' };
                        matched = true;
                    }
                    if (s.match(/(cancel|annuler|annulleringsbeställning)/i)) {
                        intent = { score: 1.0, intent: 'CancelOrderIntent' };
                        matched = true;
                    }
                    if (s.match(/(order|commander|beställa)/i)) {
                        intent = { score: 1.0, intent: 'OrderIntent' };
                        matched = true;
                    }
                    if (s.match(/(help|aide|hjälp)/i)) {
                        intent = { score: 1.0, intent: 'HelpIntent' };
                        matched = true;
                    }
                    if (s.match(/(bye|goodbye|au revoir|hej då)/i)) {
                        intent = { score: 1.0, intent: 'CiaoIntent' };
                        matched = true;
                    }
                    if (s.match(/test/i)) {
                        intent = { score: 1.0, intent: 'TestIntent' };
                        matched = true;
                    }
                    if (s.match(/test2/i)) {
                        intent = { score: 1.0, intent: 'Test2Intent' };
                        matched = true;
                    }
                    if(!matched){
                        intent = { score: 1.0, intent: 'ConfusedIntent' };
                    }
                    break;
            }
        }
        done(null, intent);
    }
});

//bot.recognizer(new builder.RegExpRecognizer( "CancelOrderIntent", { en_us: /^(cancel|nevermind)/i, en_fr: /^(annuler)/i }));
bot.dialog('CancelDialog', function (session) {
var options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.cancel");
    session.say(options);//"Absolutely, I'm canceling your order now.");

            var input = session.message.text;
            var reagentText = "";
            var searchText = "";
            var emailText = "";
            if(input.length > 0){
                var searchText0 = input.split(' ')[0];
                console.log("searchText0: " + searchText0);
                var searchText1 = input.substring(searchText0.length,input.length);
                console.log("searchText1: " + searchText1);
                //searchText1 = searchText.trim();
                if(searchText1 != "" && searchText1.length > 0){
                searchText1 = searchText1.trim();

                var splitSearch;
                if(globalocale == "en"){
                 splitSearch = searchText1.split(' from ');
                } else if (globalocale == "fr"){
                    splitSearch = searchText1.split(' de ');
                } else if (globalocale == "se"){
                    splitSearch = searchText1.split(' från ');
                }
                if(splitSearch!=null && splitSearch.length == 2){
                var searchText2 = splitSearch[0];
                reagentText = searchText2.trim();
                var searchText3;
                if(globalocale == "en"){
                 searchText3 = searchText1.split(' from ')[1]
                } else if (globalocale == "fr"){
                  searchText3 = searchText1.split(' de ')[1]
                } else if (globalocale == "se"){
                  searchText3 = searchText1.split(' från ')[1]
                }
                
                console.log("searchText3: " + searchText3);
                emailText = searchText3.trim();
                console.log("reagentText: " + reagentText);
                console.log("emailText: " + emailText);


                } else {
                    options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.cancel.invalidsearch");
                    session.say(options);
                }


            } else {
                options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.cancel.invalidsearch");
                session.say(options); 
            }


            }
            var searchType = "key";
            var labYokeBotOrder = new LabYokeBotOrder(reagentText, globalemail, emailText, globalab);
            var messageStr = "";
            labYokeBotOrder.search(function(error, results) {
                console.log("results " + results[0].length);    
                if (reagentText != null && reagentText.length > 0){
                    var searchresults = results[0];
                    if(searchresults.length > 0){
                        console.log("test results is: " + results[0]);
                        var firstchoice = searchresults[0];

    var message = new builder.Message().addAttachment(createOrderCard(firstchoice,session,"Cancel"));
    session.delay(3000);
    session.send(message).endDialog();

                   } else {
options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.cancel.noresults");
session.send(options,searchText1);                      
                    }
                } else {
                    messageStr = "couldnt find order to cancel";
                    console.log(messageStr);
                    options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.cancel.invalidsearch");
session.say(options); 
                }
            });

}).triggerAction({ matches: 'CancelOrderIntent' });


bot.dialog('ConfusedDialog', function (session) {
var options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.confused");
    session.send(options, session.message.text);
}).triggerAction({ matches: 'ConfusedIntent' });

//bot.recognizer(new builder.RegExpRecognizer( "HiIntent", { en_us: /^(hello|hi)/i, en_fr: /^(salut|bonjour|bonsoir)/i }));
bot.dialog('HiDialog', function (session) {
var options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.hi");
    session.endConversation(options);//"Oh Hello to you! What can I help you with? Try asking for 'help' or 'order <reagent>' or 'cancel order <reagent> from <email>'");
}).triggerAction({ matches: 'HiIntent' });

bot.dialog('CiaoDialog', function (session) {
var options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.ciao");
    session.endConversation(options);//"Oh Hello to you! What can I help you with? Try asking for 'help' or 'order <reagent>' or 'cancel order <reagent> from <email>'");
}).triggerAction({ matches: 'CiaoIntent' });

bot.dialog('OrderDialog', function (session) {
    var options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.order");
session.say(options);//"Absolutely! Let's put it together...");

            var input = session.message.text;
            
            var searchText = "";
            if(input.length > 0){
                var searchText0 = input.split(' ')[0];
                searchText = input.substring(searchText0.length,input.length);
                searchText = searchText.trim();
            }
            var searchType = "key";
            var labYokeSearch = new LabYokeSearch(searchText, globalemail, searchType);
            var messageStr = "";
            labYokeSearch.botsearch(function(error, results) {
                console.log("results " + results[0].length);    
                if (searchText != null && searchText.length > 0){
                    var searchresults = results[0];
                    if(searchresults.length > 0){
                        //messageStr = (res.__("index.search.message1", {searchText:searchText})).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                        console.log("test results is: " + results[0]);
                        var firstchoice = searchresults[0];

//for(var prop in ob)
//    var i = prop % 2
//    var agent = ob[prop].agent

                        //messageStr = "Sorry we could not find any results with your reagent search request: <b>" + searchText + "</b>. Please try again.";
    var message = new builder.Message().addAttachment(createOrderCard(firstchoice,session,"Order"));
    session.delay(3000);
    session.send(message).endDialog();
                    } else {
options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.order.noresults");
session.send(options,searchText);                      
                    }
                    //res.render('search', {searchType:searchType,userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, mylab: req.session.lab, message: messageStr, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user,labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Search', fullname: req.session.fullname, sendemail: req.session.email, searchResults : results[0], agentsResults : results[1], searchformText: searchText, loggedIn : true});
                } else {
                    messageStr = "You entered an invalid reagent keyword. Please try again.";
                    console.log(messageStr);
                    options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.order.invalidsearch");
session.say(options); 
                    //res.render('search', {searchType:searchType,userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, message: res.__("index.search.message2"), mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname,isLoggedInAdmin: req.session.admin, title: 'Search', loggedIn : true, agentsResults : results[1]});
                }
            });


    

    //, I am putting an order out now. Please check your emails for confirmation.");
}).triggerAction({ matches: 'OrderIntent' });

bot.dialog('HelpDialog', function (session) {
    var options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.help");
    session.say(options);//"You seem to be asking for help on something. Try our [help](https://team-labyoke.herokuapp.com/help) section for a wealth of information and video tutorials. Anything else I can help you with?");
}).triggerAction({ matches: 'HelpIntent' });

bot.dialog('ThankDialog', function (session) {
    var options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.thanks");
    session.say(options);//"You are most welcome. I am always here when you need me.");
}).triggerAction({ matches: 'ThankIntent' });

function processOrder(results) {
console.log("process order: " + results.agent);
}

bot.beginDialogAction('Cancel', '/cancel');

bot.beginDialogAction('Order', '/order');

bot.dialog('/cancel', [

  function (session, args) {
    console.log("ordering lab: " + session.userData.results.lab);
    console.log("ordering agent: " + session.userData.results.agent);
    console.log("ordering vendor: " + session.userData.results.vendor);
    console.log("ordering catalognumber: " + session.userData.results.catalognumber);
    console.log("ordering email: " + session.userData.results.email);
    console.log("ordering location: " + session.userData.results.location);
    console.log("ordering lang: " + session.userData.results.lang);
    console.log("ordering globalemail: " + globalemail);
    console.log("ordering globalab: " + globalab);
    console.log("ordering globalabadmin: " + globalabadmin);
    console.log("ordering globalres: " + globalres);
    console.log("ordering globalocale: " + globalocale);
    console.log("ordering globaluserlang: " + globaluserlang);
    var ownerlang = session.userData.results.lang;

            /*var labYokerorder = new LabYokerOrder(session.userData.results.lab, session.userData.results.agent, session.userData.results.vendor, session.userData.results.catalognumber,session.userData.results.email,session.userData.results.location,globalemail,100, globalab,globalres,globaluserlang,ownerlang,globalabadmin);
            labYokerorder.order(function(error, results) {
                if(results != null && results=="successfulOrder"){
                    console.log("ordering agentform: " + session.userData.results.agent);
                    console.log("ordering location: " + session.userData.results.location);
                    var options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.cancelsuccessful");
                    session.say(options);
                } else {
                    var options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.cancelnotsuccessful");
                    session.say(options);
                }
            });*/
            var options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.cancelsuccessful");
            session.say(options);
  }
]);

bot.dialog('/order', [
  /*function (session) {
    builder.Prompts.text(session, 'Hi! What is your name?')
  },
  function (session, results) {
    session.userData.name = results.response
    session.send('Hello ' + session.userData.name)
    session.endDialog()
  }*/
  function (session, args) {
    console.log("ordering lab: " + session.userData.results.lab);
    console.log("ordering agent: " + session.userData.results.agent);
    console.log("ordering vendor: " + session.userData.results.vendor);
    console.log("ordering catalognumber: " + session.userData.results.catalognumber);
    console.log("ordering email: " + session.userData.results.email);
    console.log("ordering location: " + session.userData.results.location);
    console.log("ordering lang: " + session.userData.results.lang);
    console.log("ordering globalemail: " + globalemail);
    console.log("ordering globalab: " + globalab);
    console.log("ordering globalabadmin: " + globalabadmin);
    console.log("ordering globalres: " + globalres);
    console.log("ordering globalocale: " + globalocale);
    console.log("ordering globaluserlang: " + globaluserlang);
    var ownerlang = session.userData.results.lang;

            var labYokerorder = new LabYokerOrder(session.userData.results.lab, session.userData.results.agent, session.userData.results.vendor, session.userData.results.catalognumber,session.userData.results.email,session.userData.results.location,globalemail,100, globalab,globalres,globaluserlang,ownerlang,globalabadmin);
            labYokerorder.order(function(error, results) {
                if(results != null && results=="successfulOrder"){
                    console.log("ordering agentform: " + session.userData.results.agent);
                    console.log("ordering location: " + session.userData.results.location);
                    var options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.ordersuccessful");
                    session.say(options);
                    //res.render('search', {lang:req.cookies.i18n, i18n:res,booster:req.session.savingsText, boostercolor:req.session.savingsColor, currentlabname:req.session.lab, categories: req.session.categories, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title:'Search',loggedIn : true, order_location: location, order_agent: agent, order_vendor: vendor, order_catalog: catalognumber, email: email});
                    //req.session.messages = null;
                } else {
                    var options = session.localizer.gettext(session.preferredLocale(globalocale), "bot.ordernotsuccessful");
                    session.say(options);
                }
            });
  }
]);

function createOrderCard(results,session,type) {
    console.log("creating card");
    var opttitle = session.localizer.gettext(session.preferredLocale(globalocale), "bot."+type+".title");
    var optsubtitle = session.localizer.gettext(session.preferredLocale(globalocale), "bot."+type+".subtitle");
    var optreagent = session.localizer.gettext(session.preferredLocale(globalocale), "bot.order.reagent");
    var optvendor = session.localizer.gettext(session.preferredLocale(globalocale), "bot.order.vendor");
    var optcatalog = session.localizer.gettext(session.preferredLocale(globalocale), "bot.order.catalognumber");
    var optemail = session.localizer.gettext(session.preferredLocale(globalocale), "bot.order.email");
    var optbutton = session.localizer.gettext(session.preferredLocale(globalocale), "bot.order.button");

session.userData.results = results;

var buttonList = [builder.CardAction.dialogAction(session, type, session, 'Yes')];
/*[new builder.CardAction()
    .title(optbutton)
    .type('postBack')
    .value(processOrder(results))
]*/
    return new builder.HeroCard()
        .title(opttitle)
        .subtitle(optsubtitle)
        .text("**"+optreagent+":** " + results.agent + "\n\n**"+optvendor+":** " + results.vendor + "\n\n**"+optcatalog+":** " + results.catalognumber + "\n\n**"+optemail+":** " + results.email)
        .buttons(buttonList);
}

bot.dialog('Test2Dialog', function (session) {
var message = new builder.Message().addAttachment(hotelAsAttachment());
session.send(message).endDialog();
}).triggerAction({ matches: 'Test2Intent' });

bot.dialog('TestDialog', function (session) {
    //session.say("You are most welcome. I am always here when you need me.");

var msg = new builder.Message(session)
    .addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            speak: "<s>Your  meeting about \"Adaptive Card design session\"<break strength='weak'/> is starting at 12:30pm</s><s>Do you want to snooze <break strength='weak'/> or do you want to send a late notification to the attendees?</s>",
               body: [
                    {
                        "type": "TextBlock",
                        "text": "Adaptive Card design session",
                        "size": "large",
                        "weight": "bolder"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Conf Room 112/3377 (10)"
                    },
                    {
                        "type": "TextBlock",
                        "text": "12:30 PM - 1:30 PM"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Snooze for"
                    },
                    {
                        "type": "Input.ChoiceSet",
                        "id": "snooze",
                        "style":"compact",
                        "choices": [
                            {
                                "title": "5 minutes",
                                "value": "5",
                                "isSelected": true
                            },
                            {
                                "title": "15 minutes",
                                "value": "15"
                            },
                            {
                                "title": "30 minutes",
                                "value": "30"
                            }
                        ]
                    }
                ],
                "actions": [
                    {
                        "type": "Action.Http",
                        "method": "POST",
                        "url": "http://foo.com",
                        "title": "Snooze"
                    },
                    {
                        "type": "Action.Http",
                        "method": "POST",
                        "url": "http://foo.com",
                        "title": "I'll be late"
                    },
                    {
                        "type": "Action.Http",
                        "method": "POST",
                        "url": "http://foo.com",
                        "title": "Dismiss"
                    }
                ]
        }
    });
session.send(msg).endDialog();
}).triggerAction({ matches: 'TestIntent' });

//var fs = require('fs');
//html-pdf

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
var upload = multer({ //multer settings
    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        console.log("inside upload function");
        callback(null, true);
    }
}).single('file');


module.exports = function(router) {

	var competitionStarts = dates.competitionStarts;
	var competitionEnds = dates.competitionEnds;

    router.post('/api/messages', connector.listen());

    router.post('/admins/:doing', isLoggedInAdmin, function(req, res) {
        if(req.cookies.i18n == null || req.cookies.i18n == undefined){
            req.cookies.i18n = "en";
        }
        globalocale = req.cookies.i18n;
        var doing = req.params.doing;
        console.log("do: " + doing);
        res.setLocale(req.cookies.i18n);
        var exceltojson;
        upload(req,res,function(err){
            var cont = 1;
            if(err){
                 //res.json({error_code:1,err_desc:err});
                 res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "generic", report_data:req.session.report_data, myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Admins', labyoker : req.session.user, labyokersurname : req.session.surname
                 });
                 cont = 0;
                 console.log("generic error: "+cont);
                 //return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                //res.json({error_code:1,err_desc:"No file passed"});
                
                res.render('admins', {
                   currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "nofile", report_data:req.session.report_data, myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Admins', labyoker : req.session.user, labyokersurname : req.session.surname
                });
                cont = 0;
                console.log("no file error: " + cont);
                //return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(cont == 1){
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        //return res.json({error_code:1,err_desc:err, data: null});

                        res.render('admins', {
                        currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "nodata", report_data:req.session.report_data, myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Admins', spreadname: req.file.originalname, labyoker : req.session.user, labyokersurname : req.session.surname
                        });
                        cont = 0;
                        console.log("no data error : " + cont);
                    }
                    if(cont == 1){
                    //var ob = { data:result};
                    console.log("inside upload ");
                    var labYokeUploader = new LabYokeUploader(result);
                            /*var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept);
        labYokeAgents.findmyshares(function(error, results) {
            //req.session.orders = results[2];
            req.session.shares = 0;
            console.log("test ? " + results[3]);
*/
                    labYokeUploader.upload(function(error, done) {
                        //console.log("is upload json: " + json);
                        console.log("is upload done?: " + done);
                    if(done == "successfulUpload"){
                        console.log("inside successful upload");
                        console.log("mysharesrequest " + req.session.mysharesrequest);
                        res.render('admins', {
                        currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, myshares: req.session.myshares, report_data:req.session.report_data, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, json: result, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Admins', spreadname: req.file.originalname, labyoker : req.session.user, labyokersurname : req.session.surname
                    });
                    } else if(done == "cannotUploadMissingData"){
                        console.log("inside missing data");
                        res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "missingdata", report_data:req.session.report_data, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
                        req.session.messages = null;
                    } else if(done == "cannotUploadMissingColumn"){
                        console.log("inside missing column");
                        res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "missingcolumn", report_data:req.session.report_data, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
                        req.session.messages = null;
                    } else {
                        console.log("inside not successful upload");
                        res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "databaserror", report_data:req.session.report_data, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: req.session.myshares, mysharesrequest: req.session.mysharesrequest, report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
                        req.session.messages = null;
                    }
                });
}

        //});

                    //res.json({error_code:0,err_desc:null, data: result});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corrupted excel file"});
            }
        }
        })
    });

    router.post('/admins', isLoggedInAdmin, function(req, res) {
        if(req.cookies.i18n == null || req.cookies.i18n == undefined){
            req.cookies.i18n = "en";
        }
        globalocale = req.cookies.i18n;
        var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept,req.session.labadmin,req.session.oninsuff);
        labYokeAgents.findallsharesadmins(function(error, resultss) {
            //req.session.orders = results[2];

        res.setLocale(req.cookies.i18n);
        var exceltojson;
        upload(req,res,function(err){
            var cont = 1;
            if(err){
                 //res.json({error_code:1,err_desc:err});
                 res.render('admins', {
                   currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,meadminof:req.session.meadminof,lang:req.cookies.i18n, i18n:res, nosuccess: "generic", report_data:resultss[2], myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Admins', labyoker : req.session.user, labyokersurname : req.session.surname
                 });
                 cont = 0;
                 console.log("generic error: "+cont);
                 //return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                //res.json({error_code:1,err_desc:"No file passed"});
                
                res.render('admins', {
                   currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,meadminof:req.session.meadminof,ang:req.cookies.i18n, i18n:res, nosuccess: "nofile", report_data:resultss[2], myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Admins', labyoker : req.session.user, labyokersurname : req.session.surname
                });
                cont = 0;
                console.log("no file error: " + cont);
                //return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(cont == 1){
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        //return res.json({error_code:1,err_desc:err, data: null});

                        res.render('admins', {
                        currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,meadminof:req.session.meadminof,lang:req.cookies.i18n, i18n:res, nosuccess: "nodata", report_data:resultss[2], myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Admins', spreadname: req.file.originalname, labyoker : req.session.user, labyokersurname : req.session.surname
                        });
                        cont = 0;
                        console.log("no data error : " + cont);
                    }
                    if(cont == 1){
                    //var ob = { data:result};
                    console.log("inside upload ");
                    var labYokeUploader = new LabYokeUploader(result);
                            /*var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept);
        labYokeAgents.findmyshares(function(error, results) {
            //req.session.orders = results[2];
            req.session.shares = 0;
            console.log("test ? " + results[3]);
*/
                    labYokeUploader.upload(function(error, done) {
                        //console.log("is upload json: " + json);
                        console.log("is upload done?: " + done);
                    if(done == "successfulUpload"){
                        console.log("inside successful upload");
                        ///console.log("mysharesrequest " + req.session.mysharesrequest);
                        res.render('admins', {
                        currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,meadminof:req.session.meadminof,lang:req.cookies.i18n, i18n:res, report_data:resultss[2], myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, json: result, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Admins', spreadname: req.file.originalname, labyoker : req.session.user, labyokersurname : req.session.surname
                    });
                    } else if(done == "cannotUploadMissingData"){
                        console.log("inside missing data");
                        res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,meadminof:req.session.meadminof,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "missingdata", report_data:resultss[2], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: resultss[1], report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
                        req.session.messages = null;
                    } else if(done == "cannotUploadMissingColumn"){
                        console.log("inside missing column");
                        res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,meadminof:req.session.meadminof,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "missingcolumn", report_data:resultss[2], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: resultss[1], report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
                        req.session.messages = null;
                    }  else {
                        console.log("inside not successful upload");
                        res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,meadminof:req.session.meadminof,lang:req.cookies.i18n, i18n:res, nosuccess: "databaserror", report_data:resultss[2], myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: resultss[1], report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
                        req.session.messages = null;
                    }
                });
}

        //});

                    //res.json({error_code:0,err_desc:null, data: result});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corrupted excel file"});
            }
        }
        })
    });
});

    router.post('/shares/:doing', isLoggedIn, function(req, res) {
    	if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
        var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept,req.session.labadmin,req.session.oninsuff);
        labYokeAgents.findallsharesadmins(function(error, resultss) {
		var doing = req.params.doing;
		console.log("do: " + doing);
    	res.setLocale(req.cookies.i18n);
        var exceltojson;
        upload(req,res,function(err){
        	var cont = 1;
            if(err){
                 //res.json({error_code:1,err_desc:err});
                 res.render('share', {
                   currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "generic", myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', labyoker : req.session.user, labyokersurname : req.session.surname
                 });
                 cont = 0;
                 console.log("generic error: "+cont);
                 //return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                //res.json({error_code:1,err_desc:"No file passed"});
                
                res.render('share', {
                   currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "nofile", myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', labyoker : req.session.user, labyokersurname : req.session.surname
                });
                cont = 0;
                console.log("no file error: " + cont);
                //return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(cont == 1){
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        //return res.json({error_code:1,err_desc:err, data: null});

                        res.render('share', {
                    	currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "nodata", myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', spreadname: req.file.originalname, labyoker : req.session.user, labyokersurname : req.session.surname
                    	});
                    	cont = 0;
                    	console.log("no data error : " + cont);
                    }
                    if(cont == 1){
                    //var ob = { data:result};
                    console.log("inside upload ");
                    var labYokeUploader = new LabYokeUploader(result);
                    		/*var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept);
		labYokeAgents.findmyshares(function(error, results) {
			//req.session.orders = results[2];
			req.session.shares = 0;
			console.log("test ? " + results[3]);
*/
                    labYokeUploader.upload(function(error, done) {
                    	//console.log("is upload json: " + json);
                    	console.log("is upload done?: " + done);
                    if(done == "successfulUpload"){
                    	console.log("inside successful upload");
                    	//console.log("mysharesrequest " + req.session.mysharesrequest);
                    	res.render('share', {
                    	currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, json: result, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', spreadname: req.file.originalname, labyoker : req.session.user, labyokersurname : req.session.surname
                    });
                	} else if(done == "cannotUploadMissingData"){
                        console.log("inside missing data");
                        res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "missingdata", report_data:resultss[2], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: resultss[1], report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
                        req.session.messages = null;
                    } else if(done == "cannotUploadMissingColumn"){
                        console.log("inside missing column");
                        res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "missingcolumn", report_data:resultss[2], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: resultss[1], report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
                        req.session.messages = null;
                    }  else {
                		console.log("inside not successful upload");
                		res.render('share', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "databaserror", report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Share'});
						req.session.messages = null;
                	}
                });
}

		//});

                    //res.json({error_code:0,err_desc:null, data: result});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corrupted excel file"});
            }
        }
        })
    });
});

    router.post('/shares', isLoggedIn, function(req, res) {
    	if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
        var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept,req.session.labadmin,req.session.oninsuff);
        labYokeAgents.findallsharesadmins(function(error, resultss) {
    	res.setLocale(req.cookies.i18n);
        var exceltojson;
        upload(req,res,function(err){
        	var cont = 1;
            if(err){
                 //res.json({error_code:1,err_desc:err});
                 res.render('share', {
                   currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, nosuccess: "generic", myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', labyoker : req.session.user, labyokersurname : req.session.surname
                 });
                 cont = 0;
                 console.log("generic error: "+cont);
                 //return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                //res.json({error_code:1,err_desc:"No file passed"});
                
                res.render('share', {
                   currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, nosuccess: "nofile", myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', labyoker : req.session.user, labyokersurname : req.session.surname
                });
                cont = 0;
                console.log("no file error: " + cont);
                //return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(cont == 1){
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        //return res.json({error_code:1,err_desc:err, data: null});

                        res.render('share', {
                    	currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, nosuccess: "nodata", myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', spreadname: req.file.originalname, labyoker : req.session.user, labyokersurname : req.session.surname
                    	});
                    	cont = 0;
                    	console.log("no data error : " + cont);
                    }
                    if(cont == 1){
                    //var ob = { data:result};
                    console.log("inside upload ");
                    var labYokeUploader = new LabYokeUploader(result);
                    		/*var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept);
		labYokeAgents.findmyshares(function(error, results) {
			//req.session.orders = results[2];
			req.session.shares = 0;
			console.log("test ? " + results[3]);
*/
                    labYokeUploader.upload(function(error, done) {
                    	//console.log("is upload json: " + json);
                    	console.log("is upload done?: " + done);
                    if(done == "successfulUpload"){
                    	console.log("inside successful upload");
                    	//console.log("mysharesrequest " + req.session.mysharesrequest);
                    	res.render('share', {
                    	currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, json: result, loggedIn : true, isLoggedInAdmin: req.session.admin, title: 'Share', spreadname: req.file.originalname, labyoker : req.session.user, labyokersurname : req.session.surname
                    });
                	} else if(done == "cannotUploadMissingData"){
                        console.log("inside missing data");
                        res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "missingdata", report_data:resultss[2], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: resultss[1], report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
                        req.session.messages = null;
                    } else if(done == "cannotUploadMissingColumn"){
                        console.log("inside missing column");
                        res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res, nosuccess: "missingcolumn", report_data:resultss[2], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: resultss[1], report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
                        req.session.messages = null;
                    }  else {
                		console.log("inside not successful upload");
                		res.render('share', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, nosuccess: "databaserror", report_venn: req.session.report_venn, test: req.session.test, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: resultss[1], mysharesrequest: resultss[4], report_sharesbycategory: req.session.report_sharesbycategory, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Share'});
						req.session.messages = null;
                	}
                });
}

		//});

                    //res.json({error_code:0,err_desc:null, data: result});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corrupted excel file"});
            }
        }
        })
    });
});

	router.get('/', function(req, res) {
		res.redirect('/search');
	});

	router.get('/admin', function(req, res) {
		res.redirect('/shares');
	});

    router.get('/admins', isLoggedInAdmin, function(req, res) {
        if(req.cookies.i18n == null || req.cookies.i18n == undefined){
            req.cookies.i18n = "en";
        }
        globalocale = req.cookies.i18n;
        res.setLocale(req.cookies.i18n);
        var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept,req.session.labadmin,req.session.oninsuff);
        labYokeAgents.findallsharesadmins(function(error, results) {
            //req.session.orders = results[2];
            
            ///req.session.myshares = results[1];
            ///req.session.report_data = results[2];
            ///req.session.mysharesrequest = results[4];
            ///req.session.meadminof = results[0];

            //req.session.test = results[4];
            //req.session.report_venn = results[5];
            //req.session.shares = 0;
            console.log("test ? " + results[4]);
            console.log("meadminof ? " + results[0]);
            res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, currentlabname: results[0], ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: results[1], mysharesrequest: results[4], report_data: results[2], loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
            req.session.messages = null;
        });
    });

	router.get('/test', function(req, res) {

		var lang = req.query.lang;
		console.log("lang is init: " + lang);
		if(lang == null || lang == undefined){
			lang = "en";
		}
		console.log("lang is finally: " + lang);
		res.cookie('i18n', lang);
		req.cookies.i18n = lang;
		res.setLocale(req.cookies.i18n);
		var labYokeTest = new LabYokeTest(res);
		labYokeTest.test(function(error, done) {

		res.render('test',{currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n: res});
	});
	});

	router.get('/help', function(req, res) {
		var lang = req.query.lang;
		console.log("lang is init from param: " + lang);
		if(lang == null || lang == undefined){
			lang = req.cookies.i18n;
			console.log("lang is from cookies: " + lang);
		}
		if(lang == null || lang == undefined){
			lang = "en";
		}
        globalocale = lang;
		console.log("lang is finally: " + lang);
		res.cookie('i18n', lang);
		req.cookies.i18n = lang;
		res.setLocale(req.cookies.i18n);
		res.render('help', {
			currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n,
			i18n:res,
			ordersnum: req.session.orders,
			sharesnum: req.session.shares,
			title : 'Help',
			loggedIn : req.session.loggedin,
			labyoker : req.session.user,
            labyokersurname : req.session.surname,
			isLoggedInAdmin: req.session.admin,
			menu : 'help',
			title: 'Help'
		});
	});

	router.get('/about', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		res.render('about', {
			currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n,
			i18n:res,
			ordersnum: req.session.orders,
			sharesnum: req.session.shares,
			title : 'About Us',
			loggedIn : req.session.loggedin,
			labyoker : req.session.user,
            labyokersurname : req.session.surname,
			isLoggedInAdmin: req.session.admin,
			menu : 'about'
		});
	});

	router.get('/logout', function(req, res) {
		req.logout();
		req.session.user = null;
        req.session.surname = null;
		req.session.loggedin = false;
        req.session.to = null;
        res.clearCookie("sh");
        res.clearCookie("is");
        res.clearCookie("ntf");
		res.redirect('/login');
	});

	function isLoggedIn(req, res, next) {
        console.log("req.session.user: " + req.session.user);
		if (req.session.user)
			return next();
		console.log('requested url: '+req.originalUrl);
		req.session.to = req.originalUrl;
		res.redirect('/login');
	}
	function isLoggedInAdmin(req, res, next) {
        console.log("req.session.user: " + req.session.user);
		console.log("req.session.useradmin: " + req.session.useradmin);
		console.log("req.session.usersuperadmin: " + req.session.usersuperadmin);
		if (req.session.user && (req.session.useradmin || req.session.usersuperadmin))
			return next();
		console.log('requested url: '+req.originalUrl);
		req.session.to = req.originalUrl;
		res.redirect('/search');
	}

    function isLoggedInAdmin(req, res, next) {
        console.log("req.session.user: " + req.session.user);
        if (req.session.user && (req.session.useradmin || req.session.usersuperadmin))
            return next();
        console.log('requested url: '+req.originalUrl);
        req.session.to = req.originalUrl;
        res.redirect('/login');
    }

	function isLoggedInAndNotActive(req, res, next) {
        console.log("req.session.active: " + req.session.active);
		if (req.session.active != null && req.session.active == 0)
			return next();
		res.redirect('/');
	}

	function isAdmin(req, res, next) {
        console.log("req.session.userid: " + req.session.userid);
		if (req.session.userid == 'algo' || req.session.userid == 'amjw'
				|| req.session.userid == 'mkon')
			return next();
		res.redirect('/');
	}

	router.get('/login', function(req, res) {
		var mom = moment().tz(jstz.determine().name()).format;
		console.log("moment.tz(jstz.determine().name()): " + jstz.determine().name());
		var lang = req.query.lang;
		console.log("lang is init from param: " + lang);
		if(lang == null || lang == undefined){
			lang = req.cookies.i18n;
			console.log("lang is from cookies: " + lang);
		}
		if(lang == null || lang == undefined){
			lang = "en";
		}
		console.log("lang is finally: " + lang);
		res.cookie('i18n', lang);
		req.cookies.i18n = lang;
		res.setLocale(req.cookies.i18n);
        globalocale = lang;
        console.log("set globalocale: " + globalocale);

		if (req.session.user) {
			res.redirect('/search');
		} else {
			console.log("in LOGIN: GET LABS");
			var labyokerLabs = new LabyokerLabs('','');
			labyokerLabs.getlabs(function(error, labs) {
				req.session.labs = labs;
				var labYokeGlobal = new LabYokeGlobal(labs);
			labYokeGlobal.getlatestshares(function(error, latest) {
				console.log("in LOGIN: GET LABS now " + req.session.labs);
				console.log("loggin in labs: " + labs);
				console.log("loggin in latest: " + latest);
                labYokeGlobal.getlatestwords(function(error, words) {

				res.render('login', {words:JSON.stringify(words),currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,latestshares:latest, mom: mom, lang:req.cookies.i18n, i18n: res, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, title: 'Login',isLoggedInAdmin: req.session.admin});
				req.session.messages = null;
                });
			});
			});

		}
	});

	router.get('/search', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		console.log("getsearch - i18n: " + req.cookies.i18n);
		res.setLocale(req.cookies.i18n);
		console.log("getsearch - userlang: " + req.session.userlang);
		//if (req.session.user) {
			var labYokeSearch = new LabYokeSearch("",req.session.email,"");
			labYokeSearch.findagents(function(error, results) {			
				if (results != null && results.length > 0){
					res.render('search', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, agentsResults : results, loggedIn : true, title: 'Reagent Search'});
				} else {
					res.render('search', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Reagent Search'});
				}
				req.session.messages = null;
			});
		//} else {
		//	res.redirect('/login');
		//}
	});



	router.get('/orders', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		//if (req.session.user) {
            req.session.orders = 0;
			var labyokerLab = new LabyokerLab(req.session.lab);
		labyokerLab.getLabsInDept(function(error, categories) {
			console.log("load categories in reports : " + categories);
			req.session.categories = categories;
			var labYokerGetOrder = new LabYokerGetOrder(req.session.email, req.session.lab,req.session.labs);
			labYokerGetOrder.getorders(function(error, results) {
				labYokerGetOrder.getLabOrders_2(function(error, results2) {
				if(results != null){
					//req.session.shares = results[2];
					//req.session.orders = 0;
					console.log("orders results: " + results[0]);
					console.log("lab orders results0: " + results2);
					console.log("booster",req.session.savingsText);

					var booster = [];
					var boostercolor = [];
					booster.push(req.session.savingsTextInitial);
					boostercolor.push(req.session.savingsColorInitial);
					var totalorders = 0;
					var totalshares = 0;
					if(results != null && results.length > 0){
						totalorders = results[0].length;
					}
					if(results != null && results.length > 1){
						
						/*totalshares = results[5].filter(function checkOrder(op) {
	console.log("op agent is: " + op.agent);
	console.log("op email is: " + op.email);
	console.log("myemail: " + req.session.email);
    return op.email == req.session.email;
});*/
var t = results[5];
totalshares = t[0].counting;

						console.log("totalshares in booster: " + totalshares);
						//totalshares = totalshares.length;
						console.log("totalshares in booster length: " + totalshares);
					}

					var labs = req.session.labs;
					var labadmin;
					var nonadmin = (res.__("index.orders.nonadmin1", { labadmin: labadmin })).replace(/&lt;/g, '<').replace(/&gt;/g, '>'); //" Email your <a href='mailto:"+labadmin+"'>administrator</a> if needed.";
					console.log("booster labs "+ labs);
					for(var i in labs){
						//var labrow = util.inspect(labs[i], false, null);
						console.log("booster labi "+ labs[i]);
						console.log("booster curent lab is: "+ req.session.lab);
						console.log("booster labiname "+ labs[i].labname);
			       		//var lab = labs[i].lab
			       		if(labs[i].labname == req.session.lab){
			       		labadmin = labs[i].admin;
			       		}
			       		//console.log("lab is: "+ lab);
			       	}
			       	if(req.session.admin == 1){
			       	nonadmin = (res.__("index.orders.nonadmin2")).replace(/&lt;/g, '<').replace(/&gt;/g, '>'); //" You can do so with the <a href='/share#upload'>upload tool</a> to add more reagents under your name."
			       	}
			       	console.log("nonadmin is: " + nonadmin);
					//booster.push("<strong> Self Kudos!</strong> You have ordered a total of <b>" + totalorders + " order(s)</b> and received a total of <b>" + totalshares + " requested share(s)</b>. Keep it up!");
					booster.push((res.__("index.orders.booster1", { totalorders: totalorders, totalshares: totalshares })).replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
					boostercolor.push("success");
					if(totalorders > totalshares){
						//booster.push("<strong> Caution.</strong> You are ordering <b>more</b> than you are sharing. Did you replenish your inventory?" + nonadmin);
						booster.push((res.__("index.orders.booster2")).replace(/&lt;/g, '<').replace(/&gt;/g, '>') + nonadmin);
						boostercolor.push("warning");
					} else if(totalshares > totalorders){
						//booster.push("<strong> Major Achievement!</strong>  You are sharing <b>more</b> than you are ordering. Way to contribute to your lab's savings!");
						booster.push((res.__("index.orders.booster3")).replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
						boostercolor.push("success");
					} else if(totalshares == totalorders){
						//booster.push("<strong> Strong and Steady!</strong> You are perfectly <b>balanced</b>! You are sharing as many reagents as you are ordering. Way to go!");
						booster.push((res.__("index.orders.booster4")).replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
						boostercolor.push("success");
					}
					var b = Math.floor((Math.random() * booster.length-1) + 1);
					console.log("orders - b radomized: " + b);
					console.log("orders - b length radomized: " + booster.length);
					req.session.savingsText = booster[b];
					req.session.savingsColor = boostercolor[b];
					//console.log("lab orders results1: " + results2[1]);				
					//res.render('orders', {test: results[3], laborders: results2[0],lab1orders: results2[1], ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Orders', loggedIn : true, orderresults: results[0], report_sharesbycategory: results[1]});
					res.render('orders', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,booster:req.session.savingsText, boostercolor:req.session.savingsColor,currentlabname:req.session.lab, categories: req.session.categories, test: results[3], laborders: results2, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title:'Orders', loggedIn : true, orderresults: results[0], report_sharesbycategory: results[1], report_ordersbycategory: results[4]});
				}
			});
				});
				});
		//} else {
		//	res.redirect('/login');
		//}
	});

	router.post('/orders', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		//if (req.session.user) {
			var agent = req.body.agentform;
			var lab = req.body.labform;
			var vendor = req.body.vendorform;
			var catalognumber = req.body.catalogform;
			var email = req.body.emailform;
			var location = req.body.locationform;
			var reqemail = req.session.email;
			var reqcategory = req.body.categoryform;
			var quantity = req.body.qtyform;
			var userlang = req.session.userlang;
			var ownerlang = req.body.langform;
            var labadmin = req.session.labadmin;
			var labYokerorder = new LabYokerOrder(lab, agent, vendor, catalognumber,email,location,reqemail,quantity, req.session.lab,res,userlang,ownerlang,labadmin);
			labYokerorder.order(function(error, results) {
				if(results != null && results=="successfulOrder"){
					console.log("ordering agentform: " + agent);
					console.log("ordering location: " + location);
					//console.log("ordering reqcategory: " + reqcategory);
					console.log("booster",req.session.savingsText);
				
					res.render('search', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,booster:req.session.savingsText, boostercolor:req.session.savingsColor, currentlabname:req.session.lab, categories: req.session.categories, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title:'Search',loggedIn : true, order_location: location, order_agent: agent, order_vendor: vendor, order_catalog: catalognumber, email: email});
					req.session.messages = null;
				}
			});
		//} else {
		//	res.redirect('/login');
		//}
	});

    router.post('/admincancelshare', isLoggedIn, function(req, res) {
        if(req.cookies.i18n == null || req.cookies.i18n == undefined){
            req.cookies.i18n = "en";
        }
        globalocale = req.cookies.i18n;
        res.setLocale(req.cookies.i18n);
        //if (req.session.user) {
            var agent = req.body.agent;
            var lab = req.body.lab;
            var vendor = req.body.vendor;
            var catalognumber = req.body.catalognumber;
            var admintype = req.body.adminType; 
            var table = req.body.table;
            var email = req.body.email;
            var requestor = req.body.requestoremail;
            var checked = req.body.cancel;
            var pos = req.body.pos;
            var pos2 = req.body.pos2;
            var userlang = req.cookies.i18n;
            var date = moment(req.body.date).add(1, 'day').tz("America/New_York").format(
                'MM-DD-YYYY');
            var datenow = moment(new Date).tz("America/New_York").format(
                'MM-DD-YYYY');
            if(checked != null)
                checked = 0;
            if(checked == undefined)
                checked = 1;
            console.log("date: " + date);
            console.log("admintype: " + admintype);
            console.log("laab: " + lab);
            console.log("agent: " + agent);
            console.log("vendor: " + vendor);
            console.log("catalognumber: " + catalognumber);
            console.log("checked: " + checked);
            console.log("table: " + table);
            console.log("email: " + email);
            console.log("userlang: " + userlang);
            console.log("requestoremail: " + requestor);
            console.log("pos: " + pos);
            console.log("pos2: " + pos2);
            var labYokechange = new LabYokerChangeShare(table,agent, vendor, catalognumber,email,requestor,checked,datenow,date, lab, res,userlang,req.session.labs);
            labYokechange.cancelShare(function(error, resultscancel) {
                if(resultscancel != null && resultscancel.length > 0){


        var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept,req.session.labadmin,req.session.oninsuff);
        labYokeAgents.findallsharesadmins(function(error, results) {
            //req.session.orders = results[2];
            ///req.session.myshares = results[1];
            //req.session.report_sharesbycategory = results[1];

            ///req.session.mysharesrequest = results[4];
            ///req.session.report_data = results[2];
            ///req.session.meadminof = results[0];

            //req.session.test = results[4];
            //req.session.report_venn = results[5];
            //req.session.shares = 0;
            //console.log("test ? " + results[3]);
            res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,meadminof:req.session.meadminof,pos:pos,pos2:pos2,report_data: results[2],admintype:admintype,lang:req.cookies.i18n, i18n:res, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: results[1], mysharesrequest: results[4], loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
            req.session.messages = null;
        });

                    //res.redirect('/admins');         
                    //res.render('share', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Shares',loggedIn : true});
                    req.session.messages = null;
                }
            });
        //} else {
        //    res.redirect('/login');
        //}
    });

	router.post('/cancelshare', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		//if (req.session.user) {
			var agent = req.body.agent;
			var lab = req.body.lab;
			var vendor = req.body.vendor;
			var catalognumber = req.body.catalognumber;
			var table = req.body.table;
			var email = req.body.email;
			var requestor = req.body.requestoremail;
			var checked = req.body.cancel;
            var pos = req.body.pos;
            var pos2 = req.body.pos2;
			var userlang = req.cookies.i18n;
			var date = moment(req.body.date).add(1, 'day').tz("America/New_York").format(
				'MM-DD-YYYY');
			var datenow = moment(new Date).tz("America/New_York").format(
				'MM-DD-YYYY');
			if(checked != null)
				checked = 0;
			if(checked == undefined)
				checked = 1;
			console.log("date: " + date);
			console.log("laab: " + lab);
			console.log("agent: " + agent);
			console.log("vendor: " + vendor);
			console.log("catalognumber: " + catalognumber);
			console.log("checked: " + checked);
			console.log("table: " + table);
			console.log("email: " + email);
            console.log("userlang: " + userlang);
			console.log("requestoremail: " + requestor);
            console.log("pos: " + pos);
            console.log("pos2: " + pos2);
			var labYokechange = new LabYokerChangeShare(table,agent, vendor, catalognumber,email,requestor,checked,datenow,date, lab, res,userlang,req.session.labs);
			labYokechange.cancelShare(function(error, results) {
				if(results != null && results.length > 0){
					//res.redirect('/share');
                    if(pos!=null && pos!=""){
                        res.redirect('/shares?pos=' + pos);
                    } else if(pos2!=null && pos2!=""){
                        res.redirect('/shares?pos2=' + pos2);
                    } else{
                        res.redirect('/shares');
                    }
					//res.render('share', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Shares',loggedIn : true});
					req.session.messages = null;
				}
			});
		//} else {
		//	res.redirect('/login');
		//}
	});

    router.post('/fulfillshare', isLoggedInAdmin, function(req, res) {
        if(req.cookies.i18n == null || req.cookies.i18n == undefined){
            req.cookies.i18n = "en";
        }
        globalocale = req.cookies.i18n;
        res.setLocale(req.cookies.i18n);
        //if (req.session.user) {
            var agent = req.body.agent;
            var lab = req.body.lab;
            var admintype = req.body.adminType;   
            var vendor = req.body.vendor;
            var catalognumber = req.body.catalognumber;
            var table = req.body.table;
            var email = req.body.owneremail;
            var requestor = req.body.requestoremail;
            var checked = req.body.fulfill;
            var pos = req.body.pos;
            var userlang = req.cookies.i18n;
            var date = moment(req.body.date).add(1, 'day').tz("America/New_York").format(
                'MM-DD-YYYY');
            var datenow = moment(new Date).tz("America/New_York").format(
                'MM-DD-YYYY');
            if(checked != null)
                checked = 0;
            if(checked == undefined)
                checked = 1;
            console.log("date: " + date);
            console.log("admintype: " + admintype);
            console.log("laab: " + lab);
            console.log("agent: " + agent);
            console.log("vendor: " + vendor);
            console.log("catalognumber: " + catalognumber);
            console.log("checked: " + checked);
            console.log("table: " + table);
            console.log("email: " + email);
            console.log("userlang: " + userlang);
            console.log("requestoremail: " + requestor);
            console.log("pos: " + pos);
            var labYokechange = new LabYokerChangeShare(table,agent, vendor, catalognumber,email,requestor,checked,datenow,date, lab, res,userlang,req.session.labs);
            labYokechange.fulfillShare(function(error, resultsfilled) {
                if(resultsfilled != null && resultsfilled.length > 0){


        var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept,req.session.labadmin,req.session.oninsuff);
        labYokeAgents.findallsharesadmins(function(error, results) {
            //req.session.orders = results[2];
            ///req.session.myshares = results[1];
            //req.session.report_sharesbycategory = results[1];

            ///req.session.mysharesrequest = results[4];
            ///req.session.report_data = results[2];
            ///req.session.meadminof = results[0];

            //req.session.test = results[4];
            //req.session.report_venn = results[5];
            //req.session.shares = 0;
            //console.log("test ? " + results[3]);
            res.render('admins', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,meadminof:req.session.meadminof,pos:pos,report_data: results[2],admintype:admintype,lang:req.cookies.i18n, i18n:res, currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: results[1], mysharesrequest: results[4], loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Admins'});
            req.session.messages = null;
        });
                    //res.redirect('/admins');         
                    //res.render('share', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Shares',loggedIn : true});
                    req.session.messages = null;
                }
            });
        //} else {
         //   res.redirect('/login');
        //}
    });


	router.get('/reports', isLoggedInAdmin, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);

		var datefrom = "01-01-2016";
		var dateto = "01-01-2017";
		//var category = req.body.reportCategory;
		console.log("reportSomething intro");
		var labYokereporter = new LabYokeReporterShares(datefrom, dateto, req.session.lab, req.session.email, req.session.labs,res);
		labYokereporter.reportSharesIntro(function(error, results) {
		

		var labyokerLab = new LabyokerLab(req.session.lab);
        var res0, res1;
        res0 = results[0];
        if(results !=null && results.length > 0){
            res0 = results[0];
            //console.log("resultsMoneyIntro: " + res0);
        }
        if(results !=null && results.length > 1){
            res1 = JSON.stringify(results[1]);
            console.log("dataintro: " + JSON.stringify(res1));
        }
        
        

		labyokerLab.getLabsInDept(function(error, categories) {
			console.log("load labs in dept in reports : " + categories);
			req.session.categories = categories;
			if(req.session.labs == undefined){
				var labyokerLabs = new LabyokerLabs('','');
				labyokerLabs.getlabs(function(error, labs) {
					req.session.labs = labs;
					console.log("load labs in reports : " + labs);
					res.render('reports', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, resultsMoneyIntro:res0,dataIntro:res1,dept: req.session.dept, categories: categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Reports', isLoggedInAdmin: req.session.admin});
					req.session.messages = null;
				});
			} else {
				res.render('reports', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, resultsMoneyIntro:res0,dataIntro:res1, dept: req.session.dept, categories: categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Reports', isLoggedInAdmin: req.session.admin});
				req.session.messages = null;
			}
		});

});
	});

	router.post('/reportShares', isLoggedInAdmin, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		var datefrom = req.body.reportDateFrom;
		var dateto = req.body.reportDateTo;
		var category = req.body.reportCategory;
		console.log("reportSomething " + req.body.reportDateFrom);

        var verifyfrom = Date.parse(datefrom);
        var verifyto = Date.parse(dateto);
        var iserror = true;

        if(verifyfrom >= 0 && verifyto >= 0){
            iserror = false;
        }
        var res0, res1;
        if(!iserror){
    		var labYokereporter = new LabYokeReporterShares(datefrom, dateto, req.session.lab, req.session.email, req.session.labs,res);
    		labYokereporter.reportShares(function(error, results) {
                labYokereporter.reportSharesIntro(function(error, resultsintro) {
                
                res0 = resultsintro[0];
                if(resultsintro !=null && resultsintro.length > 0){
                    res0 = resultsintro[0];
                    console.log("resultsMoneyIntro: " + res0);
                }
                if(resultsintro !=null && resultsintro.length > 1){
                    res1 = JSON.stringify(resultsintro[1]);
                    console.log("dataintro: " + res1);
                }
                
                


    			if(results != null){
    				console.log("res " + results);
    				if(results != ""){
    					res.render('reports', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,resultsMoneyIntro:res0,dataIntro:res1,section: "shares", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromShares: datefrom, datetoShares: dateto, title:'Reports',loggedIn : true, resultsShares: results[0], dataShares: JSON.stringify(results[1]), isLoggedInAdmin: req.session.admin, addMessageShares: "success"});
    				} else {
    					res.render('reports', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,resultsMoneyIntro:res0,dataIntro:res1,section: "shares", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromShares: datefrom, datetoShares: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageShares: "failure"});
    				}
    				req.session.messages = null;
    			}
            });
    		});
        } else {
            res.render('reports', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,resultsMoneyIntro:res0,dataIntro:res1,section: "shares", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromShares: datefrom, datetoShares: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageShares: "wrongdate"});
        }
	});

	router.post('/reportMoney', isLoggedInAdmin, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		var datefrom = req.body.reportDateFromMoney;
		var dateto = req.body.reportDateToMoney;
		var agent = req.body.reportAgentMoney;
		var vendor = req.body.reportVendorMoney;
		var catalognumber = req.body.reportCatalogMoney;
		var lab = req.body.reportLabMoney;
		 

		console.log("reportMoney datefrom: " + datefrom);
		console.log("reportMoney dateto: " + dateto);
		console.log("reportMoney agent: " + agent);
		console.log("reportMoney vendor: " + vendor);
		console.log("reportMoney catalognumber: " + catalognumber);
		console.log("reportMoney lab: " + lab);

        var verifyfrom = Date.parse(datefrom);
        var verifyto = Date.parse(dateto);
        var iserror = true;

        if(verifyfrom >= 0 && verifyto >= 0){
            iserror = false;
        }
        var res0, res1;
        if(!iserror){
		var labYokereporterSavings = new LabYokeReporterSavings(datefrom,dateto,agent,vendor,catalognumber,lab, req.session.lab,req.session.labs,res);
		labYokereporterSavings.reportMoney(function(error, results) {

        var labYokereporter = new LabYokeReporterShares(datefrom, dateto, req.session.lab, req.session.email, req.session.labs,res);
            labYokereporter.reportSharesIntro(function(error, resultsintro) {
                
                res0 = resultsintro[0];
                console.log("reportSharesIntro lenght: " + resultsintro.length);
                if(resultsintro !=null && resultsintro.length > 0){
                    res0 = resultsintro[0];
                    console.log("resultsMoneyIntro: " + res0);
                }
                if(resultsintro !=null && resultsintro.length > 1){
                    res1 = JSON.stringify(resultsintro[1]);
                    console.log("dataintro: " + res1);
                }
                
                

			if(results != null){
				console.log("res " + results);
				if(results!=undefined && results != ""){
					console.log("successful money report");
					res.render('reports', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,resultsMoneyIntro:res0,dataIntro:res1,dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromMoney: datefrom, datetoMoney: dateto, title:'Reports',loggedIn : true, resultsMoney: results[0], dataMoney: JSON.stringify(results[1]), isLoggedInAdmin: req.session.admin, addMessageMoney: "success", section: "money"});
				} else {
					console.log("failed money report");
					res.render('reports', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,resultsMoneyIntro:res0,dataIntro:res1,dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromMoney: datefrom, datetoMoney: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageMoney: "failure", section: "money"});
				}
				req.session.messages = null;
			}
		});
        });

        } else {
            res.render('reports', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,resultsMoneyIntro:res0,dataIntro:res1,dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromMoney: datefrom, datetoMoney: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageMoney: "wrongdate", section: "money"});
        }
	});

	router.post('/reportInsuff', isLoggedInAdmin, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		var datefrom = undefined;
		var dateto = undefined;
		var agent = req.body.reportAgentInsuff;
		var vendor = req.body.reportVendorInsuff;
		var catalognumber = req.body.reportCatalogInsuff;
		var lab = req.body.reportLabInsuff;

		console.log("reportInsuff datefrom: " + datefrom);
		console.log("reportInsuff dateto: " + dateto);
		console.log("reportInsuff agent: " + agent);
		console.log("reportInsuff vendor: " + vendor);
		console.log("reportInsuff catalognumber: " + catalognumber);
		console.log("reportInsuff lab: " + lab);

        var verifyfrom = Date.parse(datefrom);
        var verifyto = Date.parse(dateto);
        var iserror = true;

        if(verifyfrom >= 0 && verifyto >= 0){
            //iserror = false;
        }
        //if(!iserror){
		var labYokereporterSavings = new LabYokeReporterSavings(datefrom,dateto,agent,vendor,catalognumber,lab, req.session.lab,req.session.labs,res);
		labYokereporterSavings.reportInsuff(function(error, results) {

        var labYokereporter = new LabYokeReporterShares(datefrom, dateto, req.session.lab, req.session.email, req.session.labs,res);
            labYokereporter.reportSharesIntro(function(error, resultsintro) {
                var res0, res1;
                res0 = resultsintro[0];
                console.log("resultsintro: " + resultsintro.length);
                if(resultsintro !=null && resultsintro.length > 0){
                    res0 = resultsintro[0];
                    console.log("resultsMoneyIntro: " + res0);
                }
                if(resultsintro !=null && resultsintro.length > 1){
                    res1 = JSON.stringify(resultsintro[1]);
                    console.log("dataintro: " + res1);
                }
                
                
			if(results != null){
				console.log("res " + results);
				if(results!=null && results != ""){
                    console.log("datainsuff res[1] " + JSON.stringify(results[1][0]));
					res.render('reports', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,resultsMoneyIntro:res0,dataIntro:res1,section: "insuff", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, title:'Reports',loggedIn : true, resultsInsuff: results[0], labinsuff:lab, dataInsuff: JSON.stringify(results[1]), isLoggedInAdmin: req.session.admin, addMessageInsuff: "success"});
				} else {
					res.render('reports', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,resultsMoneyIntro:res0,dataIntro:res1,section: "insuff", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, title:'Reports',loggedIn : true, labinsuff:lab, isLoggedInAdmin: req.session.admin, addMessageInsuff: "failure"});
				}
				req.session.messages = null;
			}
		});
        });
        //} else {
            //res.render('reports', {lang:req.cookies.i18n, i18n:res,section: "insuff", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageInsuff: "wrongdate"});
        //}
	});

	router.post('/changeDetails', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		var col = req.body.column;
		var val = req.body.valuedetail.replace("'","");
		var email = req.body.formemail;
		console.log("changeDetails col: " + col);
		console.log("changeDetails val: " + val);
		console.log("changeDetails email: " + email);
        if(col == "oninsuff"){
            console.log("change session for oninsuff to: " +  val);
            req.session.oninsuff = val;
        }
		var labYokedetails = new LabyokerUserDetails(col, val, email,req.session.user, req.session.surname,res);
		labYokedetails.changeDetails(function(error, results) {
			if(results){
				if(col == 'name'){
					req.session.user = val;
				}
				if(col == 'surname'){
					req.session.surname = val;
				}
				console.log("res changeDetails " + results);


		var labyokerTeam = new LabyokerTeam(req.session.lab);
		labyokerTeam.getTeam(function(error, team) {
		if(req.session.labs == undefined){
			var labyokerLabs = new LabyokerLabs('','');
			labyokerLabs.getlabs(function(error, labs) {
				req.session.labs = labs;
				console.log("load labs in account : " + labs);
				var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs,req.session.labadmin,req.session.oninsuff);
				labYokeAgents.getLabyoker(function(error, userresults) {
				res.render('account', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,localeslist:localeslist,lang:req.cookies.i18n, i18n:res, userDetails: userresults, labname: req.session.lab, team:team, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, title:'Account',loggedIn : true, resultsAccount: results, isLoggedInAdmin: req.session.admin});
					req.session.messages = null;
				});
			});
		} else {
			var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs,req.session.labadmin, req.session.oninsuff);
			labYokeAgents.getLabyoker(function(error, userresults) {
				res.render('account', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,localeslist:localeslist,lang:req.cookies.i18n, i18n:res, userDetails: userresults, labname: req.session.lab, team:team, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, title:'Account',loggedIn : true, resultsAccount: results, isLoggedInAdmin: req.session.admin});
				req.session.messages = null;
			});
		}
		});



				//res.render('account', {lang:req.cookies.i18n, i18n:res, userDetails: userresults, labname: req.session.lab, team:team, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, title:'Account',loggedIn : true, resultsAccount: results, isLoggedInAdmin: req.session.admin});
				req.session.messages = null;
			}
		});
	});

	router.post('/reportOrders', isLoggedInAdmin, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		var datefrom = req.body.reportDateFromOrders;
		var dateto = req.body.reportDateToOrders;
		var lab = req.body.reportLabOrders;
		var category = req.body.reportCategoryOrders;
		console.log("reportOrders reportDateFromOrders: " + req.body.reportDateFromOrders);
		console.log("reportOrders lab: " + lab);
		console.log("reportOrders category: " + category);

        var verifyfrom = Date.parse(datefrom);
        var verifyto = Date.parse(dateto);
        var iserror = true;

        if(verifyfrom >= 0 && verifyto >= 0){
            iserror = false;
        }
        var res0, res1;
        if(!iserror){
		var labYokereporter = new LabYokeReporterOrders(datefrom, dateto, lab, req.session.labs, req.session.lab, res);
		labYokereporter.reportOrders(function(error, results) {
        var labYokereporter = new LabYokeReporterShares(datefrom, dateto, req.session.lab, req.session.email, req.session.labs,res);
            labYokereporter.reportSharesIntro(function(error, resultsintro) {
                
                console.log("resultsOrdersIntro: " + resultsintro.length);
                res0 = resultsintro[0];
                if(resultsintro !=null && resultsintro.length > 0){
                    res0 = resultsintro[0];
                    console.log("resultsOrdersIntro: " + res0);
                }
                if(resultsintro !=null && resultsintro.length > 1){
                    res1 = JSON.stringify(resultsintro[1]);
                    console.log("dataintro: " + res1);
                }
                
                
			if(results != null){
				console.log("res " + results);
				if(results != ""){
					res.render('reports', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,resultsMoneyIntro:res0,dataIntro:res1,section: "orders", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromOrders: datefrom, datetoOrders: dateto, title:'Reports',loggedIn : true, resultsOrders: results[0], dataOrders: JSON.stringify(results[1]), isLoggedInAdmin: req.session.admin, addMessageOrders: "success"});
				} else {
					res.render('reports', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,resultsMoneyIntro:res0,dataIntro:res1,section: "orders", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromOrders: datefrom, datetoOrders: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageOrders: "failure"});
				}
				req.session.messages = null;
			}
		});
        });
        } else {
            res.render('reports', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,resultsMoneyIntro:res0,dataIntro:res1,section: "orders", dept: req.session.dept, categories: req.session.categories, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, datefromOrders: datefrom, datetoOrders: dateto, title:'Reports',loggedIn : true, isLoggedInAdmin: req.session.admin, addMessageOrders: "wrongdate"});            
        }
	});

	router.get('/play', function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		res.render('play', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,ordersnum: req.session.orders, sharesnum: req.session.shares, title: 'Play',labyoker : req.session.user, labyokersurname : req.session.surname});
		req.session.messages = null;
	});

	router.get('/pop', function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
		res.setLocale(req.cookies.i18n);
			console.log("in pop: GET LABS");
			var labyokerLabs = new LabyokerLabs('','');
			labyokerLabs.getlabs(function(error, labs) {
				req.session.labs = labs;
				var labYokeGlobal = new LabYokeGlobal(labs);
				labYokeGlobal.getlatestshares(function(error, latest) {
					console.log("in pop: GET LABS now " + req.session.labs);
					console.log("pop in labs: " + labs);
					console.log("pop in latest: " + latest);
					res.render('pop', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,latestshares:latest,lang:req.cookies.i18n, i18n:res, title: 'Pop'});
				});
			});
		req.session.messages = null;
	});

	router.get('/shares/:doing', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		var doing = req.params.doing;
		console.log("do: " + doing);
		res.setLocale(req.cookies.i18n);
		var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept,req.session.labadmin,req.session.oninsuff);
		labYokeAgents.findmyshares(function(error, results) {
			//req.session.orders = results[2];

			///req.session.myshares = results[0];
			///req.session.report_sharesbycategory = results[1];
			///req.session.mysharesrequest = results[3];

			//req.session.test = results[4];
			//req.session.report_venn = results[5];
			//req.session.shares = 0;
			console.log("test ? " + results[3]);
			res.render('share', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,doing:"upload",lang:req.cookies.i18n, i18n:res,report_venn: results[5], test: results[4], currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: results[0], mysharesrequest: results[3], report_sharesbycategory: results[1], loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Share'});
			req.session.messages = null;
		});
	});

	router.get('/shares', isLoggedIn, function(req, res) {
        console.log("shares req.session.user0: " + req.session.user);
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs, req.session.dept,req.session.labadmin,req.session.oninsuff);
		labYokeAgents.findmyshares(function(error, results) {
			//req.session.orders = results[2];

			///req.session.myshares = results[0];
			///req.session.report_sharesbycategory = results[1];
			///req.session.mysharesrequest = results[3];

			//req.session.test = results[4];
			//req.session.report_venn = results[5];
			req.session.shares = 0;
			console.log("test ? " + results[3]);
            console.log("shares req.session.user1: " + req.session.user);
			res.render('share', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res,report_venn: results[5], test: results[4], currentlabname: req.session.lab, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, myshares: results[0], mysharesrequest: results[3], report_sharesbycategory: results[1], loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Share'});
			req.session.messages = null;
		});
	});

	router.get('/account', isLoggedIn, function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		console.log("inside accounnt: " + req.session.email);
		console.log("account labs: " + req.session.labs);
		console.log("account lab: " + req.session.lab);
        console.log("locales: " + localeslist);
        for(var loc in localeslist){
        var loca = localeslist[loc];
        console.log("loc: " + loca);
        }
		var labyokerTeam = new LabyokerTeam(req.session.lab);
		labyokerTeam.getTeam(function(error, team) {
		if(req.session.labs == undefined){
			var labyokerLabs = new LabyokerLabs('','');
			labyokerLabs.getlabs(function(error, labs) {
				req.session.labs = labs;
				console.log("load labs in account : " + labs);
				var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs,req.session.labadmin,req.session.oninsuff);
				labYokeAgents.getLabyoker(function(error, results) {
					res.render('account', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,localeslist:localeslist,lang:req.cookies.i18n, i18n:res, dept: req.session.dept, labname: req.session.lab, team:team, labs: req.session.labs, userDetails: results, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Account'});
					req.session.messages = null;
				});
			});
		} else {
			var labYokeAgents = new LabYokeAgents(req.session.email, req.session.lab, req.session.labs,req.session.labadmin,req.session.oninsuff);
			labYokeAgents.getLabyoker(function(error, results) {
				res.render('account', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,localeslist:localeslist,lang:req.cookies.i18n, i18n:res, dept: req.session.dept, labname: req.session.lab, team:team, labs: req.session.labs, userDetails: results, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Account'});
				req.session.messages = null;
			});
		}
		});
	});
	

	router.get('/forgot', function(req, res) {
		var lang = req.query.lang;
		console.log("lang is init from param: " + lang);
		if(req.cookies.i18n != undefined && req.cookies.i18n!=null){
				lang = req.cookies.i18n;
		} else if(lang == null || lang == undefined){
			lang = "en";
		}
        globalocale = lang;
		req.cookies.i18n = lang;
		res.setLocale(lang);
		console.log("lang is finally: " + lang);
		res.cookie('i18n', lang);
		req.cookies.i18n = lang;
		res.setLocale(req.cookies.i18n);
		res.render('forgot', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Forgot Password'});
		req.session.messages = null;
	});

	router.post('/forgot', function(req, res) {
			var lang = req.query.lang;
			console.log("lang is forgot user: " + lang);
			if(req.cookies.i18n != undefined && req.cookies.i18n!=null){
				lang = req.cookies.i18n;
			} else if(lang == null || lang == undefined){
				lang = "en";
			}
            globalocale = lang;
			res.setLocale(lang);
			var forgotuser = req.body.forgotuser;
			if (forgotuser != null && forgotuser.length > 0){
				var dateStripped = moment(new Date).tz("America/New_York").format(
				'MM-DD-YYYY');
				console.log("dateStripped2: " + dateStripped);
				var labyoker = new Labyoker(forgotuser,dateStripped,res,req.session.userlang);
				labyoker.requestChangePassword(function(error, done) {
					console.log("done: " + (done != null && done.length > 0 && done == 'alreadySent'));
					console.log("done2: " + (done != null && done == 'alreadySent'));
					if (done != null && done.length > 0 && done != 'alreadySent') {
						res.render('forgot', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, userfound : forgotuser, title: 'Forgot Password'});
					} else if(done != null && done.length > 0 && done == 'alreadySent') {
						res.render(
							'forgot',
							{
								currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Forgot Password', message : res.__("index.forgot.message1"), usernotfound : true, noforgotform: true
							});
					} else {
						res.render(
							'forgot',
							{
								currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user,  labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Forgot Password', message : res.__("index.forgot.message2"), usernotfound : true
							});
					}
				});
			} else {
				res.render(
					'forgot',
					{
						currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user,  labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Forgot Password', message : res.__("index.forgot.message3"), usernotfound : true
					});

			}
			//req.session.messages = null;
	});

	router.get('/register', function(req, res) {
		var lang = req.query.lang;
		console.log("lang is init from param: " + lang);
		if(lang == null || lang == undefined){
			lang = req.cookies.i18n;
			console.log("lang is from cookies: " + lang);
		}
		if(lang == null || lang == undefined){
			lang = "en";
		}
        globalocale = lang;
		console.log("lang is finally: " + lang);
		res.cookie('i18n', lang);
		req.cookies.i18n = lang;
		res.setLocale(req.cookies.i18n);
			console.log("register labs: " + req.session.labs);
			if(req.session.labs == undefined){
				var labyokerLabs = new LabyokerLabs('','');
				labyokerLabs.getlabs(function(error, labs) {
					req.session.labs = labs;
					console.log("load labs in register : " + labs);
					res.render('register', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, labs: req.session.labs, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Register'});
					req.session.messages = null;
					req.body.reglab = null;
				});
			} else {
				res.render('register', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,lang:req.cookies.i18n, i18n:res, ordersnum: req.session.orders, labs: req.session.labs, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Register'});
				req.session.messages = null;
				req.body.reglab = null;
			}

	});

    router.post('/findSharesNum', function(req, res) {
        console.log("email: " + req.body.email);
        if(req.session.shares != null && req.session.shares != undefined){
            var init = new LabyokerInit(req.body.email, req.body.lab);
            init.initialShares(function(error, resultsShares) {
                console.log("inside init shares " + resultsShares);
                console.log("initshares is " + initial_sharesnum);
                
                console.log("checking is " + req.cookies.is);
                var cookie = req.cookies.sh;
                console.log("cookie is " + cookie);
                if (resultsShares != null) {
                    
                    shares = resultsShares;
                    if(shares > initial_sharesnum) {
                        req.session.shares = shares;
                        //, { maxAge: 900000, httpOnly: true }
                        res.cookie('sh',shares);
                        console.log('cookie sharesnum created successfully');
                        
                    }
                    res.end();
                }
            });
        }
    });

	router.get('/reportShares', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/reportMoney', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/reportInsuff', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/reportOrders', function(req, res) {
		res.redirect('/reports');
	});

	router.get('/changeDetails', function(req, res) {
		res.redirect('/account');
	});

	router.get('/cancelshare', function(req, res) {
		res.redirect('/shares');
	});

    router.get('/admincancelshare', function(req, res) {
        res.redirect('/admins');
    });

    router.get('/fulfillshare', function(req, res) {
        res.redirect('/admins');
    });

	router.get('/searchCatalog', function(req, res) {
		res.redirect('/search');
	});

	router.post('/register', function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		var rendered = false;
		var lab = req.body.reglab;
		var user = req.body.reguser;
		var user_pwd = req.body.regpass;
		var user_verpwd = req.body.regverpass;
		var user_name = req.body.regfirstname;
		var user_surname = req.body.reglastname;
		var user_email = req.body.regemail;
		var user_tel = req.body.regtel;
		var userlang = req.cookies.i18n;

		if(req.session.labs == undefined){
			res.redirect('/register');
		}
		/*const util = require('util');
		var labs = req.session.labs;
		for(var i in labs){
			var labrow = util.inspect(labs[i], false, null);
       		//var lab = labs[i].lab
       		console.log("i is: "+ i);
       		console.log("lab util: " + labrow);
       		console.log("labrow lab util: " + labrow.labname);
       		//console.log("lab is: "+ lab);
       	}*/


		if (user && user_name && user_pwd && lab && user_surname && user_email && user_tel) {
			console.log("second section processing...");
			console.log("user: " + user);
			console.log("user_pwd: " + user_pwd);
			console.log("user_verpwd: " + user_verpwd);
			console.log("lab: " + lab);
			console.log("user_name: " + user_name);
			console.log("user_surname: " + user_surname);
			console.log("user_email: " + user_email);
			console.log("user_tel: " + user_tel);
			console.log("user_tel: " + userlang);
			var labyokerRegister = new LabyokerRegister(user,user_pwd,lab,user_name,user_surname,user_email,user_tel,res,userlang);
			/*var regfirstname = req.body.regfirstname;
			console.log("regfirstname entered " + regfirstname);
			if (regfirstname != null && regfirstname.length > 0){
				req.session.user = regfirstname;
				res.render('register', {regsuccess : regfirstname, loggedIn : true});
			} else {
				res.render('register', {});
			}*/
			labyokerRegister.register(function(error, done) {
				console.log("done: " + done);
				if(done != null && done.length > 0 && done == 'idalreadyInUse') {
						console.log("status = idalreadyInUse");
						rendered = true;
						res.render('register', {currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n, i18n:res, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Register', message : res.__("index.register.message11")});
				} else if(done != null && done.length > 0 && done == 'firstsection') {
					console.log("status = firstsection1");
					rendered = true;
					res.render(
						'register',
						{
							currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n,
							i18n: res,
							ordersnum: req.session.orders,
							sharesnum: req.session.shares,
							labentered : true,
							firstname: req.session.firstname,
							lastname: req.session.lastname,
							email: req.session.email,
							tel: req.session.tel,
							title: 'Register',
							isLoggedInAdmin: req.session.admin,
							labyoker : req.session.user,
                            labyokersurname : req.session.surname,
							labs: req.session.labs
						});
				} else if (done != null && done.length > 0 && done != 'success') {
					console.log("status = status1");
					res.render('register', {currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n, i18n:res, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname,isLoggedInAdmin: req.session.admin, title: 'Register', message : res.__("index.register.message3")});
				} else if(done != null && done.length > 0 && done == 'success') {
					console.log("status = success1");
					rendered = true;
					console.log("successfully registered " + user_name);
					res.render(
						'register',
						{
							currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n,
							i18n:res,
							ordersnum: req.session.orders,
							sharesnum: req.session.shares, 
							regsuccess : user_name,
							labentered : false,
							title: 'Register',
							isLoggedInAdmin: req.session.admin,
							labyoker : req.session.user,
                            labyokersurname : req.session.surname,
							labs: req.session.labs
						});
				} else {
					res.render(
						'register',
						{
							currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n,
							i18n:res,
							ordersnum: req.session.orders,
							sharesnum: req.session.shares,
							message : res.__("index.register.message2"),
							title: 'Register',
							isLoggedInAdmin: req.session.admin,
							labyoker : req.session.user,
                            labyokersurname : req.session.surname,
							labs: req.session.labs
						});
				}
			});
			rendered = true;
		} else if (user_name && user_surname && user_email && user_tel) {
				console.log("first section processing...");
				var labyokerRegister = new LabyokerRegister(null,null,null,user_name,user_surname,user_email,user_tel,res,userlang);
				req.session.firstname = user_name;
				req.session.lastname = user_surname;
				req.session.email = user_email;
                globalemail = req.session.email;
				req.session.tel = user_tel;
				labyokerRegister.register(function(error, done) {

					if(done != null && done.length > 0 && done == 'alreadyInUse') {
						console.log("status = alreadyInUse");
						rendered = true;
						res.render('register', {currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n, i18n:res, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname,isLoggedInAdmin: req.session.admin, title: 'Register', message : res.__("index.register.message1")});
					} else if(done != null && done.length > 0 && done == 'firstsection') {
						console.log("status = firstsection");
						rendered = true;
						res.render(
							'register',
							{
								currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n,
								i18n:res,
								ordersnum: req.session.orders,
								sharesnum: req.session.shares, 
								labentered : true,
								firstname: req.session.firstname,
								lastname: req.session.lastname,
								email: req.session.email,
								tel: req.session.tel,
								title: 'Register',
								isLoggedInAdmin: req.session.admin,
								labyoker : req.session.user,
                                labyokersurname : req.session.surname,
								labs: req.session.labs
							});
					} else if(done != null && done.length > 0 && done != 'success') {
						console.log("status = not successful");
						rendered = true;
						res.render('register', {currente:req.session.email,currentl:req.session.lab,i18n:res, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user,labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Register', message : res.__("index.register.message3")});
					} else if(done != null && done.length > 0 && done == 'success') {
						console.log("status = success");
						rendered = true;
						res.render(
							'register',
							{
								currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n,
								i18n:res,
								ordersnum: req.session.orders,
								sharesnum: req.session.shares, 
								regsuccess : user_name,
								labentered: false,
								title: 'Register',
								isLoggedInAdmin: req.session.admin,
								labyoker : req.session.user,
                                labyokersurname : req.session.surname,
								labs: req.session.labs
							});
					} else {
						console.log("status = something else happened");
						rendered = true;
						res.render(
							'register',
							{
								currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n,
								i18n: res,
								ordersnum: req.session.orders,
								sharesnum: req.session.shares, 
								message : res.__("index.register.message2"),
								title: 'Register',
								isLoggedInAdmin: req.session.admin,
								labyoker : req.session.user,
                                labyokersurname : req.session.surname,
								labs: req.session.labs,
							});
					}
					if(!rendered){
						console.log("nothing entered");
						res.render('register', {currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n, i18n:res, labs: req.session.labs, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname,isLoggedInAdmin: req.session.admin, message : res.__("index.register.message4"), title: 'Register'});
					}
				});
			} else {
				res.render(
				'register',
				{
					currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n,
					i18n:res,
					ordersnum: req.session.orders,
					sharesnum: req.session.shares, 
					message : res.__("index.register.message2"),
					title: 'Register',
					isLoggedInAdmin: req.session.admin,
					labyoker : req.session.user,
                    labyokersurname : req.session.surname,
					labs: req.session.labs
				});
			}
	});

	router.post('/search', function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		//if (req.session.user) {
			res.setLocale(req.cookies.i18n);
			var searchText = req.body.searchText;
			var searchType = req.body.searchType;
			var labYokeSearch = new LabYokeSearch(searchText, req.session.email, searchType);
			var messageStr = "";
			console.log("search - userlang: " + req.session.userlang);
            console.log("search - searchType: " + searchType);
			labYokeSearch.search(function(error, results) {
				console.log("results " + results[0].length);	
				if (searchText != null && searchText.length > 0){
					if(results[0].length == 0){
						messageStr = (res.__("index.search.message1", {searchText:searchText})).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
						//messageStr = "Sorry we could not find any results with your reagent search request: <b>" + searchText + "</b>. Please try again.";
					}
					res.render('search', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,searchType:searchType,userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, mylab: req.session.lab, message: messageStr, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user,labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Search', fullname: req.session.fullname, sendemail: req.session.email, searchResults : results[0], agentsResults : results[1], searchformText: searchText, loggedIn : true});
				} else {
					messageStr = "You entered an invalid reagent keyword. Please try again.";
					res.render('search', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,searchType:searchType,userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, message: res.__("index.search.message2"), mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname,isLoggedInAdmin: req.session.admin, title: 'Search', loggedIn : true, agentsResults : results[1]});
				}
				req.session.messages = null;
			});
		//} else {
		//	res.redirect('/login');
		//}
	});

	router.post('/searchCatalog', function(req, res) {
		if(req.cookies.i18n == null || req.cookies.i18n == undefined){
			req.cookies.i18n = "en";
		}
        globalocale = req.cookies.i18n;
		res.setLocale(req.cookies.i18n);
		//if (req.session.user) {
			var searchText = req.body.searchTextCatalog;
			var searchType = req.body.searchType;
			var labYokeSearch = new LabYokeSearch(searchText, req.session.email, searchType);
			var messageStr = "";
			labYokeSearch.search(function(error, results) {
				console.log("results " + results[0].length);
                console.log("searchType " + searchType);	
				if (searchText != null && searchText.length > 0){
                    console.log("searchType catalog 2 "  + searchType);
					if(results[0].length == 0){
						messageStr = (res.__("index.searchcatalog.message1", {searchText:searchText})).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
						//messageStr = "Sorry we could not find any results with your catalog search request: <b>" + searchText + "</b>. Please try again.";
					}
					res.render('search', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,searchType: "catalog",userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, mylab: req.session.lab, messageCatalog: messageStr, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname, isLoggedInAdmin: req.session.admin, title: 'Reagent Search', fullname: req.session.fullname, sendemail: req.session.email, searchResults : results[0], agentsResults : results[1], searchformTextCatalog: searchText, loggedIn : true});
				} else {
                    console.log("searchType catalog 1 " + searchType);
					messageStr = "You entered an invalid catalog keyword. Please try again.";
					res.render('search', {currente:req.session.email,currentl:req.session.lab,superadmin:req.session.usersuperadmin,searchType: "catalog",userlang:req.session.userlang,lang:req.cookies.i18n, i18n:res, messageCatalog: res.__("index.searchcatalog.message2"),mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, labyokersurname : req.session.surname,isLoggedInAdmin: req.session.admin, title: 'Reagent Search', loggedIn : true, agentsResults : results[1]});
				}
				req.session.messages = null;
			});
		//} else {
		//	res.redirect('/login');
		//}
	});

    router.post('/login', function(req, res) {

        var mom = moment().tz(jstz.determine().name()).format;
        console.log("timezone jstz.determine().name(): " + jstz.determine().name());
        console.log("req.cookies.i18n: " + req.cookies.i18n);
        if (req.cookies.i18n == null || req.cookies.i18n == undefined) {
            req.cookies.i18n = "en";
        }
        globalocale = req.cookies.i18n;
        console.log("req.cookies.i18n after setup: " + req.cookies.i18n);
        res.setLocale(req.cookies.i18n);
        globalres = res;
        if (req.session.user) {
            res.redirect('/search');
        } else {
            var username = req.body.user;
            var password = req.body.pass;
            if (username != null && username.length > 0 &&
                password != null && password.length > 0) {
                var labyoker = new Labyoker(username, password);

                labyoker.login(function(error, results) {
                    var done, shares, orders, dept, labadmin;

                    if (results != null && results.length > 0) {
                        done = results[0];
                        dept = results[1];
                        labadmin = results[2];
                        console.log("dept: " + dept);
                        console.log("labadmin: " + labadmin);
                        req.session.labadmin = labadmin;
                        globalabadmin = labadmin;
                        req.session.dept = dept;
                        console.log("user language: " + done[0].lang);
                        //res.setLocale(done[0].lang);
                    }

                    /*if(results != null && results.length > 2){
                        orders = results[2];
                        req.session.orders = orders;
                    }*/
                    console.log("done is " + done);
                    console.log("department is : " + dept);
                    //console.log("done2 is " + done.length);
                    console.log("shares is " + shares);
                    console.log("orders is " + orders);

                    if (done != null && done.length > 0) {
                        if (done[0].active == 0) {

                            return res
                                .render(
                                    'login', {
                                        i18n: res,
                                        lang: req.cookies.i18n,
                                        message: (res.__("index.login.message1")).replace(/&lt;/g, '<').replace(/&gt;/g, '>') /*"You have not completed your registration. Please check your emails and click on the link."*/ ,
                                        title: 'Login'
                                    });
                        }
                        if (done[0].disable == 0) {

                            return res
                                .render(
                                    'login', {
                                        i18n: res,
                                        lang: req.cookies.i18n,
                                        message: (res.__("index.login.message2")).replace(/&lt;/g, '<').replace(/&gt;/g, '>') /*"Your account has been disabled. Please contact your lab administrator."*/ ,
                                        title: 'Login'
                                    });
                        }

                        var init = new LabyokerInit(done[0].email, done[0].lab);
                        init.initialShares(function(error, resultsShares) {
                            console.log("inside init shares " + resultsShares);
                            if (resultsShares != null) {
                                console.log("initshares is " + resultsShares);
                                shares = resultsShares;
                                req.session.shares = shares;
                                if(req.session.shares != 0){
                                    res.cookie('is',req.session.shares);
                                    console.log("setting is " + req.session.shares);
                                }
                            }
                            init.initialOrders(function(error, resultsOrders) {
                                console.log("inside init orders " + resultsOrders);
                                if (resultsOrders != null) {
                                    console.log("initorders is " + resultsOrders);
                                    orders = resultsOrders;
                                    req.session.orders = orders;
                                }
                                req.session.user = done[0].name;
                                req.session.surname = done[0].surname;
                                //req.session.dept = dept[0].department;
                                req.session.userid = done[0].id;
                                req.session.userlang = done[0].lang;
                                globaluserlang = done[0].lang;
                                req.session.useradmin = false;
                                req.session.usersuperadmin = false;
                                console.log("user surname (NEW): " + req.session.surname);
                                console.log("user language: " + req.session.userlang);
                                console.log("admin: " + done[0].admin);
                                var c = parseInt(done[0].admin, 10);
                                req.session.admin = c;
                                console.log("c: " + c);
                                if (c > 0) {
                                    req.session.admin = 1;
                                    req.session.useradmin = true;
                                }
                                if (c > 1) {
                                    req.session.usersuperadmin = true;
                                }
                                console.log("req.session.useradmin? " + req.session.useradmin);
                                console.log("req.session.usersuperadmin? " + req.session.usersuperadmin);
                                req.session.active = done[0].active;
                                req.session.email = done[0].email;
                                globalemail = req.session.email;
                                req.session.lab = done[0].lab;
                                globalab = done[0].lab;
                                req.session.oninsuff = done[0].oninsuff;
                                req.session.fullname = done[0].name;
                                req.session.surname = done[0].surname;
                                console.log("fullname " + req.session.fullname);
                                console.log("email " + req.session.email);
                                req.session.loggedin = true;

                                console.log("initial req.session.lab: " + req.session.lab);
                                var timeframesavings = "year";
                                var choosetime = "";
                                var timearr = ["year", "month", "all"];
                                var labarr = ["all", req.session.lab];
                                var datefromsavings = "";
                                var datetosavings = "";
                                var lab = "";
                                var labsavings = "";
                                //(res.__("index.login.message2")).replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                                var t = Math.floor((Math.random() * timearr.length - 1) + 1);
                                var l = Math.floor((Math.random() * labarr.length - 1) + 1);
                                console.log("random int time: " + t);
                                console.log("random int lab: " + l);

                                lab = labarr[l];
                                choosetime = timearr[t];
                                console.log("lab: " + lab);
                                console.log("choosetime: " + choosetime);

                                if (lab == "all") {
                                    //labsavings = "<b><i>WORLD</i></b>";
                                    labsavings = (res.__("index.login.all1")).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                                } else {
                                    //labsavings = "<b><i>Other Labs</i></b>";
                                    labsavings = (res.__("index.login.all2")).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                                }
                                var choose = "";
                                if (choosetime == "year") {
                                    var date = new Date(),
                                        y = date.getFullYear(),
                                        m = date.getMonth();
                                    datefromsavings = moment(new Date(y, 0, 1)).tz("America/New_York").format('MM-DD-YYYY');
                                    datetosavings = moment(new Date(y, 12, 1)).tz("America/New_York").format('MM-DD-YYYY');
                                    choose = (res.__("index.login.time1.year", {
                                        choosetime: "année"
                                    })).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                                    /*datefromsavings = "01-01-2016";
                                    datetosavings = "12-31-2016";*/
                                }
                                if (choosetime == "month") {
                                    var date = new Date(),
                                        y = date.getFullYear(),
                                        m = date.getMonth();
                                    datefromsavings = moment(new Date(y, m, 1)).tz("America/New_York").format('MM-DD-YYYY');
                                    datetosavings = moment(new Date(y, m + 1, 0)).tz("America/New_York").format('MM-DD-YYYY');
                                    choose = (res.__("index.login.time1.month", {
                                        choosetime: "mois"
                                    })).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                                    /*datefromsavings = "12-01-2016";
                                    datetosavings = "12-31-2016";*/
                                }
                                timeframesavings = choose; //"this past <b>" + choosetime + "</b>";
                                if (choosetime == "all") {
                                    datefromsavings = undefined;
                                    datetosavings = undefined;
                                    //timeframesavings = "over time";
                                    timeframesavings = res.__("index.login.time2");
                                }

                                console.log("timeframesavings datefromsavings: " + datefromsavings);
                                console.log("timeframesavings datetosavings: " + datetosavings);
                                console.log("timeframesavings: " + timeframesavings);
                                var booster = [];
                                var boostercolor = [];
                                if (orders > 0) {
                                    //booster.push("<strong> Notification!</strong> You have <b>" + orders + " new order(s)</b> pending completion.");
                                    booster.push((res.__("index.login.booster1", {
                                        orders: orders
                                    })).replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
                                    boostercolor.push("warning");
                                }
                                if (shares > 0) {
                                    //booster.push("<strong> Notification!</strong> You have <b>" + shares + " new share(s)</b> pending completion. <a href='/share'>Check it out</a> promptly and fulfill the request. Way to contribute to your lab's savings!");
                                    booster.push((res.__("index.login.booster2", {
                                        shares: shares
                                    })).replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
                                    boostercolor.push("warning");
                                }

                                console.log("in LOGIN: GET LABS - " + req.session.labs);
                                if (req.session.labs != null && req.session.labs != undefined) {
                                    var labYokereporterSavings = new LabYokeReporterSavings(datefromsavings, datetosavings, undefined, undefined, undefined, lab, req.session.lab, req.session.labs, res);
                                    labYokereporterSavings.dataMoney(function(error, savings) {
                                        console.log("savings: " + savings);

                                        req.session.savings = savings;
                                        var cheer = res.__("index.login.cheer1"); //"Keep searching, ordering, and sharing!";
                                        if (savings > 10000) {
                                            cheer = res.__("index.login.cheer2"); //"Amazing! You are a rock star!";
                                        } else if (savings > 1000) {
                                            cheer = res.__("index.login.cheer3"); //"Incredible!";
                                        } else if (savings > 100) {
                                            cheer = res.__("index.login.cheer4"); //"Keep it up!";
                                        }
                                        if (savings > 0) {
                                            var text = "";
                                            console.log("non-null savings: " + accounting.formatMoney(savings));
                                            if (lab == "all") {
                                                //text = "<strong> Major Achievement!</strong> You are part of a " + labsavings + " savings for a total of <b>" + accounting.formatMoney(savings) + "</b> " + timeframesavings + " in your department. " + cheer;
                                                text = (res.__("index.login.text1", {
                                                    labsavings: labsavings,
                                                    accountingsavings: accounting.formatMoney(savings),
                                                    timeframesavings: timeframesavings,
                                                    cheer: cheer
                                                })).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                                            } else {
                                                //text = "<strong> Major Achievement!</strong> You have saved " + labsavings + " a total of <b>" + accounting.formatMoney(savings) + "</b> " + timeframesavings + ". " + cheer;
                                                text = (res.__("index.login.text2", {
                                                    labsavings: labsavings,
                                                    accountingsavings: accounting.formatMoney(savings),
                                                    timeframesavings: timeframesavings,
                                                    cheer: cheer
                                                })).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                                            }
                                            booster.push(text);
                                            boostercolor.push("success");
                                        }

                                        var b = Math.floor((Math.random() * booster.length - 1) + 1);
                                        if (booster[b] == undefined) {
                                            //booster[b] = "Using LabyYoke reduces purchasing prices for <strong>You</strong> and your <strong>Lab</strong>. Use it as a social platform. Have fun and Keep it Up!";
                                            booster[b] = (res.__("index.login.booster3")).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                                            console.log(booster[b]);
                                            boostercolor[b] = "success"
                                        }
                                        req.session.savingsTextInitial = booster[b];
                                        req.session.savingsColorInitial = boostercolor[b];
                                        console.log("req.session.savingsText: " + req.session.savingsTextInitial);


                                        if (req.session.to != null && req.session.to.length > 0) {
                                            console.log("login going to: " + req.session.to);
                                            res.redirect(req.session.to);
                                            req.session.to = null;
                                        } else {
                                            res.redirect('/search');
                                        }
                                    });
                                } else {
                                    var labyokerLabs = new LabyokerLabs('', '');
                                    labyokerLabs.getlabs(function(error, labs) {
                                        req.session.labs = labs;
                                        console.log("in LOGIN: GET LABS now " + req.session.labs);
                                        console.log("loggin in labs: " + labs);

                                        var labYokereporterSavings = new LabYokeReporterSavings(datefromsavings, datetosavings, undefined, undefined, undefined, lab, req.session.lab, req.session.labs, res);
                                        labYokereporterSavings.dataMoney(function(error, savings) {
                                            console.log("savings: " + savings);

                                            req.session.savings = savings;
                                            var cheer = res.__("index.login.cheer1"); //"Keep searching, ordering, and sharing!";
                                            if (savings > 10000) {
                                                cheer = res.__("index.login.cheer2"); //"Amazing! You are a rock star!";
                                            } else if (savings > 1000) {
                                                cheer = res.__("index.login.cheer3"); //"Incredible!";
                                            } else if (savings > 100) {
                                                cheer = res.__("index.login.cheer4"); //"Keep it up!";
                                            }
                                            if (savings > 0) {
                                                var text = "";
                                                console.log("non-null savings: " + accounting.formatMoney(savings));
                                                if (lab == "all") {
                                                    //text = "<strong> Major Achievement!</strong> You are part of a " + labsavings + " savings for a total of <b>" + accounting.formatMoney(savings) + "</b> " + timeframesavings + " in your department. " + cheer;
                                                    text = (res.__("index.login.text1", {
                                                        labsavings: labsavings,
                                                        accountingsavings: accounting.formatMoney(savings),
                                                        timeframesavings: timeframesavings,
                                                        cheer: cheer
                                                    })).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                                                } else {
                                                    //text = "<strong> Major Achievement!</strong> You have saved " + labsavings + " a total of <b>" + accounting.formatMoney(savings) + "</b> " + timeframesavings + ". " + cheer;
                                                    text = (res.__("index.login.text2", {
                                                        labsavings: labsavings,
                                                        accountingsavings: accounting.formatMoney(savings),
                                                        timeframesavings: timeframesavings,
                                                        cheer: cheer
                                                    })).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                                                }
                                                booster.push(text);
                                                boostercolor.push("success");
                                            }

                                            var b = Math.floor((Math.random() * booster.length - 1) + 1);
                                            if (booster[b] == undefined) {
                                                //booster[b] = "Using LabyYoke reduces purchasing prices for <strong>You</strong> and your <strong>Lab</strong>. Use it as a social platform. Have fun and Keep it Up!";
                                                booster[b] = (res.__("index.login.booster3")).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                                                boostercolor[b] = "success"
                                            }
                                            req.session.savingsTextInitial = booster[b];
                                            req.session.savingsColorInitial = boostercolor[b];
                                            console.log("req.session.savingsText: " + req.session.savingsTextInitial);


                                            if (req.session.to != null && req.session.to.length > 0) {
                                                res.redirect(req.session.to);
                                                req.session.to = null;
                                            } else {
                                                res.redirect('/search');
                                            }
                                        });
                                    });
                                }


                            });
                        });
                    } else {
                        res
                            .render(
                                'login', {
                                    i18n: res,
                                    lang: req.cookies.i18n,
                                    message: res.__("index.login.message3") /*"Your username and/or password is wrong. Please try again."*/ ,
                                    title: 'Login'
                                });
                    }
                });
            } else {
                res
                    .render(
                        'login', {
                            i18n: res,
                            lang: req.cookies.i18n,
                            message: res.__("index.login.message3") /*"Your username and/or password is wrong. Please try again."*/ ,
                            title: 'Login'
                        });
            }
        }

    });

	router.get('/confirmreg', function(req, res) {
		res.redirect('/register');
	}); 

	router.get('/confirmreg/:id', function(req, res) {
		var lang = req.query.lang;
		console.log("lang is confirm user: " + lang);
		if(lang == null || lang == undefined){
			lang = "en";
		}
        globalocale = lang;
		req.cookies.i18n = lang;
		res.setLocale(lang);
		var id = req.params.id;
		console.log("confirm register id is: " + id);

		if (id != null && id.length > 0){
			var confirmReg = new LabyokerConfirm(id);
			confirmReg.confirm(function(error, results) {
			
			console.log("LabyokerConfirm results: " + results);
			
			if (results != null && results.length > 0 && results == 'confirmReset') {
					res.render('register', {
						currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Confirm Registration',
						/*loggedIn : true,*/
						displayForm: true,
						hashid: id,
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						confirmReset : res.__("index.confirmpwd.message1").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
						//,scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'errorFound') {
					res.render('register', {
						currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Confirm Registration',
						/*loggedIn : true,*/
						displayForm: true,
						hashid: id,
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						confirmReset : (res.__("index.confirmpwd.message2", { id: id })).replace(/&lt;/g, '<').replace(/&gt;/g, '>')
						//,scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'cannotFindRequest') {
				res.render('register', {
					currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n,
					i18n:res,
					ordersnum: req.session.orders,
					sharesnum: req.session.shares,
					title : 'Confirm Registration',
					/*loggedIn : true,*/
					displayForm: true,
					hashid: id,
					isLoggedInAdmin: req.session.admin,
					labyoker : req.session.user,
                    labyokersurname : req.session.surname,
					confirmReset : res.__("index.confirmpwd.message3").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
					//,scripts : [ '/javascripts/utils.js' ]
				});
			} else {
					res.render('register', {
						currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Confirm Registration',
						/*loggedIn : true,*/
						displayForm: true,
						hashid: id,
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						confirmReset : (res.__("index.confirmpwd.message2", { id: id })).replace(/&lt;/g, '<').replace(/&gt;/g, '>')
						//,scripts : [ '/javascripts/utils.js' ]
					});
			}
			});
	}
});

	router.get('/changepassword/:id', /*isLoggedInAndNotActive,*/ function(req, res) {
		var lang = req.query.lang;
		console.log("lang is forgot user: " + lang);
		if(lang == null || lang == undefined){
			lang = "en";
		}
        globalocale = lang;
		console.log("lang is forgot user: " + lang);
		req.cookies.i18n = lang;
		res.setLocale(lang);
		res.render('changepassword', {
			currente:req.session.email,currentl:req.session.lab,lang:req.cookies.i18n,
			i18n:res,
			ordersnum: req.session.orders,
			sharesnum: req.session.shares,
			title : 'Change Password',
			/*loggedIn : true,*/
			displayForm: true,
			hashid: req.params.id,
			isLoggedInAdmin: req.session.admin,
			labyoker : req.session.user,
            labyokersurname : req.session.surname
			//,scripts : [ '/javascripts/utils.js' ]
		});
	});

	router.get('/changepassword', /*isLoggedInAndNotActive,*/ function(req, res) {
		res.redirect('/forgot');
	});

	router.post('/changepassword', /*isLoggedIn,*/ function(req, res) {
		var lang = req.query.lang;
		console.log("lang is forgot user: " + lang);
		if(lang == null || lang == undefined){
			lang = "en";
		}
        globalocale = lang;
		req.cookies.i18n = lang;
		/*labyoker.changepassword(function(error, done) {
			if (done != null) {
				res.redirect('/');
			}
		});*/
		var id = req.body.hashid;
		console.log("changing password id is: " + id);
		console.log("changing password pwd is: " + req.body.pass);
		var dateStripped = moment(new Date).tz("America/New_York").format(
				'MM-DD-YYYY'); // '2014-06-09'

		if (id != null && id.length > 0){
			var pwdChange = new LabyokerPasswordChange(id, req.body.pass);
			pwdChange.checkIfChangePassword(function(error, results) {
			
			console.log("LabyokerPasswordChange results: " + results);
			
			if (results != null && results.length > 0 && results == 'passwordReset') {
					res.render('changepassword', {
						currente:req.session.email,currentl:req.session.lab,lang:lang,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						/*loggedIn : true,*/
						messageSuccess : res.__("index.changepwd.message1").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
						//,scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'errorFound') {
					res.render('changepassword', {
						currente:req.session.email,currentl:req.session.lab,lang:lang,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares, 
						title : 'Change Password',
						/*loggedIn : true,*/
						displayForm: true,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						isLoggedInAdmin: req.session.admin,
						message : (res.__("index.changepwd.message2", { id: id })).replace(/&lt;/g, '<').replace(/&gt;/g, '>') 
						//,scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'dateExpired') {
						res.render('forgot', {
						currente:req.session.email,currentl:req.session.lab,lang:lang,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares, 
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						/*loggedIn : true,*/
						message : res.__("index.changepwd.message3").replace(/&lt;/g, '<').replace(/&gt;/g, '>'), 
						displayForm: true
						//,scripts : [ '/javascripts/utils.js' ]
					});
			} else if(results != null && results.length > 0 && results == 'cannotFindRequest') {
					res.render('forgot', {
						currente:req.session.email,currentl:req.session.lab,lang:lang,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares, 
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						/*loggedIn : true,*/
						displayForm: true,
						message : res.__("index.changepwd.message4").replace(/&lt;/g, '<').replace(/&gt;/g, '>') 
						//,scripts : [ '/javascripts/utils.js' ]
					});
			} else {
					res.render('changepassword', {
						currente:req.session.email,currentl:req.session.lab,lang:lang,
						i18n:res,
						ordersnum: req.session.orders,
						sharesnum: req.session.shares,
						title : 'Change Password',
						isLoggedInAdmin: req.session.admin,
						labyoker : req.session.user,
                        labyokersurname : req.session.surname,
						/*loggedIn : true,*/
						displayForm: true,
						message : (res.__("index.changepwd.message5", { id: id })).replace(/&lt;/g, '<').replace(/&gt;/g, '>') 
						//,scripts : [ '/javascripts/utils.js' ]
					});
			}
			});
		} else {
			console.log("redirecting to forgot page");
			res.redirect('/forgot');
		}

	});



    function isLoggedInSuperAdmin(req, res, next) {
        if (req.session.user && req.session.usersuperadmin)
            return next();
        console.log('requested url: '+req.originalUrl);
        req.session.to = req.originalUrl;
        res.redirect('/admin/login');
    }

    router.get('/admin/', function(req, res) {
        res.redirect('/admin/querytool');
    });

    router.get('/admin/createdepartment', function(req, res) {
        res.redirect('/admin/departments');
    });

    router.get('/admin/createlab', function(req, res) {
        res.redirect('/admin/departments');
    });

    router.get('/admin/editlab', function(req, res) {
        res.redirect('/admin/departments');
    });

    router.get('/admin/setvenn', function(req, res) {
        res.redirect('/admin/departments');
    });

    router.get('/admin/setadmin', function(req, res) {
        res.redirect('/admin/departments');
    });

    router.get('/admin/setdisabled', function(req, res) {
        res.redirect('/admin/departments');
    });

    router.get('/admin/transferusertolab', function(req, res) {
        res.redirect('/admin/users');
    });

    router.get('/admin/disable', function(req, res) {
        res.redirect('/admin/users');
    });

    router.get('/admin/isadmin', function(req, res) {
        res.redirect('/admin/users');
    });


    router.get('/admin/querytool', isLoggedInSuperAdmin, function(req, res) {
        if (req.session.user) {
            var labYokeSearch = new LabYokeSearchAdmin("",req.session.email);
            labYokeSearch.findagents(function(error, results) {         
                if (results != null && results.length > 0){
                    res.render('admin/querytool', {currente:req.session.email,currentl:req.session.lab,mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, agentsResults : results, loggedIn : true, title: 'Query Tool'});
                } else {
                    res.render('admin/querytool', {currente:req.session.email,currentl:req.session.lab,mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Query Tool'});
                }
                req.session.messages = null;
            });
        } else {
            res.redirect('/admin/login');
        }
    });

    router.get('/admin/login', function(req, res) {
        console.log("sysdamin cookies: " + req.cookies.i18n);
        if(req.cookies.i18n == null || req.cookies.i18n == undefined){
            req.cookies.i18n = "en";
        }
        console.log("login req.session.user: " + req.session.user);
        console.log("login req.session.usersuperadmin: " + req.session.usersuperadmin);
        if (req.session.usersuperadmin) {
            res.redirect('/admin/querytool');
        } else {
            var labyokerLabs = new LabyokerLabs('','');
            labyokerLabs.getlabs(function(error, labs) {
                req.session.labs = labs;
                console.log("loggin in labs: " + labs);
                res.render('admin/login', {i18n:res,currente:req.session.email,currentl:req.session.lab,loggedlabyoker:req.session.user,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, title: 'Login',isLoggedInAdmin: req.session.admin});
                req.session.messages = null;
            });

        }
    });


        router.post('/admin/createdepartment', isLoggedInSuperAdmin, function(req, res) {
        var labYokeGlobal = new LabYokeGlobal();
        var labYokeDepartment = new LabYokeDepartment(req.body.department);
        console.log("department is: " + req.body.department);
        labYokeDepartment.createdepartment(function(error, results) {
            var status = results[0];
            var message = results[1];
            console.log("createdepartment status: " + status);
            console.log("createdepartment message: " + message);
        labYokeGlobal.finddepartments(function(error, departments) {
            var errormessagedept = null;
            var successmessagedept = null;
            if(status == "success"){
                successmessagedept = message;
            } else {
                errormessagedept = message;
            }
//          console.log("departments: " + departments.length);
//          res.render('departments', {admins:departments[5],labadmins: departments[4], section:"department", labs: departments[3], errormessagedept: errormessagedept, successmessagedept: successmessagedept, depts: departments[0], vennsettings: departments[2], users: departments[1],labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});

            var vennusers = [];
            var users = departments[2].users;
            var i=0;
            console.log("Venn Settings: " + JSON.stringify(departments[2]));
            var limit = 0;
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("user0 length: " + user0.length);
                    limit += user0.length;
            }
            console.log("limit: " + limit);
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("Venn Settings users raw: " + prop0 + " - " + user0);
                console.log("Venn Settings user0 length: " + user0.length);
                for(var prop in user0){
                    user0[prop].then(data=>{
                    vennusers.push(data);
                    }).catch(e=>{
                        console.log("error from promise: " +e)
                    }).then(() => {

                        console.log("limit: " + limit);
                        if(i == (limit -1) ){
                            console.log("vennusers is: " +  JSON.stringify(vennusers));
                            res.render('admin/departments', {currente:req.session.email,currentl:req.session.lab,orphandepts:departments[6],vennuser:vennusers, admins:departments[5],labadmins: departments[4], section:"department", labs: departments[3], errormessagedept: errormessagedept, successmessagedept: successmessagedept, depts: departments[0], vennsettings: departments[2], users: departments[1],labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
                        }
                        console.log("i is: " + i);
                        i++;
                    });
                }
            }


            req.session.messages = null;
        });
        });
    });

    router.post('/admin/createlab', isLoggedInSuperAdmin, function(req, res) {
        var labYokeGlobal = new LabYokeGlobal();
        var labYokeLab = new LabYokeLab(req.body.labname, req.body.deptlab, req.body.adminlab);
        console.log("lab is: " + req.body.labname);
        labYokeLab.createlab(function(error, results) {
            var status = results[0];
            var message = results[1];
            console.log("createlab status: " + status);
            console.log("createlab message: " + message);
        labYokeGlobal.finddepartments(function(error, departments) {
            var errormessagelab = null;
            var successmessagelab = null;
            if(status == "success"){
                successmessagelab = message;
            } else {
                errormessagelab = message;
            }
            console.log("departments: " + departments.length);
//          res.render('departments', {admins:departments[5],labadmins: departments[4], section:"lab", labs: departments[3], errormessagelab: errormessagelab, successmessagelab: successmessagelab, depts: departments[0], vennsettings: departments[2], users: departments[1], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});

            var vennusers = [];
            var users = departments[2].users;
            var i=0;
            console.log("Venn Settings: " + JSON.stringify(departments[2]));
            var limit = 0;
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("user0 length: " + user0.length);
                    limit += user0.length;
            }
            console.log("limit: " + limit);
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("Venn Settings users raw: " + prop0 + " - " + user0);
                console.log("Venn Settings user0 length: " + user0.length);
                for(var prop in user0){
                    user0[prop].then(data=>{
                    vennusers.push(data);
                    }).catch(e=>{
                        console.log("error from promise: " +e)
                    }).then(() => {

                        console.log("limit: " + limit);
                        if(i == (limit -1) ){
                            console.log("vennusers is: " +  JSON.stringify(vennusers));
                            res.render('admin/departments', {currente:req.session.email,currentl:req.session.lab,orphandepts:departments[6],vennuser:vennusers, admins:departments[5],labadmins: departments[4], section:"lab", labs: departments[3], errormessagelab: errormessagelab, successmessagelab: successmessagelab, depts: departments[0], vennsettings: departments[2], users: departments[1], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
                        }
                        console.log("i is: " + i);
                        i++;
                    });
                }
            }


            req.session.messages = null;
        });
        });
    });

    router.post('/admin/editlab', isLoggedInSuperAdmin, function(req, res) {
        var labYokeGlobal = new LabYokeGlobal();
        var labYokeLab = new LabYokeLab(req.body.labnameedit, req.body.deptlabedit, req.body.adminlabedit);
        console.log("lab is: " + req.body.labname);
        labYokeLab.editlab(function(error, results) {
            var status = results[0];
            var message = results[1];
            console.log("createlab status: " + status);
            console.log("createlab message: " + message);
        labYokeGlobal.finddepartments(function(error, departments) {
            var errormessagelabedit = null;
            var successmessagelabedit = null;
            if(status == "success"){
                successmessagelabedit = message;
            } else {
                errormessagelabedit = message;
            }
            console.log("departments: " + departments.length);
//          res.render('departments', {admins:departments[5],labadmins: departments[4], section:"editlab", labs: departments[3], errormessagelabedit: errormessagelabedit, successmessagelabedit: successmessagelabedit, depts: departments[0], vennsettings: departments[2], users: departments[1], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});

            var vennusers = [];
            var users = departments[2].users;
            var i=0;
            console.log("Venn Settings: " + JSON.stringify(departments[2]));
            var limit = 0;
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("user0 length: " + user0.length);
                    limit += user0.length;
            }
            console.log("limit: " + limit);
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("Venn Settings users raw: " + prop0 + " - " + user0);
                console.log("Venn Settings user0 length: " + user0.length);
                for(var prop in user0){
                    user0[prop].then(data=>{
                    vennusers.push(data);
                    }).catch(e=>{
                        console.log("error from promise: " +e)
                    }).then(() => {

                        console.log("limit: " + limit);
                        if(i == (limit -1) ){
                            console.log("vennusers is: " +  JSON.stringify(vennusers));
                            res.render('admin/departments', {currente:req.session.email,currentl:req.session.lab,orphandepts:departments[6],vennuser:vennusers,labadmins: departments[4], section:"editlab", labs: departments[3], errormessagelabedit: errormessagelabedit, successmessagelabedit: successmessagelabedit, depts: departments[0], vennsettings: departments[2], users: departments[1], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
                        }
                        console.log("i is: " + i);
                        i++;
                    });
                }
            }

            req.session.messages = null;
        });
        });
    });

    router.post('/admin/setadmin', isLoggedInSuperAdmin, function(req, res) {
        var labYokeGlobal = new LabYokeGlobal();
        var labYokeLab = new LabYokeLab(req.body.labname, req.body.dept, req.body.labnameadmin);
        console.log("lab is: " + req.body.labname);
        console.log("lab0 is: " + req.body.labnameedit);
        console.log("adminlabedit is: " + req.body.adminlabedit);
        labYokeLab.setadmin(function(error, results) {
            var status = results[0];
            var message = results[1];
            console.log("createlab status: " + status);
            console.log("createlab message: " + message);
        labYokeGlobal.finddepartments(function(error, departments) {
            var errormessagelabedit = null;
            var successmessagelabedit = null;
            if(status == "success"){
                successmessagelabedit = message;
            } else {
                errormessagelabedit = message;
            }
            console.log("departments: " + departments.length);
//          res.render('departments', {admins:departments[5], labadmins: departments[4], section:"vennSettings", labs: departments[3], errormessageadmin: errormessagelabedit, successmessageadmin: successmessagelabedit, depts: departments[0], vennsettings: departments[2], users: departments[1], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});

            var vennusers = [];
            var users = departments[2].users;
            var i=0;
            console.log("Venn Settings: " + JSON.stringify(departments[2]));
            var limit = 0;
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("user0 length: " + user0.length);
                    limit += user0.length;
            }
            console.log("limit: " + limit);
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("Venn Settings users raw: " + prop0 + " - " + user0);
                console.log("Venn Settings user0 length: " + user0.length);
                for(var prop in user0){
                    user0[prop].then(data=>{
                    vennusers.push(data);
                    }).catch(e=>{
                        console.log("error from promise: " +e)
                    }).then(() => {

                        console.log("limit: " + limit);
                        if(i == (limit -1) ){
                            console.log("vennusers is: " +  JSON.stringify(vennusers));
                            res.render('admin/departments', {currente:req.session.email,currentl:req.session.lab,orphandepts:departments[6],vennuser:vennusers,admins:departments[5], labadmins: departments[4], section:"vennSettings", labs: departments[3], errormessageadmin: errormessagelabedit, successmessageadmin: successmessagelabedit, depts: departments[0], vennsettings: departments[2], users: departments[1], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
                        }
                        console.log("i is: " + i);
                        i++;
                    });
                }
            }
            req.session.messages = null;
        });
        });
    });

    router.post('/admin/deletedept', isLoggedInSuperAdmin, function(req, res) {
        var labYokeGlobal = new LabYokeGlobal();
        var dept = req.body.department;

        var labYokeDepartment = new LabYokeDepartment(req.body.department);
        console.log("department is: " + req.body.department);
        labYokeDepartment.voiddepartment(function(error, results) {
            var status = results[0];
            var message = results[1];
            console.log("voiddepartment status: " + status);
            console.log("voiddepartment message: " + message);
        labYokeGlobal.finddepartments(function(error, departments) {
            var errormessagevenn = null;
            var successmessagevenn = null;
            if(status == "success"){
                successmessagevenn = message;
            } else {
                errormessagevenn = message;
            }
            console.log("departments: " + departments.length);
//          res.render('departments', {admins:departments[5],labadmins: departments[4], section:"venn", labs: departments[3], vennsettings: departments[2], users: departments[1], errormessagevenn: errormessagevenn, successmessagevenn: successmessagevenn, depts: departments[0], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
            var vennusers = [];
            var users = departments[2].users;
            var i=0;
            console.log("Venn Settings: " + JSON.stringify(departments[2]));
            var limit = 0;
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("user0 length: " + user0.length);
                    limit += user0.length;
            }
            console.log("limit: " + limit);
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("Venn Settings users raw: " + prop0 + " - " + user0);
                console.log("Venn Settings user0 length: " + user0.length);
                for(var prop in user0){
                    user0[prop].then(data=>{
                    vennusers.push(data);
                    }).catch(e=>{
                        console.log("error from promise: " +e)
                    }).then(() => {

                        console.log("limit: " + limit);
                        if(i == (limit -1) ){
                            console.log("vennusers is: " +  JSON.stringify(vennusers));
                            res.render('admin/departments', {currente:req.session.email,currentl:req.session.lab,orphandepts:departments[6],vennuser:vennusers,admins:departments[5],labadmins: departments[4], labs: departments[3], vennsettings: departments[2], users: departments[1], errormessagevoiddept: errormessagevenn, successmessagevoiddept: successmessagevenn, depts: departments[0], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
                        }
                        console.log("i is: " + i);
                        i++;
                    });
                }
            }

            req.session.messages = null;
        });
        });
    });

    router.post('/admin/setvenn', isLoggedInSuperAdmin, function(req, res) {
        var labYokeGlobal = new LabYokeGlobal();
        var checked = req.body.addvenn;
        if(checked == undefined)
            checked = 0;
        else
            checked = 1;
        var labYokeLabVenn = new LabYokeLabVenn(req.body.labnamevenn, req.body.departmentvenn, checked);
        console.log("lab venn is: " + req.body.labnamevenn);
        console.log("check venn is: " + req.body.addvenn);
        console.log("dept venn is: " + req.body.departmentvenn);
        labYokeLabVenn.setvenn(function(error, results) {
            var status = results[0];
            var message = results[1];
            console.log("setvenn status: " + status);
            console.log("setvenn message: " + message);
        labYokeGlobal.finddepartments(function(error, departments) {
            var errormessagevenn = null;
            var successmessagevenn = null;
            if(status == "success"){
                successmessagevenn = message;
            } else {
                errormessagevenn = message;
            }
            console.log("departments: " + departments.length);
//          res.render('departments', {admins:departments[5],labadmins: departments[4], section:"venn", labs: departments[3], vennsettings: departments[2], users: departments[1], errormessagevenn: errormessagevenn, successmessagevenn: successmessagevenn, depts: departments[0], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
            var vennusers = [];
            var users = departments[2].users;
            var i=0;
            console.log("Venn Settings: " + JSON.stringify(departments[2]));
            var limit = 0;
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("user0 length: " + user0.length);
                    limit += user0.length;
            }
            console.log("limit: " + limit);
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("Venn Settings users raw: " + prop0 + " - " + user0);
                console.log("Venn Settings user0 length: " + user0.length);
                for(var prop in user0){
                    user0[prop].then(data=>{
                    vennusers.push(data);
                    }).catch(e=>{
                        console.log("error from promise: " +e)
                    }).then(() => {

                        console.log("limit: " + limit);
                        if(i == (limit -1) ){
                            console.log("vennusers is: " +  JSON.stringify(vennusers));
                            res.render('admin/departments', {currente:req.session.email,currentl:req.session.lab,orphandepts:departments[6],vennuser:vennusers,admins:departments[5],labadmins: departments[4], section:"venn", labs: departments[3], vennsettings: departments[2], users: departments[1], errormessagevenn: errormessagevenn, successmessagevenn: successmessagevenn, depts: departments[0], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
                        }
                        console.log("i is: " + i);
                        i++;
                    });
                }
            }

            req.session.messages = null;
        });
        });
    });

    router.post('/admin/setdisabled', isLoggedInSuperAdmin, function(req, res) {
        var labYokeGlobal = new LabYokeGlobal();
        var checked = req.body.disablelab;
        if(checked == undefined)
            checked = 0;
        else
            checked = 1;
        var labYokeLabVenn = new LabYokeLabVenn(req.body.labnamevenn, req.body.departmentvenn, checked);
        console.log("lab disable is: " + req.body.labnamevenn);
        console.log("check disable is: " + req.body.disablelab);
        console.log("dept disable is: " + req.body.departmentvenn);
        labYokeLabVenn.setdisable(function(error, results) {
            var status = results[0];
            var message = results[1];
            console.log("setdisable status: " + status);
            console.log("setdisable message: " + message);
        labYokeGlobal.finddepartments(function(error, departments) {
            var errormessagedisable = null;
            var successmessagedisable= null;
            if(status == "success"){
                successmessagedisable = message;
            } else {
                errormessagedisable = message;
            }
            console.log("departments: " + departments.length);
            var vennusers = [];
            var users = departments[2].users;
            var i=0;
            console.log("Venn Settings: " + JSON.stringify(departments[2]));
            var limit = 0;
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("user0 length: " + user0.length);
                    limit += user0.length;
            }
            console.log("limit: " + limit);
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("Venn Settings users raw: " + prop0 + " - " + user0);
                console.log("Venn Settings user0 length: " + user0.length);
                for(var prop in user0){
                    user0[prop].then(data=>{
                    vennusers.push(data);
                    }).catch(e=>{
                        console.log("error from promise: " +e)
                    }).then(() => {

                        console.log("limit: " + limit);
                        if(i == (limit -1) ){
                            console.log("vennusers is: " +  JSON.stringify(vennusers));
                            res.render('admin/departments', {currente:req.session.email,currentl:req.session.lab,orphandepts:departments[6],vennuser:vennusers,admins:departments[5],labadmins: departments[4], section:"venn", labs: departments[3], vennsettings: departments[2], users: departments[1], errormessagedisable: errormessagedisable, successmessagedisable: successmessagedisable, depts: departments[0], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
                        }
                        console.log("i is: " + i);
                        i++;
                    });
                }
            }
//          res.render('departments', {admins:departments[5],labadmins: departments[4], section:"venn", labs: departments[3], vennsettings: departments[2], users: departments[1], errormessagedisable: errormessagedisable, successmessagedisable: successmessagedisable, depts: departments[0], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
            req.session.messages = null;
        });
        });
    });

    router.get('/admin/users', isLoggedInSuperAdmin, function(req, res) {
        if (req.session.user) {
            var labyokeGlobal = new LabYokeGlobal();
            labyokeGlobal.getUsers(function(error, results) {           
                if (results != null && results.length > 0){
                    res.render('admin/users', {currente:req.session.email,currentl:req.session.lab,labs:req.session.labs, mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, users : results, loggedIn : true, title: 'Users'});
                } else {
                    res.render('admin/users', {currente:req.session.email,currentl:req.session.lab,labs:req.session.labs, mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Users'});
                }
                req.session.messages = null;
            });
        } else {
            res.redirect('/admin/login');
        }
    });

    
    router.post('/admin/transferusertolab', isLoggedInSuperAdmin, function(req, res) {
        // TO DO
        if (req.session.user) {
            var id = req.body.id;
            var name = req.body.name;
            var surname = req.body.surname;
            var newlab = req.body.labnameedit;
            var oldlab = req.body.oldlab;
            var email = req.body.email;
            var usertransfer = id;
            if(name != null && name != "" && surname != null && surname != ""){
                usertransfer = name + " " + surname;
            }
            console.log("transferusertolab: " + newlab);
            console.log("id: " + id);
            var labyokeGlobal = new LabYokeGlobal();
            if(oldlab == newlab){
                labyokeGlobal.getUsers(function(error, results) {
                    console.log("users transfer total: " + results);            
                    if (results != null && results.length > 0){
                        res.render('admin/users', {currente:req.session.email,currentl:req.session.lab,labs:req.session.labs, transferuser:usertransfer, transfermess: "nochange", mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, users : results, loggedIn : true, title: 'Users'});
                    } else {
                        res.render('admin/users', {currente:req.session.email,currentl:req.session.lab,labs:req.session.labs, transferuser:usertransfer, transfermess: "nochange", mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Users'});
                    }
                    req.session.messages = null;
                });
            } else {
                var labYokeusertransfer = new LabYokeUserTransfer(id, newlab, name, surname, email);
                labYokeusertransfer.transfer(function(error, resultstransfer) {
                    var result = "fail";
                    if(resultstransfer != null && resultstransfer.length > 0){
                        result = resultstransfer;
                    }
                    labyokeGlobal.getUsers(function(error, results) {
                        console.log("users transfer total: " + results);            
                        if (results != null && results.length > 0){
                            res.render('admin/users', {currente:req.session.email,currentl:req.session.lab,labs:req.session.labs, transferuser:usertransfer, transfermess: result, erroruser: resultstransfer, mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, users : results, loggedIn : true, title: 'Users'});
                        } else {
                            res.render('admin/users', {currente:req.session.email,currentl:req.session.lab,labs:req.session.labs, transferuser:usertransfer, transfermess: result, erroruser: resultstransfer, mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Users'});
                        }
                        req.session.messages = null;
                    });     
                });
            }
        } else {
            res.redirect('/admin/login');
        }
    });

    router.post('/admin/isadmin', isLoggedInSuperAdmin, function(req, res) {
        if (req.session.user) {
            var id = req.body.id;
            var name = req.body.name;
            var surname = req.body.surname;
            var checked = req.body.isadmin;
            var email = req.body.email;
            console.log("req.body.isadmin: " + req.body.isadmin);
            if(checked != null)
                checked = 1;
            if(checked == undefined)
                checked = 0;
            console.log("id: " + id);
            console.log("name: " + name);
            console.log("surname: " + surname);
            console.log("checked: " + checked);
            console.log("email: " + email);
            var labYokeusers = new LabYokeUsers(id,name, surname, email,checked);
            labYokeusers.makeadminUser(function(error, resultsadmin) {
                if(resultsadmin != null && resultsadmin.length > 0){
                    //res.redirect('/users');           
                    var labyokeGlobal = new LabYokeGlobal();
                    labyokeGlobal.getUsers(function(error, results) {           
                        if (results != null && results.length > 0){
                            res.render('admin/users', {currente:req.session.email,currentl:req.session.lab,erroruser: resultsadmin, mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, users : results, loggedIn : true, title: 'Users'});
                        } else {
                            res.render('admin/users', {currente:req.session.email,currentl:req.session.lab,erroruser: resultsadmin, mylab: req.session.lab,labyoker : req.session.user, isLoggedInAdmin: req.session.admin, loggedIn : true, title: 'Users'});
                        }
                        req.session.messages = null;
                    });
                }
            });
        } else {
            res.redirect('/admin/login');
        }
    });

    router.post('/admin/disable', isLoggedInSuperAdmin, function(req, res) {
        if (req.session.user) {
            var id = req.body.id;
            var name = req.body.name;
            var surname = req.body.surname;
            var checked = req.body.cancel;
            var email = req.body.email;
            if(checked != null)
                checked = 0;
            if(checked == undefined)
                checked = 1;
            console.log("id: " + id);
            console.log("name: " + name);
            console.log("surname: " + surname);
            console.log("checked: " + checked);
            console.log("email: " + email);
            var labYokeusers = new LabYokeUsers(id,name, surname, email,checked);
            labYokeusers.disableUser(function(error, results) {
                if(results != null && results.length > 0){
                    res.redirect('/admin/users');         
                    //res.render('departments', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Shares',loggedIn : true});
                    req.session.messages = null;
                }
            });
        } else {
            res.redirect('/admin/login');
        }
    });

    router.post('/admin/users', isLoggedInSuperAdmin, function(req, res) {
        if (req.session.user) {
            var agent = req.body.agentform;
            var lab = req.body.labform;
            var vendor = req.body.vendorform;
            var catalognumber = req.body.catalogform;
            var email = req.body.emailform;
            var location = req.body.locationform;
            var reqemail = req.session.email;
            var reqcategory = req.body.categoryform;
            var quantity = req.body.qtyform;
            var labYokerorder = new LabYokerOrder(lab, agent, vendor, catalognumber,email,location,reqemail,reqcategory,quantity, req.session.lab);
            labYokerorder.order(function(error, results) {
                if(results != null && results=="successfulOrder"){
                    console.log("ordering agentform: " + agent);
                    console.log("ordering location: " + location);
                    console.log("ordering reqcategory: " + reqcategory);
                    console.log("booster",req.session.savingsText);
                
                    res.render('admin/users', {currente:req.session.email,currentl:req.session.lab,booster:req.session.savingsText, boostercolor:req.session.savingsColor, currentlabname:req.session.lab, categories: req.session.categories, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Users',loggedIn : true, location: location, agent: agent, vendor: vendor, catalog: catalognumber, email: email});
                    req.session.messages = null;
                }
            });
        } else {
            res.redirect('/admin/login');
        }
    });

    router.post('/admin/cancelshare', isLoggedInSuperAdmin, function(req, res) {
        if (req.session.user) {
            var agent = req.body.agent;
            var lab = req.body.lab;
            var vendor = req.body.vendor;
            var catalognumber = req.body.catalognumber;
            var table = req.body.table;
            var email = req.body.email;
            var requestor = req.body.requestoremail;
            var checked = req.body.cancel;
            var date = moment(req.body.date).add(1, 'day').tz("America/New_York").format(
                'MM-DD-YYYY');
            var datenow = moment(new Date).tz("America/New_York").format(
                'MM-DD-YYYY');
            if(checked != null)
                checked = 0;
            if(checked == undefined)
                checked = 1;
            console.log("date: " + date);
            console.log("laab: " + lab);
            console.log("agent: " + agent);
            console.log("vendor: " + vendor);
            console.log("catalognumber: " + catalognumber);
            console.log("checked: " + checked);
            console.log("table: " + table);
            console.log("email: " + email);
            console.log("requestoremail: " + requestor);
            var labYokechange = new LabYokerChangeShare(table,agent, vendor, catalognumber,email,requestor,checked,datenow,date, lab);
            labYokechange.cancelShare(function(error, results) {
                if(results != null && results.length > 0){
                    res.redirect('/admin/departments');           
                    //res.render('departments', {ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title:'Shares',loggedIn : true});
                    req.session.messages = null;
                }
            });
        } else {
            res.redirect('/admin/login');
        }
    });

    router.get('/admin/departments', isLoggedInSuperAdmin, function(req, res) {
        var labYokeGlobal = new LabYokeGlobal();
        labYokeGlobal.finddepartments(function(error, results) {
            var vennusers = [];
            var users = results[2].users;
            var i=0;
            console.log("Venn Settings: " + JSON.stringify(results[2]));
            var limit = 0;
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("user0 length: " + user0.length);
                    limit += user0.length;
            }
            console.log("limit: " + limit);
            for(var prop0 in users){
                var user0 = users[prop0];
                console.log("Venn Settings users raw: " + prop0 + " - " + user0);
                console.log("Venn Settings user0 length: " + user0.length);
                for(var prop in user0){
                    user0[prop].then(data=>{
                    vennusers.push(data);
                    }).catch(e=>{
                        //handle error case here when your promise fails
                        console.log("error from promise: " +e)
                    }).then(() => {

                        console.log("limit: " + limit);
                        if(i == (limit -1) ){
                            console.log("vennusers is: " +  JSON.stringify(vennusers));
                            res.render('admin/departments', {currente:req.session.email,currentl:req.session.lab,orphandepts:results[6],vennuser:vennusers, admins:results[5],labadmins: results[4], labs: results[3], vennsettings: results[2], users: results[1], section:"all", depts: results[0], labyoker : req.session.user, loggedIn : true, isLoggedInAdmin: req.session.admin, title:'Departments'});
                        }
                        console.log("i is: " + i);
                        i++;
                    });
                }
            }
            req.session.messages = null;
        });
    });

    router.post('/admin/querytool', isLoggedInSuperAdmin, function(req, res) {
        if (req.session.user) {
            var queryText = req.body.queryText;
            console.log("queryText tool: " + queryText);
            var labYokeSearch = new LabYokeSearchAdmin(queryText, req.session.email);
            var messageStr = "";
            labYokeSearch.query(function(error, results) {
                console.log("results " + results.length);
                console.log("results[1] " + results[1]);
                var err = "";
                var errStr = "";
                if(results != null && results[1] == "error"){
                    console.log("error " + results[2]);
                    err = results[1];
                    errStr = results[2];
                }
                if (queryText != null && queryText.length > 0){
                    if(results[1].length == 0 && results[0] == "select"){
                        messageStr = "Sorry we could not find any results with your query request: <b>" + queryText + "</b>. Please try again.";
                    }
                    res.render('admin/querytool', {currente:req.session.email,currentl:req.session.lab,rowCount:results[2], type:results[0], errorStr: errStr, error: err, mylab: req.session.lab, message: messageStr, ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Query Tool', fullname: req.session.fullname, sendemail: req.session.email, searchResults : results[1], agentsResults : results[2], searchformText: queryText, loggedIn : true});
                } else {
                    res.render('admin/querytool', {currente:req.session.email,currentl:req.session.lab,rowCount:results[2], type:results[0], errorStr: errStr, error: err, message:'You entered an invalid DB statement. Please try again.',mylab: req.session.lab,ordersnum: req.session.orders, sharesnum: req.session.shares, labyoker : req.session.user, isLoggedInAdmin: req.session.admin, title: 'Query Tool', loggedIn : true, agentsResults : results[2]});
                }
                req.session.messages = null;
            });
        } else {
            res.redirect('/admin/login');
        }
    });


    router
            .post(
                    '/admin/login',
                    function(req, res) {
                        var username = req.body.user;
                        var password = req.body.pass;
                        if (username != null && username.length > 0
                                && password != null && password.length > 0) {
                            var labyoker = new Labyoker(username, password);

                            labyoker
                                    .adminlogin(function(error, results) {
                                        var done, shares, orders, dept;

                                        if(results != null && results.length > 0){
                                            done = results[0];
                                            dept = results[1];
                                        }
                                        
                                        /*if(results != null && results.length > 2){
                                            orders = results[2];
                                            req.session.orders = orders;
                                        }*/
                                        console.log("done is " + done);
                                        console.log("department is : " + dept);
                                        //console.log("done2 is " + done.length);
                                        console.log("shares is " + shares);
                                        console.log("orders is " + orders);

                                        if (done != null && done.length > 0) {
                                            if (done[0].active == 0) {

                                                return res
                                                        .render(
                                                            'admin/login',
                                                            {
                                                                message : "You have not completed your registration. Please check your emails and click on the link.", title: 'Login'
                                                            });
                                            }
                                        if (done[0].disable == 0) {

                                                return res
                                                        .render(
                                                            'admin/login',
                                                            {
                                                                message : "Your account has been disabled. Please contact your lab administrator.", title: 'Login'
                                                            });
                                            }

                                            var init = new LabyokerInit(done[0].email, done[0].lab);
                                            init.initialShares(function(error, resultsShares) {
                                                console.log("inside init shares " + resultsShares);
                                                if(resultsShares != null){
                                                    console.log("initshares is " + resultsShares);
                                                    shares = resultsShares;
                                                    req.session.shares = shares;
                                                    if(req.session.shares != 0){
                                                        res.cookie('is',req.session.shares);
                                                        console.log("setting is " + req.session.shares);
                                                    }
                                                }
                                                init.initialOrders(function(error, resultsOrders) {
                                                    console.log("inside init orders " + resultsOrders);
                                                    if(resultsOrders != null){
                                                        console.log("initorders is " + resultsOrders);
                                                        orders = resultsOrders;
                                                        req.session.orders = orders;
                                                    }
                                                    req.session.user = done[0].name;
                                                    req.session.dept = dept[0].department;
                                                    req.session.userid = done[0].id;
                                                    req.session.useradmin = false;
                                                    console.log("admin? " + done[0].admin);
                                                    var c = parseInt(done[0].admin,10);
                                                    req.session.admin = c;
                                                    if(req.session.admin > 0){
                                                        req.session.admin = 1;
                                                        req.session.useradmin = true;
                                                    }
                                                    if(c > 1)
                                                        req.session.usersuperadmin = true;
                                                    console.log("req.session.usersuperadmin: " + req.session.usersuperadmin);
                                                    console.log("req.session.admin: " + req.session.admin);
                                                    req.session.active = done[0].active;
                                                    req.session.email = done[0].email;
                                                    req.session.lab = done[0].lab;
                                                    req.session.fullname = done[0].name;
                                                    req.session.surname = done[0].surname;
                                                    console.log("fullname " + req.session.fullname);
                                                    console.log("email " + req.session.email);
                                                    req.session.loggedin = true;

                                                    console.log("initial req.session.lab: " + req.session.lab);
                                                    var timeframesavings = "year";
                                                    var choosetime = "";
                                                    var timearr = ["year","month","all"];
                                                    var labarr = ["all",req.session.lab];
                                                    var datefromsavings = "";
                                                    var datetosavings = "";
                                                    var lab = "";
                                                    var labsavings = "";

                                                    var t = Math.floor((Math.random() * timearr.length-1) + 1);
                                                    var l = Math.floor((Math.random() * labarr.length-1) + 1);
                                                    console.log("random int time: " + t);
                                                    console.log("random int lab: " + l);

                                                    lab = labarr[l];
                                                    choosetime = timearr[t];
                                                    console.log("lab: " + lab);
                                                    console.log("choosetime: " + choosetime);

                                                    if(lab == "all"){
                                                        labsavings = "<b><i>WORLD</i></b>";
                                                    } else {
                                                        labsavings = "<b><i>Other Labs</i></b>";
                                                    }
                                                    if(choosetime == "year"){
                                                        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                                                        datefromsavings = moment(new Date(y, 0, 1)).tz("America/New_York").format('MM-DD-YYYY');
                                                        datetosavings = moment(new Date(y, 12, 1)).tz("America/New_York").format('MM-DD-YYYY');
                                                        /*datefromsavings = "01-01-2016";
                                                        datetosavings = "12-31-2016";*/
                                                    }
                                                    if(choosetime == "month"){
                                                        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                                                        datefromsavings = moment(new Date(y, m, 1)).tz("America/New_York").format('MM-DD-YYYY');
                                                        datetosavings = moment(new Date(y, m + 1, 0)).tz("America/New_York").format('MM-DD-YYYY');
                                                        /*datefromsavings = "12-01-2016";
                                                        datetosavings = "12-31-2016";*/
                                                    }
                                                    timeframesavings = "this past <b>" + choosetime + "</b>";
                                                    if(choosetime == "all"){
                                                        datefromsavings = undefined;
                                                        datetosavings = undefined;
                                                        timeframesavings = "over time";
                                                    }
                                                    
                                                    console.log("timeframesavings datefromsavings: " + datefromsavings);
                                                    console.log("timeframesavings datetosavings: " + datetosavings);
                                                    console.log("timeframesavings: " + timeframesavings);
                                                    var booster = [];
                                                    var boostercolor = [];
                                                    if(orders > 0){
                                                        booster.push("<strong> Notification!</strong> You have <b>" + orders + " new order(s)</b> pending completion.");
                                                        boostercolor.push("warning");
                                                    }
                                                    if(shares > 0){
                                                        booster.push("<strong> Notification!</strong> You have <b>" + shares + " new share(s)</b> pending completion. <a href='/departments'>Check it out</a> promptly and fulfill the request. Way to contribute to your lab's savings!");
                                                        boostercolor.push("warning");
                                                    }

                                                    var labYokereporterSavings = new LabYokeReporterSavings(datefromsavings,datetosavings,undefined,undefined,undefined,lab, req.session.lab,req.session.labs);
                                                    labYokereporterSavings.dataMoney(function(error, savings) {
                                                        console.log("savings: " + savings);

                                                        req.session.savings = savings;
                                                        var cheer = "Keep searching, ordering, and sharing!";
                                                        if (savings > 10000){
                                                            cheer = "Amazing! You are a rock star!";
                                                        } else if (savings > 1000){
                                                            cheer = "Incredible!";
                                                        } else if(savings > 100){
                                                            cheer = "Keep it up!";
                                                        } 
                                                        if(savings > 0){
                                                        var text = "";
                                                        console.log("non-null savings: " + accounting.formatMoney(savings));
                                                        if(lab == "all"){
                                                            text = "<strong> Major Achievement!</strong> You are part of a " + labsavings + " savings for a total of <b>" + accounting.formatMoney(savings) + "</b> " + timeframesavings + " in your department. " + cheer;
                                                        } else {
                                                            text = "<strong> Major Achievement!</strong> You have saved " + labsavings + " a total of <b>" + accounting.formatMoney(savings) + "</b> " + timeframesavings + ". " + cheer;
                                                        }
                                                        booster.push(text);
                                                        boostercolor.push("success");
                                                        }

                                                        var b = Math.floor((Math.random() * booster.length-1) + 1);
                                                        if(booster[b] == undefined){
                                                            booster[b] = "Using LabyYoke reduces purchasing prices for <strong>You</strong> and your <strong>Lab</strong>. Use it as a social platform. Have fun and Keep it Up!";
                                                            boostercolor[b] = "success"
                                                        }
                                                        req.session.savingsTextInitial = booster[b];
                                                        req.session.savingsColorInitial = boostercolor[b];
                                                        console.log("req.session.savingsText: " + req.session.savingsTextInitial);
                                                    

                                                    if(req.session.to != null && req.session.to.length > 0){
                                                        res.redirect(req.session.to);
                                                        req.session.to = null;
                                                    } else {
                                                        res.redirect('/admin/querytool');
                                                    }
                                                    });
                                                });
                                            });
                                        } else {
                                            res
                                                    .render(
                                                            'admin/login',
                                                            {
                                                                message : "Your username and/or password is wrong. Please try again.", title: 'Login'
                                                            });
                                        }
                                    });
                        } else {
                            res
                                    .render(
                                            'admin/login',
                                            {
                                                message : "Your username and/or password is wrong. Please try again.", title: 'Login'
                                            });
                        }

                    });



};
