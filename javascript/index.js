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
const Datastore = require('nedb');
var db = new Datastore({filename: "databases/test.db", autoload: true});
// var db = new Datastore({filename: "databases/100Days_S21.db", autoload: true});

//.env -- not using for now, but might be good for student privacy? FERPA violation?
// const DotEnv = require('dotenv').config();

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
run();

async function run(){
    try {
        // let aDocs = await update(); //updates all the A docs from db
        // let changes = await scrape(aDocs); //goes through each username for new posts and updates the db
        let changes = await scrape((await update())); //goes through each username for new posts and updates the db
        console.log("FINISHED -- changes: " + changes); //logs how many new posts were added, just for checking
    } catch (err) {
        console.log(err);
    }
}

async function update() {
    try {
        //check for new users and add to aDocs if not, and check for new posts
        for(let student of Students) {
            db.find({type: 'A'}, async function (err, docs) { //do i need an await here?
                if (err) {
                    console.log(err);
                }
                //get posts then either update or upsert the a doc corresponding to that username
                let posts = await ScrapeManager.getPosts(driver, student.username);
                db.update({type: 'A', username: student.username}, {$set: {posts: posts}}, {upsert: true});
            });
        }
        //grab all adocs and return -- prob redundant but w/e
        db.find({type: 'A'}, function (err, docs) {
            if (err) {
                console.log(err);
            }
            return docs;
        });
    } catch (err) {
        console.log(err);
    }
}

async function scrape(aDocs) {
    console.log(aDocs);
    return 'hi';
}
