const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');


async function Com(state,city) {

    const url = `https://agriplus.in/mandi/${state}/${city}`;

    let commodities = [];

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        $('.card-wrapper').each(function (index, element) {
            const commodity = $(element).find('.card-body p').text();

            commodities.push({ commodity });
        });

        console.log(commodities);
        const data = JSON.stringify(commodities);

        fs.writeFile("commodity.json", data, () => {
            console.log("Success");
        });

    } catch (error) {
        console.error(error);
    }
}



module.exports = Com;