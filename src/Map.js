import React from 'react'
import "./map.css"
import numeral from 'numeral'
import { MapContainer as LeafletMap,TileLayer,useMap,Circle,Popup } from "react-leaflet";
function ChangeMap({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }
const casesTypeColors = {
    cases: {
      multiplier: 270,
      option: { color:"#cc1034", fillColor: "#cc1034" },
    },
    recovered: {
      multiplier: 400,
      option: { color:"#7dd71d", fillColor: "#7dd71d" },
    },
    deaths: {
      multiplier: 800,
      option: { color:"#000000", fillColor: "#000000" }
    },
  };

 const showDataOnMap = (data, casesType) =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      pathOptions={casesTypeColors[casesType].option}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
          <strong>Cases</strong>: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
          <strong>Recovered</strong>: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            <strong>Deaths:</strong> {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
function Map({countries,casesType,center,zoom}) {
    return (
        <div className="map">     
            <LeafletMap >
                <ChangeMap center={center} zoom={zoom} />
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                ></TileLayer>

                {showDataOnMap(countries,casesType) }
            </LeafletMap>
        </div>
    )
}

export default Map
