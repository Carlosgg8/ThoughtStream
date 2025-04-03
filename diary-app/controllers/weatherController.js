import dotenv from "dotenv";
dotenv.config();

export async function fetchWeather(city, country_code) {
    try {
        const apiKey = process.env.apikey;
        if (!apiKey) {
            console.error("API key is missing! Check your .env file.");
            return false;
        }

        // Fetch the weather data
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},${country_code}&appid=${apiKey}&units=imperial`
        );

        // Check if the response is successful
        if (!response.ok) {
            console.log("City or country code not found. Please try again.");
            return false;
        }

        // Parse the JSON data once
        const data = await response.json();

        // Check if the data is valid
        if (!data.weather || !data.main) {
            console.log("Invalid weather data received.");
            return false;
        }

        // Return weather information
        return {
            condition: data.weather[0].description,
            temperature: data.main.temp,
            location: data.name
        };

    } catch (error) {
        console.log("Error fetching weather data:", error);
        return false;
    }
}