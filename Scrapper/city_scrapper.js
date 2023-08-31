const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');


async function cityScrapper(state) {
    
const url = `https://agriplus.in/mandi/${state}`;

let cities= [];

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        $('.card-wrapper').each(function (index, element) {
            const city  = $(element).find('.card-body p').text();
    
            cities.push({city});
        });

         console.log(cities);
         const data = JSON.stringify(cities);

        
        fs.writeFile("city.json", data, () => {
            console.log("Success scrapper");
        });
        
    } catch (error) {
        console.error(error);
    }
}

module.exports = cityScrapper;





