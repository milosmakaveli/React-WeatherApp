import { useState, useEffect } from "react";
import './ForecastComponent.css';
import ReactAnimatedWeather from "react-animated-weather";

export default function ForecastComponent({ weather, forecastData, isDarkMode }) {
    const { data } = weather;
    const [isCelsius, setIsCelsius] = useState(() => {
        const storedUnit = localStorage.getItem("temperatureUnit");
        return storedUnit ? storedUnit === "celsius" : true; 
    });

    // Save the temperature unit to localstorage
    useEffect(() => {
        localStorage.setItem("temperatureUnit", isCelsius ? "celsius" : "fahrenheit");
    }, [isCelsius]);

    // Format the day 
    const formatDay = (dateString) => {
        const options = { weekday: "short" };
        const date = new Date(dateString * 1000); // Convert UNIX timestamp to JS Date
        return date.toLocaleDateString("en-US", options);
    };

    // Current date
    const getCurrentDate = () => {
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        const currentDate = new Date().toLocaleDateString("en-US", options);
        return currentDate;
    };

    const toggleTemperatureUnit = () => {
        setIsCelsius(prevState => !prevState);
    };


    const convertToFahrenheit = (temperature) => {
        return Math.round((temperature * 9) / 5 + 32);
    };

    // Render temperature based on unit
    const renderTemperature = (temperature) => {
        if (isCelsius) {
            return Math.round(temperature);
        } else {
            return convertToFahrenheit(temperature);
        }
    };

    // Set icon color based on dark mode
    const iconColor = isDarkMode ? "#ffffff" : "#000000";

    return (
        <div>
            <div className="city-name">
                <h2>
                    {data.name}, <span>{data.sys.country}</span>
                </h2>
            </div>
            <div className="date">
                <span>{getCurrentDate()}</span>
            </div>
            <div className="temp">
                {data.weather[0].icon && (
                    <img
                        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}  
                        alt={data.weather[0].description}
                        className="temp-icon"
                    />
                )}
                {renderTemperature(data.main.temp)}
                <sup className="temp-deg" onClick={toggleTemperatureUnit}>
                    {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
                </sup>
            </div>
            <p className="weather-des">{data.weather[0].description}</p>
            <div className="weather-info">
                <div className="col">
                    <ReactAnimatedWeather
                        color={iconColor}
                        animate={true}
                        icon="WIND"
                        size={40}
                    />
                    <div>
                        <p className="wind">{data.wind.speed}m/s</p>
                        <p>Wind</p>
                    </div>
                </div>
                <div className="col">
                    <ReactAnimatedWeather
                        color={iconColor}
                        animate={true}
                        icon="RAIN"
                        size={40}
                    />
                    <div>
                        <p className="humidity">{data.main.humidity}%</p>
                        <p>Humidity</p>
                    </div>
                </div>
            </div>
            <div className="forecast">
                <h3>5-Day Forecast:</h3>
                <div className="forecast-container">
                    {forecastData &&
                        forecastData.map((day, index) => (
                            <div className="day" key={index}>
                                <p className="day-name">{formatDay(day.dt)}</p>
                                {day.weather[0].icon && (
                                    <img
                                        className="day-icon"
                                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`}  
                                        alt={day.weather[0].description}
                                    />
                                )}
                                <p className="day-temperature">
                                    {renderTemperature(day.main.temp_min)}°/
                                    <span>{renderTemperature(day.main.temp_max)}°</span>
                                </p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
