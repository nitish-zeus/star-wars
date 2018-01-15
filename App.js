import React from 'react';
import {StackNavigator} from 'react-navigation';
import Login from "./src/login";
import Planets from "./src/planets";
import PlanetDetail from "./src/planetDetail";

const StarWarsApp = StackNavigator({

  Login: {
    screen: Login
  },
  Planets: {
    screen: Planets
  },
  PlanetDetail: {
    screen: PlanetDetail

  }

}, {
  mode: "modal",
  headerMode: "none",
  navigationOptions: {
    gesturesEnabled: false
  }
});

export default(StarWarsApp);