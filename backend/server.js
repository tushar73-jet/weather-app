import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const API_KEY = "03489d453cb0ed71b0ca24e89219a457";

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.json({ error: "City is required" });

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) return res.json({ error: data.message });

    res.json(data);
  } catch (err) {
    res.json({ error: "Failed to fetch data from OpenWeatherMap" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
