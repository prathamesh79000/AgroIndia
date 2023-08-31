const express = require("express");
const path = require('path');
const hbs = require('hbs');
const cheerio = require('cheerio');
const fs = require("fs");
const Scrapi = require("../Scrapper/news_scrapper.js");
const Com = require("../Scrapper/com_scrapper.js");
const cityScrapper = require("../Scrapper/city_scrapper.js");
const priceScrapper = require("../Scrapper/price_scrapper.js");

const app = express();




var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const { parse } = require("csv-parse");
app.engine('handlebars', handlebars.engine);
const requests = require("request");
const math = require("mathjs");
const mongoose = require('mongoose');
app.use(express.urlencoded({ extended: false }));
const { body, validationResult } = require('express-validator');
let user1;
const kiran = () => {
  user1 = null;
}
const fertilizer_dic = {
  'NHigh': "The N value of soil is high and might give rise to weeds. Please consider the following suggestions: 1. Manure  – adding manure is one of the simplest ways to amend your soil with nitrogen. Be careful as there are various types of manures with varying degrees of nitrogen. 2. Coffee grinds – use your morning addiction to feed your gardening habit! Coffee grinds are considered a green compost material which is rich in nitrogen. Once the grounds break down, your soil will be fed with delicious, delicious nitrogen. An added benefit to including coffee grounds to your soil is while it will compost, it will also help provide increased drainage to your soil. 3. Plant nitrogen fixing plants – planting vegetables that are in Fabaceae family like peas, beans and soybeans have the ability to increase nitrogen in your soil  4. Plant ‘green manure’ crops like cabbage, corn and brocolli  5 . Use mulch (wet grass) while growing crops  - Mulch can also include sawdust and scrap soft woods.",
  'Nlow': "The N value of your soil is low. Please consider the following suggestions: 1. Add sawdust or fine woodchips to your soil – the carbon in the sawdust/woodchips love nitrogen and will help absorb and soak up and excess nitrogen. 2. Plant heavy nitrogen feeding plants  – tomatoes, corn, broccoli, cabbage and spinach are examples of plants that thrive off nitrogen and will suck the nitrogen dry. 3. Water  – soaking your soil with water will help leach the nitrogen deeper into your soil, effectively leaving less for your plants to use. 4. Sugar – In limited studies, it was shown that adding sugar to your soil can help potentially reduce the amount of nitrogen is your soil. Sugar is partially composed of carbon, an element which attracts and soaks up the nitrogen in the soil. This is similar concept to adding sawdust/woodchips which are high in carbon content. 5. Add composted manure to the soil. 6. Plant Nitrogen fixing plants like peas or beans. 7. Use NPK fertilizers with high N value. 8. Do nothing  – It may seem counter-intuitive, but if you already have plants that are producing lots of foliage, it may be best to let them continue to absorb all the nitrogen to amend the soil for your next crops.",
  'PHigh': "The P value of your soil is high.  Please consider the following suggestions: 1. Avoid adding manure  – manure contains many const key nutrients for your soil but typically including high levels of phosphorous. Limiting the addition of manure will help reduce phosphorus being added. 2. Use only phosphorus-free fertilizer – if you can limit the amount of phosphorous added to your soil, you can let the plants use the existing phosphorus while still providing other const key nutrients such as Nitrogen and Potassium. Find a fertilizer with numbers such as 10-0-10, where the zero represents no phosphorous. 3. Water your soil – soaking your soil liberally will aid in driving phosphorous out of the soil. This is recommended as a last ditch effort. 4. Plant nitrogen fixing vegetables to increase nitrogen without increasing phosphorous (like beans and peas). 5. Use crop rotations to decrease high phosphorous levels",
  'Plow': "The P value of your soil is low. Please consider the following suggestions: 1. Bone meals – a fast acting source that is made from ground animal bones which is rich in phosphorous. 2. Rock phosphate  – a slower acting source where the soil needs to convert the rock phosphate into phosphorous that the plants can use. 3. Phosphorus Fertilizers – applying a fertilizer with a high phosphorous content in the NPK ratio (example: 10-20-10, 20 being phosphorous percentage). 4. Organic compost  – adding quality organic compost to your soil will help increase phosphorous content. 5. Manure – as with compost, manure can be an excellent source of phosphorous for your plants. 6. Clay soil  – introducing clay particles into your soil can help retain & fix phosphorus deficiencies. 7. Ensure proper soil pH  – having a pH in the 6.0 to 7.0 range has been scientifically proven to have the optimal phosphorus uptake in plants. 8. If soil pH is low, add lime or potassium carbonate to the soil as fertilizers. Pure calcium carbonate is very effective in increasing the pH value of the soil. 9. If pH is high, addition of appreciable amount of organic matter will help acidify the soil. Application of acidifying fertilizers, such as ammonium sulfate, can help lower soil pH",
  'KHigh': "The K value of your soil is high .  Please consider the following suggestions: 1.Loosen the soil deeply with a shovel, and water thoroughly to dissolve water-soluble potassium. Allow the soil to fully dry, and repeat digging and watering the soil two or three more times. 2.Sift through the soil, and remove as many rocks as possible, using a soil sifter. Minerals occurring in rocks such as mica and feldspar slowly release potassium into the soil slowly through weathering. 3. Stop applying potassium-rich commercial fertilizer. Apply only commercial fertilizer that has a '0' in the final number field. Commercial fertilizers use a three number system for measuring levels of nitrogen, phosphorous and potassium. The last number stands for potassium. Another option is to stop using commercial fertilizers all together and to begin using only organic matter to enrich the soil. 4. Mix crushed eggshells, crushed seashells, wood ash or soft rock phosphate to the soil to ad d calcium. Mix in up to 10 percent of organic compost to help amend and balance the soil. 5.Use NPK fertilizers with low K levels and organic fertilizers since they have low NPK values. 6. Grow a cover crop of legumes that will fix nitrogen in the soil. This practice will meet the soil’s needs for nitrogen without increasing phosphorus or potassium.",
  'Klow': "The K value of your soil is low. Please consider the following suggestions:  1. Mix in muricate of potash or sulphate of potash. 2. Try kelp meal or seaweed  3. Try Sul-Po-Mag  4. Bury banana peels an inch below the soils surface 5. Use Potash fertilizers since they contain high values potassium"
}

