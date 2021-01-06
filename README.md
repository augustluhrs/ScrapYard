# ScrapYard
testing playground for Matt Ross' scraping stuff

## YORB X 100Days 
- Scrape Instagram for each new post
- Store urls in database
- Pull from database to generate textures in YORB

### For new repos, need to add following
- databases/test.db
- hidden/students_hidden.js
- .env
    - ACCOUNT
    - PASSWORD
- might need to update chromedriver in package-lock to match your chrome version

### OoO for daily check
1. Open Instagram in Chromium
2. For Each User
    1. Check for new thumbnails (new post)
    2. add thumbnail url to A doc
    3. go to each new url
        1. grab img and vid links
        2. insert new B doc

### Database Structure
A) Overall docs (manually listing users in script incase students drop, and keeping in .env?):
- type 'A'
- username
- Class (KD, KC, other)
- Posts -- url array for each post

B) One doc per post, with the following fields: 
- type 'B'
- Class (KD, KC, other)
- Date (millis format for sorting?)
- Username
- Student Name
- postURL
- Links obj
    - imgs array
    - vids array


### TODO
- [ ] ask about FERPA
- [ ] find out if that device disconnect error matters
- [ ] find out about (headless?) running -- do i need chromium to open and if so, how to run daily?
- [ ] ip proxy or other ip protection?
- [X] add try/catch to all async functions
- [ ] caption text?
- [ ] get rid of blob from vid src
- [ ] figure out how to get all posts after a certain date

12/5 -- issue with run awaits not waiting and findElements not finding the thumbnail class -- need to investigate
