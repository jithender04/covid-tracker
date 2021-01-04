import React,{useState,useEffect} from 'react';
import './App.css';
import  axios from "axios";
import Infoboxs from"./Infoboxs";
import Table from "./Table";
import Map from "./Map";
import {FormControl,Select,MenuItem, Card,CardContent} from "@material-ui/core";
import Linegraph from './Linegraph';
import numeral from "numeral";
import "leaflet/dist/leaflet.css";
function App() {
  const [countries, setcountries] = useState([])
  const [country,setcountry]=useState('worldwide')
  const[countryinfo,setcountryinfo]=useState({})
  const[tabledata,settabledata]=useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  useEffect(() => {
    /* below axios is used to fetch all countries in the select list*/
    axios.get("https://disease.sh/v3/covid-19/countries")
    .then(res=>{
      setcountries(res.data)
      setMapCountries(res.data) 
    })
    /* below axios is used to fetch the table data*/
    axios.get("https://disease.sh/v3/covid-19/countries")
    .then(res=>{
      // setcountries(res.data)
      settabledata(res.data)
    })
    /* below axios is used to fetch the information to display in infoboxs intially worldwide */
    axios.get( `https://disease.sh/v3/covid-19/all`)
    .then(res=>{
      setcountryinfo(res.data)
    })
  }, [])
  const onCountryChange=(e)=>{
    const countryname=e.target.value;
    setcountry(countryname);
    const url = countryname==='worldwide'?
    `https://disease.sh/v3/covid-19/all`
    :`https://disease.sh/v3/covid-19/countries/${countryname}`
    /* below axios is used to fetch the information to display in infoboxs for the selected country */
    axios.get(url)
    .then(res=>{
      setcountryinfo(res.data)
      countryname === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([res.data.countryInfo.lat, res.data.countryInfo.long]);
      countryname === "worldwide"
          ?setMapZoom(3):setMapZoom(5)
    })
  }
  const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";
  return (
    <div className="app">
      <div class="app__left">
        <div className="app__header">
          <h1>COVID19-TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) =>(
                  <MenuItem value={country.countryInfo.iso2}>{country.country}</MenuItem>
                ))
              } 
            </Select>
          </FormControl>
        </div>
        <div class="app__stats">
              <Infoboxs  onClick={(e) => setCasesType("cases")}
              title="Coronavirus Cases"
              active={casesType === "cases"} 
              cases={prettyPrintStat(countryinfo.todayCases)}
              total={prettyPrintStat(countryinfo.cases)} />
              <Infoboxs  onClick={(e) => setCasesType("recovered")}
               title="Recovered"
               active={casesType === "recovered"}
              cases={prettyPrintStat(countryinfo.todayRecovered)}
              total={prettyPrintStat(countryinfo.recovered)}  />
              <Infoboxs onClick={(e) => setCasesType("deaths")}
              title="Deaths"
              active={casesType === "deaths"}
              cases={prettyPrintStat(countryinfo.todayDeaths)}
              total={prettyPrintStat(countryinfo.deaths)}  />
        </div>
        <Map  countries={mapCountries}  casesType={casesType} center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className="app__right">
         <CardContent>
           <h3>Total Cases by Country</h3>
            <Table tableinfo={tabledata}/>
            <h3 className="app__title">Worldwide new {casesType}</h3>
            <Linegraph  className="app__graph"casesType={casesType}/>
         </CardContent>
      </Card>
    </div>
  );
}

export default App;
