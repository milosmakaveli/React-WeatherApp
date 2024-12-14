import { useEffect, useState } from "react";
import './WeatherAppComponent.css';
import { API_KEY, WEATHER_URL, FORECAST_URL } from "../config";
import SearchComponent from "./SearchComponent";
import ForecastComponent from "./ForecastComponent";


export default function WeatherAppComponent() {
    const [weather, setWeather] = useState({
        data: {},
        loading: true,
        error: false
    })
    const [forecastData, setForecastData] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme === 'dark' : true;
    });


    //Fetch data for the default location 
    useEffect(() => {
        const fetchData = async () => {
            const city = 'Belgrade';
            const weatherUrl = `${WEATHER_URL}?q=${city}&appid=${API_KEY}&units=metric`;
            const forecastUrl = `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`;
            try {
                const weatherRes = await fetch(weatherUrl);
                const weatherData = await weatherRes.json();

                const forecastRes = await fetch(forecastUrl);
                const forecastData = await forecastRes.json();

                //Set the data for current weather and 5-day forecast
                setWeather({ data: weatherData, loading: false, error: false });
                setForecastData(forecastData.list.filter((_, i) => i % 8 === 0));
            } catch (err) {
                setWeather({ ...weather, data: {}, loading: false, error: true });
                setForecastData([]);
                console.log("Error while fetching data", err);
            }
        }
        fetchData();
    }, [])


    //Toggle Dark/Light theme
    const toggleTheme = () => {
        setIsDarkMode(prevState => !prevState);
    }

    //Apply theme
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark-mode");
            document.body.classList.remove("light-mode");
        } else {
            document.body.classList.add("light-mode");
            document.body.classList.remove("dark-mode");
        }
    }, [isDarkMode]);

    //Save theme in localstorage
    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);


    return (
        <div className="container">
            <SearchComponent
                weather={weather}
                setWeather={setWeather}
                setForecast={setForecastData}
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode} 
            />
            {weather.loading && <h3 className="loading-message">Loading...</h3>}
            {!weather.loading && !weather.error && (
                <ForecastComponent 
                weather={weather} 
                forecastData={forecastData} 
                isDarkMode={isDarkMode} 
            />
            )}
        </div>
    )
}