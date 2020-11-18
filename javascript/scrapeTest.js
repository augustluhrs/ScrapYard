//just for setting this up, index.js will be main file once i figure this out

//database
const Datastore = require('nedb');
var db = new Datastore({filename: "databases/test.db", autoload: true});

//.env
const DotEnv = require('dotenv').config();
var username = process.env.ACCOUNT;
var password = process.env.PASSWORD;

//selenium
const Webdriver = require('selenium-webdriver');
var browser = new Webdriver.Builder().withCapabilities(Webdriver.Capabilities.chrome()).build();

//beautiful soup
var JSSoup = require('jssoup');

//misc
var testURL = "https://www.instagram.com/p/CHrEVE8hlVY/";




