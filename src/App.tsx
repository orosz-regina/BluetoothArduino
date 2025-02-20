import React from 'react';
import { AppRegistry } from 'react-native';
import AppNavigator from './screens/AppNavigator';

const App = () => {
  return <AppNavigator />;
};

AppRegistry.registerComponent('main', () => App);

export default App;
