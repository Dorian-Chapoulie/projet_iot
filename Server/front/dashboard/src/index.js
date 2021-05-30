import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import reportWebVitals from './reportWebVitals';
import 'fontsource-roboto';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { WSocketsProvider } from './api/websockets';

import App from './App';
import Control from './views/RobotControl';
import HeatMap from './views/HeatMap';

ReactDOM.render(
  <>
    <WSocketsProvider>
      <Router>
        <Switch>
          <Route path="/control">
            <Control />
          </Route>
          <Route path="/heatmap">
            <HeatMap />
          </Route>
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </Router>
    </WSocketsProvider>
  </>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