mongoose.connect('mongodb://localhost:27017/Kiru', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const loginSchema = new mongoose.Schema({
  username: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  password: String,
  cpassword: String
});
const Toy = new mongoose.model('Toy', loginSchema);



app.get('/login', (req, res) => {
  res.render("login")
})

app.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const result = await Toy.find({ email: req.body.email })
    user1 = result[0].username;
    // console.log(result)
    if (result[0].password === req.body.password) {
      res.status(201).render("indexlogout", { user: user1 });
    } else {
      const arr3 = [{ msg: "Invalid Credentials..." }]
      res.render("login", { alerto: arr3 });
    }
  }
  catch (err) {
    const arr4 = [{ msg: "Invalid Credentials..." }]
    res.render("login", { alerto: arr4 });
  }
})
app.get('/signup', (req, res) => {
  res.render("signup")
})
app.post('/signup', [
  body('email', 'Email not valid').isEmail(), body('username', 'Username must be atleast 4 char...').isLength({ min: 4 }), body('password', 'Password must be atleast 6 char...').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req).array();
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    const lp = errors.length;
    if (lp === 0) {
      if (password === cpassword) {
        const userName = new Toy({
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          cpassword: req.body.cpassword
        });
        const result = await userName.save();
        return res.render("login")
      }
      else {
        errors.push({ msg: "Password not mathching.." })
        return res.render('signup', { alerto: errors })
      }
    }
    else {
      console.log("hooo");
      if (password === cpassword) {

        // errors.push({ msg: "Password not mathching.." })

        // const result1 = await userName1.save();
        return res.render('signup', { alerto: errors })
      }
      else {
        errors.push({ msg: "Password not mathching.." })
        return res.render('signup', { alerto: errors })
      }
    }
  }
  catch (err) {
    if (err.keyPattern.email === 1) {
      const error4 = [{ msg: "Email has already taken.." }];
      return res.render('signup', { alerto: error4 })
    }
    else { return res.status(200).send(err) }
  }
})

app.get('/fertilizer-predict', (req, res) => {
  console.log("hello pratik");
  res.render("fertilizer", { user: user1 });
})

