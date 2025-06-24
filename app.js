

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// POST Route

app.post('/weather', async (req, res) => {
  const city = req.body.city;
  const apiKey = "bca43f0ad9876761da79491b04f52608";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const forecast = response.data.list;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    let willRain = false;

    for (let item of forecast) {
      if (item.dt_txt.startsWith(tomorrowStr) && item.weather[0].main.toLowerCase().includes('rain')) {
        willRain = true;
        break;
      }
    }

    res.render('result', { city, willRain });

  } catch (error) {
  console.error("API ERROR:", error.response?.data || error.message);
  res.render('result', { city, willRain: null, error: "Unable to fetch data. Please try again." });
}
});