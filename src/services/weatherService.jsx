import { DateTime } from "luxon";

const API_KEY=  "1fa9ff4126d95b8db54f3897a208e91c";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });
 console.log(url);
  return fetch(url).then((res) => res.json());
  
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};






const formatForecastWeather = (data) => {
  // if (!data || !data.timezone || !data.daily || !data.hourly) {
  //   // Handle the case where the expected properties are missing
  //   return { timezone: "", daily: [], hourly: [] };
  // }

  let { timezone, daily, hourly } = data;

  // Check if daily and hourly arrays exist and have the expected structure
  if (Array.isArray(daily) && Array.isArray(hourly) && daily.length >= 6 && hourly.length >= 6) {
    daily = daily.slice(1, 6).map((d) => {
      return {
        title: formatToLocalTime(d.dt, timezone, 'ccc'),
        temp: d.temp.day,
        icon: d.weather[0].icon,
      };
    });

    hourly = hourly.slice(1, 6).map((d) => {
      return {
        title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
        temp: d.temp,
        icon: d.weather[0].icon,
      };
    });
  } else {
    // Handle the case where the expected arrays are missing or have unexpected structure
    return { timezone, daily: [], hourly: [] };
  }

  return { timezone, daily, hourly };
};





  const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData(
      "weather",
      searchParams
    ).then(formatCurrentWeather);

 const {lat ,lon} = formattedCurrentWeather;

 const formattedForecastWeather = await getWeatherData("onecall", {

  lat, lon, 
  exclude : 'current,minutely,alerts' ,
   units: searchParams.units,
 }).then(formatForecastWeather);

     return { ...formattedCurrentWeather, ...formattedForecastWeather };
    };

    const formatToLocalTime = (
      secs,
      zone,
      format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
    ) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);


    const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

    export default getFormattedWeatherData;

    export {formatToLocalTime ,iconUrlFromCode};