app.post('/fertilizer-predict', async (req, res) => {
  try {
    const crop_name = req.body.cropname
    const N = req.body.nitrogen
    const P = req.body.phosphorous
    const K = req.body.pottasium
    fs.createReadStream('C:\\Users\\ASUS\\OneDrive\\Desktop\\AgroIndia\\public\\css\\fertilizer.csv')
      .pipe(parse({ delimiter: ",", from_line: 1 }))
      .on("data", (row) => {
        // console.log(row)
        if (row[1] === crop_name) {
          const nr = Number(row[2])
          const pr = Number(row[3])
          const kr = Number(row[4])
          const n = nr - N
          const p = pr - P
          const k = kr - K
          const n1 = math.abs(nr - N)
          const p1 = math.abs(pr - P)
          const k1 = math.abs(kr - K)
          const kiru = math.max(n1, p1, k1)
          console.log("n = ", n)
          console.log("p = ", p)
          console.log("k = ", k)
          console.log("max = ", kiru)
          let max_value;
          let key;
          if (kiru === n1) {
            max_value = "N"
          }
          else if (kiru === p1) {
            max_value = "P"
          }
          else {
            max_value = "K"
          }
          console.log(max_value)
          switch (max_value) {
            case "N": {
              if (n < 0) { key = 'NHigh' }
              else { key = "Nlow" }
              break
            }
            case "P": {
              if (p < 0) { key = 'PHigh' }
              else { key = "Plow" }
              break
            }
            case "K": {
              if (k < 0) { key = 'KHigh' }
              else { key = "Klow" }
              break
            }
            default:
              console.log('hello kiru')
          }
          const response = fertilizer_dic[key]
          res.render('fertilizer-result', { result: response, user: user1 });
        }
      })
      .on("error", function (error) {
        console.log(error.message);
      });
  }
  catch (err) {
    res.status(400).send("invalid....")
  }
})










app.use(express.json());
app.use('/public', express.static(path.join(__dirname, "../public")));
app.use('/images', express.static(path.join(__dirname, '../public/images')));


const port = 3001;
const locat = path.join(__dirname, '../public');
const party = path.join(__dirname, '../public/components');

hbs.registerPartials(party);

app.set('view engine', 'hbs');
app.set('views', locat);
app.set('partials', party);



app.get("/", (req, res) => {

  Scrapi();
  if (user1) {
    res.render("indexlogout", { user: user1 });
  } else { res.render("index"); }

});

app.post("/", (req, res) => {

  Scrapi();
  kiran();
  res.render("index");
});

app.get('/login', (req, res) => {
  res.render("login")
})

app.get("/tools", (req, res) => {
  Scrapi();
  res.render("tools", { user: user1 });
});


app.get("/news", (req, res) => {
  res.render("news", { user: user1 });
});


app.get("/marketprices", (req, res) => {
  res.render("market", { user: user1 });
});





var mystate;

app.post("/city", (req, res) => {

  let state = req.body.state;

  mystate = state.split(" ").join("-").toLowerCase();
  console.log(mystate);

  cityScrapper(mystate);

  var city3;

  function populatecity() {
    const city2 = fs.readFileSync(path.join(__dirname, "../city.json"), "utf-8");
    city3 = JSON.parse(city2);
    console.log(city3);
  };

  setTimeout(() => {
    populatecity();
  }, 2000);


  setTimeout(() => {
    res.render("city", { city3: city3, user: user1 });
  }, 3000);

});






var commodity3;
var mycity;

app.post("/commoditymid", (req, res) => {

  let city = req.body.city;
  mycity = city.split(" ").join("-").toLowerCase();
  console.log(mycity);
  console.log(mystate);

  Com(mystate, mycity);

  function populatecom() {
    const commodity2 = fs.readFileSync(path.join(__dirname, "../commodity.json"), "utf-8");
    commodity3 = JSON.parse(commodity2);
    console.log(commodity3);
  };

  setTimeout(() => {
    populatecom();
    console.log("populated");
  }, 2000);

});




var myprice;

app.post("/pricesmid", (req, res) => {

  let item = req.body.item;
  const product = item.split(" ").join("-").toLowerCase();
  console.log(product);

  priceScrapper(mystate, mycity, product);

  function populateTable() {
    const product2 = fs.readFileSync(path.join(__dirname, "../prices.json"), "utf-8");
    myprice = JSON.parse(product2);
    console.log(myprice);
  };

  setTimeout(() => {
    populateTable();
    console.log("populated the table");
  }, 2000);

});




app.get("/commodity", (req, res) => {
  setTimeout(() => {
    res.render("commodity", { commodity3: commodity3, user: user1 });

  }, 4000);
});


app.get("/prices", (req, res) => {
  setTimeout(() => {
    res.render("prices", { myprice: myprice, user: user1 });

  }, 4000);
});


app.get("*", (req, res) => {
  res.status(404).send('Page Not Found');
});





// -----------------------------------------------------------------------------------------------------------------------------------------




app.listen(port, () => {
  console.log(`The app is running on port ${port}`)
});


