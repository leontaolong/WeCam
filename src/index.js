import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; //import our component
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';


//load our CSS file
import './index.css';

//render the Application view
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
