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
const DotEnv = require('dotenv').config(); //needs to be in same folder as index.js
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
// const Students = require('./students'); // list of usernames -- TODO: better way + privacy?
const Students = require('./hidden/students_hidden'); // list of usernames -- TODO: better way + privacy?


//main function
run();


async function run(){
    try {
        await login(); // log in -- only needed for private profiles
        let aDocs = await update(); //updates all the A docs from db
        let changes = await scrape(aDocs); //goes through each username for new posts and updates the db
        console.log("FINISHED -- changes: " + changes); //logs how many new posts were added, just for checking
    } catch (err) {
        console.log(err);
    }
}

async function update() {
    try {
        //check for new users and add to aDocs if not, and check for new posts
        for(let student of Students) {
            //get posts then either update or upsert the a doc corresponding to that username

            console.log("checking posts for: " + student.username);
            //get most recent thumbnail links
            let newestPosts = await ScrapeManager.getPosts(driver, student.username); 
            //get existing links in the db
            let studentDB = await db.asyncFind({type: 'A', username: student.username});
            // console.log(JSON.stringify(studentDB));
            let fullPosts = [];
            if (studentDB.length == 0) { //new student
                fullPosts = newestPosts;
                console.log('new db entry for: ' + student.username);
            } else {
                // let existingPosts = studentDB[0].posts; //doesn't really matter...
                fullPosts = studentDB[0].posts;
                let newCount = 0;
                for (let newPost of newestPosts) {
                    //if not already in posts array, add it
                    // if(!fullPosts.includes(newPost)){  //includes doesn't work async? needs to be for/of or use promise.all
                    let isNew = true;
                    for (let oldPost of fullPosts){
                        if (newPost == oldPost) {
                            isNew = false;
                        }
                     }   
                    if (isNew) {
                        fullPosts.push(newPost); //problem pushing to array thats currently iterating?
                        // console.log('ex: ' + existingPosts.length + " , full: " + fullPosts.length);
                        newCount++;
                    }
                }
                console.log(student.username + " had " + newCount + " new posts");
            }
            //update
            await db.asyncUpdate({type: 'A', username: student.username}, {$set: {posts: fullPosts}}, {upsert: true});
        }
        
        return await db.asyncFind({type: 'A'});
    } catch (err) {
        console.log(err);
    }
}

async function login(){
    try {
        console.log("logging in");
        // await driver.get('https://www.instagram.com/accounts/login/?hl=en')
        await driver.get('https://www.instagram.com/accounts/login/?force_classic_login') //can only find elements in classic for some reason
        console.log("opened insta");
        // let inputs = await body.findElements(By.className('_2hvTZ pexuQ zyHYP'));

        //find the username and password inputs and insert -- then click log in
        let usernameBox = await driver.findElement(By.name('username'));
        let passwordBox = await driver.findElement(By.name('enc_password'));
        await usernameBox.sendKeys(username);
        await passwordBox.sendKeys(password);
        console.log("account entered");
        let loginButton = await driver.findElement(By.className('button-green'));
        await loginButton.click();
        console.log("logged in");
        await driver.sleep(100);
    } catch (err) {
        console.log(err);
    }
}

async function scrape(aDocs) {
    console.log(aDocs);
    return 'hi';
}
