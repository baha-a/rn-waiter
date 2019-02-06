import React from 'react';
import Expo from 'expo';
import { StatusBar } from 'react-native';
import { Router, Stack, Scene } from 'react-native-router-flux';
import { Container } from 'native-base';

import Bill from './Pages/Bill';
import Order from './Pages/Order';
import BillInfo from './Pages/BillInfo';
import Customize from './Pages/Customize';
import Socket from './Socket';
import Replacements from './Components/Replacements';
import Loader from './Components/Loader';

export default class App extends React.Component 
{
  constructor(props) {
    super(props);
    this.state = {  loading: true  };
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.ALL);
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),

      FontAwesomeBrands: require('./assets/fa-brands-400.ttf'),
      FontAwesomeRegular: require('./assets/fa-regular-400.ttf'),
      FontAwesomeSolid: require('./assets/fa-solid-900.ttf'),
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }

    return (
      <Container>
        <StatusBar hidden />
        <Router>
          <Stack key="root">
            <Scene initial key="order" component={Order} hideNavBar />
            <Scene key="bill" component={Bill} hideNavBar />
            <Scene key="billInfo" component={BillInfo} hideNavBar />
            <Scene key="customize" component={Customize} hideNavBar />
            <Scene key="replacements" component={Replacements} hideNavBar />
          </Stack>
        </Router>
      </Container>
    );
  }
}
