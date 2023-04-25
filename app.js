const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const https = require("https");
const path = require('path');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const query = req.body.cityName;
  const appKey = "56a9824497027ca861b77b7687b079b4";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appKey + "&units=" + unit + "";

  https.get(url, function(response) {
    console.log(response.statusCode);
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);

      if (weatherData.message === "city not found") {
        res.render('error', {
          errorMessage: "City not found. Please try again."
        });
      } else {
        const weatherDescription = weatherData.weather[0].description;
        const temp = Math.round(weatherData.main.temp);
        const icon = weatherData.weather[0].icon;
        const windSpeed = Math.round(((weatherData.wind.speed) * 18) / 5);
        const humidity = Math.round(weatherData.main.humidity);
        const country = weatherData.sys.country;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        const main = weatherData.weather[0].main;
        console.log(main);

        const finalWeatherDescription = weatherDescription.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        const finalQuery = query.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

        res.render('weather', {
         windSpeed: windSpeed,
         humidity: humidity,
         country: country,
         city: finalQuery,
         temperature: temp,
         explain: finalWeatherDescription,
         image: imageURL,
         main: main
       });
     }
   });
 });
});


app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
