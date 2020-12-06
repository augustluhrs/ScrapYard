//just trying to clear up index.js
const Webdriver = require('selenium-webdriver'), By = Webdriver.By;


//go to user main page and get links to all individual posts from thumbnails
//TODO: limit by time incase they use personal profile
async function getPosts(driver, username) {
    try {
        await driver.get('https://instagram.com/' + username);
        await driver.sleep(5); //idk if needed, but paranoid
        
        //just first three for now
        let posts = [];
        let thumbnails = await driver.findElements(By.className('v1Nh3.kIKUG._bz0w'));
        console.log(thumbnails.length);
        console.log('adkf ' + (await driver.findElements(By.className('v1Nh3 kIKUG  _bz0w'))));
        // for(let i = 0; i < 3; i ++) {
        //     let url = await thumbnails[i].findElement(By.partialLinkText('/p/'));
        //     posts.push(url);
        // }
        return posts;
    } catch (err) {
        console.log(err);
    }
}


//go to a specific post and return the img and vid links
async function getLinks(driver, url) {

}

module.exports.getPosts = getPosts;
module.exports.getLinks = getLinks;