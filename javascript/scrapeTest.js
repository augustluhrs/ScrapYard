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

//misc
var testURL = "https://www.instagram.com/p/CHrEVE8hlVY/";

//beautiful soup
var JSSoup = require('jssoup').default;


//run
// login();
scrape();

function login(){
    driver.get('https://www.instagram.com/accounts/login/?hl=en')
    console.log("opened insta");
    let usernameBox = driver.findElement(By.name('username'));
    // let usernameBox = (await driver).findElement(By.name('username')).then(()=>{
    usernameBox.sendKeys(username);
    console.log("account entered");
    // });


}

//need to add async/await promises and stuff
function scrape(){
    driver.get(testURL);
    let soup = new JSSoup(driver.getPageSource());
    console.log(soup.find('div'))
    for (let link of soup.findAll('img')) {
        console.log(link.get('src'));
    }
}






