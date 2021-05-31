import { useEffect, useState } from "react";
import h337 from "heatmap.js";
import { fetchDataList } from "../api/robot";
import wifiBornes from '../repos/wifiBornes.json';

import "./HeatMap.css";

let points = [];
let heatmapInstance = undefined;

const mapData =  {
  pingPong: {
    x: 820, // x coordinate of the datapoint, a number
    y: 470, // y coordinate of the datapoint, a number
    value: 10, // the value at datapoint(x, y)
    ssid:""
  }, 
  amphi1: {
    x: 680, // x coordinate of the datapoint, a number
    y: 300, // y coordinate of the datapoint, a number
    value: 10, // the value at datapoint(x, y)
    ssid:""
  },
  amphi2: {
    x: 715, // x coordinate of the datapoint, a number
    y: 350, // y coordinate of the datapoint, a number
    value: 10, // the value at datapoint(x, y)
    ssid:""
  },
  escaliers: {
    x: 650, // x coordinate of the datapoint, a number
    y: 250, // y coordinate of the datapoint, a number
    value: 10, // the value at datapoint(x, y)
    ssid:""
  },
  parkingSup: {
    x: 550, // x coordinate of the datapoint, a number
    y: 100, // y coordinate of the datapoint, a number
    value: 10, // the value at datapoint(x, y)
    ssid:""
  },
  parkingInf: {
    x: 700, // x coordinate of the datapoint, a number
    y: 590, // y coordinate of the datapoint, a number
    value: 10, // the value at datapoint(x, y)
    ssid:""
  },
  salleTD: {
    x: 650, // x coordinate of the datapoint, a number
    y: 410, // y coordinate of the datapoint, a number
    value: 10, // the value at datapoint(x, y)
    ssid:""
  },
}

const getClosestAP = (dataList) => {
    let start = {
      rssi: 999,
    };

    Object.keys(dataList).forEach((key) => {
      if(dataList[key] < start.rssi && key !== '_id' && key !== 'jupiterID' && key !== 'temp' && key !=='date' ) {
        start = {
          bssid: key,
          rssi: dataList[key]
        }
      }
    });
  return start;
};

const getLocationFromAP = (ap) => {
  const bornes = wifiBornes.locations;
  const foundBornes = [];
  bornes.forEach((borne) => {
    Object.keys(borne.wifiRSSI).forEach((bssid) => {
      if(bssid === ap.bssid) {
        foundBornes.push({
          rssi: borne.wifiRSSI[bssid],
          bssid,
          location: borne.locationName,
        });
      }
    })
  });
  return foundBornes;
}

function HeatMap() {
  const [dataList, setDataList] = useState([]);
  const [estimatedPosition, setEstimatedPosition] = useState(undefined);
  
  const handleFetchList = async () => {
    const { data } = await fetchDataList();
    setDataList(data)
  }

  useEffect(() => {
    handleFetchList();
  }, []);

  useEffect(() => {
    heatmapInstance = h337.create({
      // only container is required, the rest will be defaults
      container: document.querySelector('.HeatMap')
    }, []);

    dataList.forEach((data) => {
      const closest = getClosestAP(data);
      const foundBornes = getLocationFromAP(closest);
      if (foundBornes.length === 0) {
        setEstimatedPosition('Unknown');
      } else if (foundBornes.length === 1) {
        const estimated = {
          x: mapData[foundBornes[0].location.toLowerCase()].x,
          y: mapData[foundBornes[0].location.toLowerCase()].y,
        }
        setEstimatedPosition(foundBornes[0].location);
        points.push(estimated);
      } else {
        let x = 0;
        let y = 0;
        let closestAP = foundBornes[0];
        foundBornes.forEach((pos) => {
          x = mapData[pos.location.toLowerCase()].x;
          y = mapData[pos.location.toLowerCase()].y;
          if (pos.rssi < closestAP.rssi) {
            closestAP = pos;
          }
        });
        const estimated = {
          x: x / foundBornes.length,
          y: y / foundBornes.length,
        }

        points.push({
          ...estimated,
          value: data.temp,
        })
        setEstimatedPosition(closestAP.location);
      }
      console.log("poitns:",points)
    });
    
  }, [dataList])

  useEffect(() => {
    const data = {
      data: points,
    };
    heatmapInstance.setData(data);
  }, [points, heatmapInstance])

  useEffect(() => {
    points = [];
  }, []);

  return (
    <>
      <div style={{ position: 'relative', height: '715px', width: '1169px' }} className="HeatMap"></div>
      {estimatedPosition && (
        <p>Position: {estimatedPosition}</p>
      )}
    </>
  );
}

export default HeatMap;