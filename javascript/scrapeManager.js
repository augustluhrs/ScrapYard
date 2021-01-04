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
async function getLinks(driver, postURL) {
    try {
        await driver.get(postURL);
        await driver.sleep(50); //idk if needed, but paranoid

        // let links = {} //array of objects or object of two arrays?
        //from buttonTest:
        // let parentElement = await driver.findElement(By.className('vi798')); //holder of just the links in the main post
        let parentElement = await driver.findElement(By.className('ltEKP')); //higher up in main, just for top
        let hasFinished = false;
        let links = {imgs: [], vids: []};
        let buttonExists = false;
        let button = await driver.findElements(By.className('_6CZji')); //findElement err vs findElements empty
        if (button.length != 0) {buttonExists = true};
        while(!hasFinished) {
            hasFinished = true;
            let imgsFinished = true;
            let vidsFinished = true;

            //check for imgs
            let allImgs = await parentElement.findElements(By.className('FFVAD'));
            // if (allImgs != undefined) { //only if has images
                for (let l of allImgs) {
                    let s = await l.getAttribute('src');
                    // console.log(s);
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
            // }
            
            //check for vids
            let allVids = await parentElement.findElements(By.className('tWeCl'));
            // if (allImgs != undefined) { //only if has vids
                for (let l of allVids) {
                    let s = await l.getAttribute('src');
                    // console.log(s);
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
            // }

            //if not done, click button
            if(!imgsFinished || !vidsFinished) {hasFinished = false}
            if(!hasFinished && buttonExists) {await button[0].click()}; //needs buttonCheck
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




        //date -- class _1o9PC Nzb55
        let dateElement = await driver.findElement(By.className('_1o9PC Nzb55')) //space okay?
        let date = await dateElement.getAttribute('datetime');

        return [links, date];    
    } catch (err) {
        console.log(err);
    }
}

module.exports.getPosts = getPosts;
module.exports.getLinks = getLinks;