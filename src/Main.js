/**
* This is the Main file
* This file contains the routes of all the pages
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { BackHandler } from 'react-native';
// import { Scene, Router, Actions } from 'react-native-router-flux';
import { Root } from 'native-base';

// Our custom files and classes import
import Home from './page/Home';
// import Delivery from './page/Delivery';
// import Pay from './page/';
// import more from './page/more';


export default class Main extends Component {
  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', () => Actions.pop());
  };

  render() {
    return(
      <Root>
        <Router>
          <Scene key="root">
            <Scene initial key="home" component={Home} hideNavBar  />
            <Scene key="Delivery" component={Delivery} modal hideNavBar />
            <Scene key="Pay" component={Pay} modal hideNavBar />
            <Scene key="more" component={more} modal hideNavBar />
          </Scene>
        </Router>
      </Root>
    );
  }
}


