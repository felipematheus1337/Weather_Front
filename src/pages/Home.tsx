/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react"
import { useEffect } from "react"
import "./styles.css"
import moment from "moment"
import { FaLongArrowAltDown } from 'react-icons/fa';
import { FaLongArrowAltUp } from 'react-icons/fa';
import axios from "axios";
import Rainfall from 'react-rainfall-animation/src/Rain'

import nublado from "../assets/imgs/nublado.jpg";
import sol from "../assets/imgs/sol.jpg";
import chuva from "../assets/imgs/chuva.jpg";
import meionublado from "../assets/imgs/meionublado.jpg";
import tempestade from "../assets/imgs/tempestade.jpg";
import snow from "../assets/imgs/snow.jpg";

import Snowfall from 'react-snowfall'

import desc from "../assets/desc/desc.json";



interface dadosProps {
    estado: string;
    description: string;
    icon: string;
    temperatura: number;
    temperaturaMin: number;
    temperaturaMax: number;
    humidade: number;
    vento: number;
    data: Date;
    pais: string;
    cidade: string;
}

export function Home() {

    const [data, setData] = useState<dadosProps | undefined>()
    const [city, setCity] = useState<string>();
    const [lat, setLat] = useState<number>();
    const [lon, setLon] = useState<number>();
    const [toRain, setToRain] = useState<Boolean>(false);
    const [toSnow, setToSnow] = useState<Boolean>(false);
    
   


    useEffect(() => {
        getCoordenates();
        
        
    }, [])


   

    const getCoordenates = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setLat(pos.coords.latitude);
            setLon(pos.coords.longitude);
        })
    }

    
    useEffect(() => {
        getWeather();
    }, [lat, lon])
    


    const generateRainAndWallpaper = (desc: string) => {
        let body = document.getElementsByTagName('body')[0];
        if (desc.includes("rain") || desc.includes("drizzle")) {
            setToRain(true);
            body.style.background = `url(${chuva})`;
        } else if (desc.includes("snow")) {
            setToSnow(true);
            setToRain(false);
            body.style.background = `url(${snow})`;
        } else if (desc.includes("thunder")) {
            setToRain(true);
            body.style.background = `url(${tempestade})`;
        } else {
            body.style.background = `url(${generateCustomWallpaper(desc)})`;
        }

       
    }

    const generateCustomWallpaper = (des: string): string => {
        if (desc.wallpapers.clouds.some(item => item.first_desc === des)
            || desc.wallpapers.clouds.some(item => item.second_desc === des)) {
            setToRain(false);
            return nublado;
        } else if (desc.wallpapers.lowClouds.some(item => item.first_desc === des)
            || desc.wallpapers.lowClouds.some(item => item.second_desc === des)) {
            setToRain(false);
            return meionublado;
        } else {
            setToRain(false);
            return sol;
        }
    }

    




    const getWeather = async () => {
        if (lat && lon) {
            try {
             let BASE_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c27c8587b9c4ff2a9be200f4b1f7e501`
                const result = await (await axios.get(BASE_URL)).data;
             const weather = {
             estado: String(result.weather[0].main),
             description: String(result.weather[0].description),
             icon: `http://openweathermap.org/img/w/${result.weather[0].icon}.png`,
             temperatura: Number((result.main.temp - 273.15).toFixed(2)),
             temperaturaMin: Number((result.main.temp_min - 273.15).toFixed(2)),
             temperaturaMax: Number((result.main.temp_max - 273.15).toFixed(2)),
             humidade: Number(result.main.humidity),
             vento: Number(result.wind.speed),
             data: new Date(result.dt * 1000),
             pais: String(result.sys.country),
             cidade: String(result.name)
            } 
                setData(weather);
                generateRainAndWallpaper(weather.description)
            }catch (e) {
             console.log(e);
            }
        }
     
}

    const capitalLetter = (word: string) => {
        let firstChar = word.charAt(0).toUpperCase();
        return word.replace(`${firstChar.toLocaleLowerCase()}`, firstChar);

    }

    const getNewClimate = async () => {

        if (!city) {
            alert("Insert an City!")
        } 
        const newStr = city?.replaceAll(" ", "+")
        let BASE_URL = `https://api.openweathermap.org/data/2.5/weather?q=${newStr}&appid=c27c8587b9c4ff2a9be200f4b1f7e501`
        const result = await (await axios.get(BASE_URL)).data;
             const weather = {
             estado: String(result.weather[0].main),
             description: String(result.weather[0].description),
             icon: `http://openweathermap.org/img/w/${result.weather[0].icon}.png`,
             temperatura: Number((result.main.temp - 273.15).toFixed(2)),
             temperaturaMin: Number((result.main.temp_min - 273.15).toFixed(2)),
             temperaturaMax: Number((result.main.temp_max - 273.15).toFixed(2)),
             humidade: Number(result.main.humidity),
             vento: Number(result.wind.speed),
             data: new Date(result.dt * 1000),
             pais: String(result.sys.country),
             cidade: String(result.name)
        } 
        setData(weather);
        generateRainAndWallpaper(weather.description)
        
    }
    
    return (
        <div className="full">
            {toRain &&  <div id="Rain">
             <Rainfall  dropletsAmount={200}  />
            </div>}
            {toSnow && <Snowfall/>}
              <h1>Weather APP</h1>
            <div className="container">
                <input type="text" id="city" name="city" placeholder="City" onChange={(e) => setCity(e.target.value)} />
                <button onClick={getNewClimate}>Get Weather</button>
                </div>
                {data != null ?
                <div className="result">
                <h2>{data.cidade}, {data.pais}</h2>
                <h6>{moment(data.data).format('MMMM Do YYYY, h:mm a')}</h6>
                <p>{data.temperatura.toFixed(0)}ºC | {capitalLetter(data.description)}</p>
                <p><img src={data.icon} /></p>
                <p className="temps"><FaLongArrowAltDown/>{data.temperaturaMin.toFixed(0)}°C | <FaLongArrowAltUp/>{data.temperaturaMax.toFixed()}°C </p>
                </div> : null}
            
           
        </div>
    )
}