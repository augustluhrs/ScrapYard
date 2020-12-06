//main scrape script to go through each instagram and grab links to imgs and vids
//inserts into database for use by YORB

/** OoO
1. Open Instagram in Chromium
2. For Each User
    1. Check for new thumbnails (new post)
    2. add thumbnail url to A doc
    3. go to each new url
        1. grab img and vid links
        2. insert new B doc 
*/

//database
// const Datastore = require('nedb');
const {AsyncNedb} = require('nedb-async');
var db = new AsyncNedb({filename: "databases/test.db", autoload: true});
// var db = new Datastore({filename: "databases/100Days_S21.db", autoload: true});

//.env -- not using for much now, but might be good for student privacy? FERPA violation?
const DotEnv = require('dotenv').config();
var username = process.env.ACCOUNT;
var password = process.env.PASSWORD;

//selenium -- not really sure what all this does
const Webdriver = require('selenium-webdriver'), By = Webdriver.By;
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
var driver = new Webdriver.Builder()
                 .withCapabilities(Webdriver.Capabilities.chrome())
                 .build();

// my modules
const ScrapeManager = require('./scrapeManager');
const Students = require('./students'); // list of usernames -- TODO: better way + privacy?


//main function
// login();
run();
// run().then((changes) => {
//     console.log("FINISHED -- changes: " + changes); //logs how many new posts were added, just for checking
// });


async function run(){
    try {
        await login();
        // console.log(await db.asyncCount({}));
        // console.log(await db.asyncFind({}));
        let aDocs = await update(); //updates all the A docs from db
        let changes = await scrape(aDocs); //goes through each username for new posts and updates the db
        // let changes = await scrape((await update())); //goes through each username for new posts and updates the db
        // return await scrape((await update())); //goes through each username for new posts and updates the db
        console.log("FINISHED -- changes: " + changes); //logs how many new posts were added, just for checking
    } catch (err) {
        console.log(err);
    }
}

async function update() {
    try {
        //check for new users and add to aDocs if not, and check for new posts
        
        // let aDocsBefore = await db.asyncFind({type: 'A'});

        for(let student of Students) {
            //get posts then either update or upsert the a doc corresponding to that username
            console.log('before');
            let posts = await ScrapeManager.getPosts(driver, student.username);
            await db.asyncUpdate({type: 'A', username: student.username}, {$set: {posts: posts}}, {upsert: true});
            console.log('after');           
            // console.log(student);
            // await db.asyncFind({type: 'A'}, async function (err, docs) { 
            //     if (err) {
            //         console.log(err);
            //     }
                //get posts then either update or upsert the a doc corresponding to that username
                // let posts = await ScrapeManager.getPosts(driver, student.username);
                // console.log(posts);
                // await db.asyncUpdate({type: 'A', username: student.username}, {$set: {posts: posts}}, {upsert: true});
                // console.log("top");
            // });
        }
        
        return await db.asyncFind({type: 'A'});
        //grab all adocs and return -- prob redundant but w/e
        // await db.asyncFind({type: 'A'}, function (err, docs) {
        //     if (err) {
        //         console.log(err);
        //     }
        //     console.log(docs);
        //     return docs;
        // });
    } catch (err) {
        console.log(err);
    }
}

async function login(){
    try {
        // await driver.get('https://www.instagram.com/accounts/login/?hl=en')
        await driver.get('https://www.instagram.com/accounts/login/?force_classic_login')

        console.log("opened insta");
        // await driver.sleep(1000000);
        // let body = await driver.findElement(By.css('body'));
        //_2hvTZ.pexuQ.zyHYP
        // console.log(await body.getAttribute('outerHTML'));
        // await driver.sleep(100000);
        // console.log("source" + (await driver.getPageSource()));
        // let inputs = await body.findElements(By.className('_2hvTZ pexuQ zyHYP'));
        // console.log(inputs);
        let usernameBox = await driver.findElement(By.name('username'));
        // console.log(usernameBox);
        // let usernameBox = inputs[0];
        // let passwordBox = inputs[1];
        // await driver.sleep(100000);

        let passwordBox = await driver.findElement(By.name('enc_password'));
        await usernameBox.sendKeys('100daysof_unmaking');
        await passwordBox.sendKeys('Inst333842?');
        console.log("account entered");
        let loginButton = await driver.findElement(By.className('button-green'));
        await loginButton.click();
        // await driver.sleep(100000);
        await driver.sleep(100);
    } catch (err) {
        console.log(err);
    }
}

async function scrape(aDocs) {
    console.log(aDocs);
    return 'hi';
}
