import { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { API_KEY, FORECAST_URL, WEATHER_URL } from "../config";
import './SearchComponent.css';

export default function SearchComponent({weather, setWeather, toggleTheme, isDarkMode, setForecast}){
    const [input, setInput] = useState("");
    const [cityNotFound, setCityNotFound] = useState(false);
    const [shortInput, setShortInput] = useState(false);

    const handleKeyPress = e => {
        if(e.key === "Enter") {
            if(input.length < 2) {
                setShortInput(true);
                setCityNotFound(false);
            }else {
                setShortInput(false);
                searchFunc(e)
            }
        }
    }


    const searchFunc = async (e) => {
        e.preventDefault();
        if(input.length < 2) {
            setShortInput(true);
            return
        }else {
            setShortInput(false);
        }
        setWeather({...weather, loading: true});
        setCityNotFound(false);

        const weatherUrl = `${WEATHER_URL}?q=${input}&appid=${API_KEY}&units=metric`;
        const forecastUrl = `${FORECAST_URL}?q=${input}&appid=${API_KEY}&units=metric`;

        try {
            const weatherRes = await fetch(weatherUrl);
            if(!weatherRes.ok) {
                throw new Error ("City not found");
            }
            const weatherData = await weatherRes.json();

            //Fetch 5-day forecast data
            const forecastRes  = await fetch(forecastUrl);
            if(!forecastRes.ok) {
                throw new Error ("Forecast data not found");
            }

            const forecastData = await forecastRes.json();
            //Set the current weather and 5-day forecast
            setWeather({data: weatherData, loading: false, error:false})
            setForecast(forecastData.list.filter((_, i) => i % 8 === 0));
            setCityNotFound(false);
        }catch(err){
            setWeather({...weather, data:{}, loading:false, error: true});
            setForecast([]);
            setCityNotFound(true);
            console.log("Error", err);
        }
    }

    return (
        <>
            <div className="SearchBox">
                <button
                 onClick={toggleTheme} 
                 className="theme-toggle-btn"
                >
                <i className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"}`} style={{ fontSize: "20px" }}></i>
                </button>

                <input 
                type="text"
                className="city-search"
                placeholder="Enter city name..."
                name="input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                />
                <button
                className="search-button"
                onClick={searchFunc}
                >
                     <i className="fas fa-search" style={{ fontSize: "20px" }}></i>
                </button>
            </div>

            {shortInput && input.length < 2 && (
                <div className="error-message">
                    <span>
                        Input is too short. Plese try again.
                    </span>
                </div>
            )}
            {cityNotFound && (
                <div className="error-message">
                    <span>
                        City not found. Please try another city.
                    </span>
                </div>
            )}
        
        </>
    )



}