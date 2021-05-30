import { useEffect } from "react";
import h337 from "heatmap.js";

import "./HeatMap.css";


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
}

}

function HeatMap() {
  //find corresponding canvas element
  useEffect(() => {
    var heatmapInstance = h337.create({
      // only container is required, the rest will be defaults
      container: document.querySelector('.HeatMap')
    }, []);
    // now generate some random data
    var points = [
      {
        x: 700, // x coordinate of the datapoint, a number
        y: 590, // y coordinate of the datapoint, a number
        value: 500 // the value at datapoint(x, y)
      }
    ];


    // heatmap data format
    var data = {
      data: points
    };
    // if you have a set of datapoints always use setData instead of addData
    // for data initialization
    heatmapInstance.setData(data);
  })



  return (
    <div style={{ position: 'relative', height: '715px', width: '1169px' }} className="HeatMap"></div>
  );
}

export default HeatMap;