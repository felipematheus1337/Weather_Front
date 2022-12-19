/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react"
import { useEffect } from "react"
import "./styles.css"
import dados from "../dados.json";
import moment from "moment"
import { FaLongArrowAltDown } from 'react-icons/fa';
import { FaLongArrowAltUp } from 'react-icons/fa';
import axios from "axios";


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
    
    var teste;
   


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
    },[lat,lon])



    const getWeather = async () => {
        if (lat && lon) {
            try {
             let BASE_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c27c8587b9c4ff2a9be200f4b1f7e501`
             const result = await(await axios.get(BASE_URL)).data;
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
                console.log(data);
            }catch (e) {
             console.log(e);
            }
        }
     
}

    console.log(data);

    const capitalLetter = (word: string) => {
        let firstChar = word.charAt(0).toUpperCase();
        return word.replace(`${firstChar.toLocaleLowerCase()}`, firstChar);

    }

    const getNewClimate = () => {
        if (!city) {
            alert("Insert an City!")
        } else {

        }

    }
    
    return (
        <div className="full">
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