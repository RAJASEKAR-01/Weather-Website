import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import "./Wheather.css"
import windIcon from './images/wind.png'
import clearIcon from './images/clearsky.svg'
//import cloudIcon from '../images/cloud.png'
import drizzleIcon from './images/drizzle.svg'
import humidityIcon from './images/humidity.png'
import rainIcon from './images/rainy.svg'
import searchIcon from './images/search.png';
import snowIcon from './images/snow.png'
import sunIcon from './images/sunshine.svg'

const Weatherdetails=({icon,temp,city,country,lat,log,humidity,wind})=>{
  return (
    <>
      <div className="image">
        <img src={icon} alt="image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className='lat'>latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="icon" className='icon' />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="icon" className='icon' />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind speed</div>
          </div>
        </div>
      </div>
   </>
  )
}
Weatherdetails.propTypes={
  icon:PropTypes.string.isRequired,
  temp:PropTypes.number.isRequired,
  city:PropTypes.string.isRequired,
  country:PropTypes.string.isRequired,
  humidity:PropTypes.number.isRequired,
  lat:PropTypes.number.isRequired,
  log:PropTypes.number.isRequired,
  wind:PropTypes.number.isRequired,
}

export const Wheather = () => {
  const [icon,seticon]= useState(snowIcon);
  const [temp ,settemp]= useState(0);
  const [city,setcity] = useState('London')
  const [country,setcountry] = useState("GB")
  const [lat,setlat]=useState(0);
  const [log,setlog]=useState(0);
  const [humidity,sethumidty]=useState(0);
  const [wind,setwind]=useState(0);
  const [text,settext]=useState('London');
  const [citynotfound,setcitynotfound]=useState(false)
  const [loading,setloading]=useState(false);
  const [error,seterror]=useState(null)

  let apikey =`716ecd558f995f2566d3933acaee0528`;
  const weathericonMap ={
    "01d":sunIcon,
    "01n":sunIcon,
    "02d":sunIcon,
    "02n":sunIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":drizzleIcon,
    "04n":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10n":rainIcon,
    "10d":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon
  }
  const search= async ()=>{
  
    setloading(true);
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apikey}&units=Metric`;

    try{
        let res = await fetch(url);
        let data=await res.json();
        if(data.cod==404){
          console.log("city not found");
          setcitynotfound(true);
          setloading(false);
          return;
        }
        sethumidty(data.main.humidity);
        setwind(data.wind.speed);
        settemp(Math.floor(data.main.temp));
        setcity(data.name);
        setcountry(data.sys.country);
        setlat(data.coord.lat);
        setlog(data.coord.lon);
        const weathericoncode=data.weather[0].icon;
        seticon(weathericonMap[weathericoncode] || clearIcon)
    }
    catch(error){
      console.log(error.message);
      seterror("Network Error ")
  
    }
    finally{
      setloading(false)
    }
  }
  
  const handlecity =(e)=>{
    settext(e.target.value)


  }
  const handlekeydown=(e)=>{
    if(e.key=='Enter'){
      search();
    }
  }
  useEffect(function (){
    search();
  },[])
    return (
    <>
    <div className='container'>
        <div className="inputcontainer">
            <input type="text" placeholder='search-city' className='city-input' onChange={handlecity} value={text} onKeyDown={handlekeydown} />
            <div className="search-icon" onClick={()=>{search()}}>
                <img src={searchIcon} alt="search"  />
            </div>
        </div>
       {!loading && !citynotfound && <Weatherdetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}
        {loading && <div className='loadingmessage'>
          Loading...
        </div>}
        {error && <div className="errormessage">{error}</div>}
        {citynotfound && <div className="city-not-found">city not found</div>}
        

    </div>
    </>
  )
}
