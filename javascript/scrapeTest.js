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
// scrapeTest();
// getSoup(testURL);
buttonTest(testURL);

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
async function scrapeTest(){
    // driver.get(testURL);
    // let soup = await new JSSoup(driver.getPageSource());
    try {
        let soup = await getSoup(testURL);
        // console.log(driver.getPageSource());
        console.log('3');
        // console.log((await driver.findElements(By.css('div'))));
        console.log((await driver.findElements(By.className('KL4Bh')))); 
        console.log('4');
        let eyes = (await driver.findElements(By.className('FFVAD')))
        let count = 0;
        for (let webel of eyes) {
            let link = (await webel.getAttribute('src'));
            console.log(count + " " + link);
            count++
        }
        //button ZyFrc
        //div eLAPa RzuR0
        //KL4Bh
        //img FFVAD
        // get src ^

        //right button class _6CZji

        //vi798 class of parent to Ckrofs
        //Ckrof classes of main post
        //v1Nh3.kIKUG._bz0w classes of thumbnails

        //video class tWeC1
        // get src^

        // console.log("soup " + soup);
        // console.log(soup.title);
        // console.log(soup.find('div'));
        // for (let link of soup.findAll('img')) {
        //     console.log(link.get('src'));
        // }
        // console.log('4');
        driver.sleep(5);
    } catch (error) {
        console.log(error);
    }
}

async function buttonTest(url){
    try {
        driver.get(url);
        // await driver.sleep(5);
        let mainParent = await driver.findElement(By.className('vi798'));
        // console.log('mp: ' + await mainParent.getTagName());
        let hasFinished = false;
        let links = {imgs: [], vids: []};
        let button = await driver.findElement(By.className('_6CZji'));
        while(!hasFinished) {
            hasFinished = true;
            let imgsFinished = true;
            let vidsFinished = true;

            //check for imgs
            let allImgs = await mainParent.findElements(By.className('FFVAD'));
            for (let l of allImgs) {
                let s = await l.getAttribute('src');
                console.log(s);
                let isNewLink = true; //gotta be a better way... TODO relook break
                for (let k of links.imgs) { //TODO better names
                    if(s == k) {
                        isNewLink = false;
                        break;
                    } else {
                        isNewLink = true;
                    }
                }
                if (isNewLink) { 
                    links.imgs.push(s);
                    imgsFinished = false;
                }
            }
            //check for vids
            let allVids = await mainParent.findElements(By.className('tWeCl'));
            for (let l of allVids) {
                let s = await l.getAttribute('src');
                console.log(s);
                let isNewLink = true; //gotta be a better way... TODO relook break
                for (let k of links.vids) { //TODO better names
                    if(s == k) {
                        isNewLink = false;
                        break;
                    } else {
                        isNewLink = true;
                    }
                }
                if (isNewLink) { 
                    links.vids.push(s);
                    vidsFinished = false;
                }
            }

            //if not done, click button
            if(!imgsFinished || !vidsFinished) {hasFinished = false}
            if(!hasFinished) {await button.click()}; //will get stale
            await driver.sleep(100);
        }
        console.log('imgs: ' + links.imgs.length);
        for(let img of links.imgs){
            console.log(img);
        }
        console.log('vids: ' + links.vids.length);
        for(let vid of links.vids){
            console.log(vid);
        }
    } catch (err) {
        console.log(err);
    }
}

async function getSoup(url){
    // await driver.get(url);
    driver.get(url);
    console.log('1');
    let broth = await driver.getPageSource();
    console.log('2');
    console.log(broth);
    console.log('2b');
    console.log('title: ' + (await driver.getTitle()));
    console.log('2c');
    // console.log('current: ' + (await (await driver).getCurrentUrl()));

    // let soup = new JSSoup((await driver).getPageSource());
    let soup = new JSSoup(broth);

    // console.log(soup);
    return soup;
}






