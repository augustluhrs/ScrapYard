//just trying to clear up index.js
const Webdriver = require('selenium-webdriver'), By = Webdriver.By;

//go to user main page and get links to all individual posts from thumbnails
//TODO: limit by time incase they use personal profile
async function getPosts(driver, username) {
    try {
        await driver.get('https://instagram.com/' + username);
        await driver.sleep(50); //idk if needed, but paranoid

        //just first three for now
        let posts = [];
        let thumbnails = await driver.findElements(By.className('v1Nh3'));

        console.log("thumbnails: " + thumbnails.length);
        if(thumbnails.length != 0) {
            for (let thumbnail of thumbnails) {
                let a = await thumbnail.findElement(By.css('a'));
                // console.log('a' + a);
                let url = await a.getAttribute('href');
                // console.log('href: ' + url);
                posts.push(url);

                //need timestamp too... will have to do that from posts i think unless i go through img-alt text
            }
        }
        return posts; //just sends the urls, up to index.js to check/sort
    } catch (err) {
        console.log(err);
    }
}


//go to a specific post and return the img and vid links
async function getLinks(driver, url) {

}

module.exports.getPosts = getPosts;
module.exports.getLinks = getLinks;