//just for setting this up, index.js will be main file once i figure this out

//database
const Datastore = require('nedb');
var db = new Datastore({filename: "databases/test.db", autoload: true});

//.env
const DotEnv = require('dotenv').config();
var username = process.env.ACCOUNT;
var password = process.env.PASSWORD;

//selenium
const Webdriver = require('selenium-webdriver'), By = Webdriver.By;
// var browser = new Webdriver.Builder().forBrowser('chrome').build();
// .withCapabilities(Webdriver.Capabilities.chrome()).build();

const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

var driver = new Webdriver.Builder()
                 .withCapabilities(Webdriver.Capabilities.chrome())
                 .build();

driver.get("https://www.smartproxy.com/")

//beautiful soup
var JSSoup = require('jssoup');

//misc
var testURL = "https://www.instagram.com/p/CHrEVE8hlVY/";




