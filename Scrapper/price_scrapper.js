const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

async function priceScrapper(state,city,item) {

    const url = `https://agriplus.in/mandi/${state}/${city}/${item}`;

    Data = [];

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);


        $('tbody tr').each(function (index, element) {
            const PRICE_DATE = $(element).find('td:nth-child(1)').text();
            const COMMODITY_TRADED = $(element).find('td:nth-child(2)').text();
            const COMMODITY_ARRIVALS = $(element).find('td:nth-child(3)').text();
            const MIN_PRICE = $(element).find('td:nth-child(4)').text();
            const MAX_PRICE = $(element).find('td:nth-child(5)').text();


            Data.push({ PRICE_DATE, COMMODITY_TRADED, COMMODITY_ARRIVALS, MIN_PRICE, MAX_PRICE });
        });

        const Prices = JSON.stringify(Data);
        fs.writeFile("prices.json", Prices, () => {
            console.log("Success");

        })

    } catch (error) {
        console.error(error);
    }
}

module.exports = priceScrapper;
