const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function Scrapi() {

    const url = " https://economictimes.indiatimes.com/News/economy/agriculture?from=mdr";

    let News = [];

    try {

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        console.log(typeof (response.data))

        $('.eachStory').each(function (index, element) {
            const title = $(element).find(' h3 a').text();
            const content = $(element).find('p').text();
            const image = $(element).find('.imgContainer img ').attr('data-original');
            const time = $(element).find('time').text();

            let myurl ="https://economictimes.indiatimes.com/";
            const url= $(element).find(' h3 a').attr('href');
            myurl = myurl.concat(url);
            

            News.push({ title, content, image, time,myurl});
        });


        const Stories = JSON.stringify(News);
        fs.writeFile("files/story.json", Stories, () => {
            console.log("Success story");
        });




        function Pratik() {

        let result = " ";

            for (let element of News) {

                result += `<div class="container">

          <div class="imgContainer">
              <img  id="articleImage" src=${element.image}
                  class="newsImage" alt="...">
          </div>

          <div class="card-body">
              <h5 id="articleTitle" style="font-size: 1.5rem; margin: 16px;">${element.title}</h5>
              <p id="articleContent" class="card-text">${element.content}</p>
              <p><small id="articleTime" class="time">${element.time}</small></p>
              <button class="read-more "><a href=${element.myurl} target="_blank">Read More</a></button>
          </div>

          </div>`
            }
        
    
        const $ = cheerio.load(result, null, false);
        let arr = $.html();

        const mypath = path.join(__dirname, '../public/components/newsitem.hbs');
        console.log(mypath);

       
        fs.writeFileSync(mypath, arr);
        
    }

    Pratik();

    

    } catch (error) {
        console.error(error);
    }

}

module.exports = Scrapi;


