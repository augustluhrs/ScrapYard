//just trying to clear up index.js
const Webdriver = require('selenium-webdriver'), By = Webdriver.By;

//beautiful soup
// var JSSoup = require('jssoup').default;

//go to user main page and get links to all individual posts from thumbnails
//TODO: limit by time incase they use personal profile
async function getPosts(driver, username) {
    try {
        // console.log('wtf');
        await driver.get('https://instagram.com/' + username);
        await driver.sleep(50); //idk if needed, but paranoid
        
        //soup test
        // var soup = new JSSoup(driver.)

        //just first three for now
        let posts = [];
        // let thumbnails = await driver.findElements(By.className('v1Nh3.kIKUG._bz0w'));
        // console.log(thumbnails.length);
        // console.log('adkf ' + (await driver.findElements(By.className('v1Nh3 kIKUG  _bz0w'))));
        // let thumbnails = await driver.findElements(By.className('v1Nh3 kIKUG  _bz0w'));
        let thumbnails = await driver.findElements(By.className('v1Nh3'));

        // console.log('current: ' + await driver.getCurrentUrl());
        console.log(thumbnails.length);
        let url;
        if(thumbnails.length != 0) {
            // url = await thumbnails[0].findElement(By.partialLinkText('/p/'));
            let a = await thumbnails[0].findElement(By.css('a'));
            console.log('a' + a);
            url = await a.getAttribute('href');
            console.log('href: ' + url);
            
            posts.push(url);
        }
        // for(let i = 0; i < 3; i ++) {
        //     let url = await thumbnails[i].findElement(By.partialLinkText('/p/'));
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