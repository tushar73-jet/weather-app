import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv"; 
dotenv.config(); 

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;

app.get("/weather", async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: "Server error: API key not configured" });
  }

  const city = req.query.city;
  
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(data.cod).json({ error: data.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Server fetch error:", err); 
    res.status(500).json({ error: "Failed to fetch data from OpenWeatherMap" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));