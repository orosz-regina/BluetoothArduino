import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import BluetoothScreen from '../screens/BluetoothScreen';
import ArduinoControl from '../screens/ArduinoControl';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Minden képernyő regisztrálása a navigátor számára */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Főoldal' }} />
        <Stack.Screen name="BluetoothScreen" component={BluetoothScreen} options={{ title: 'Bluetooth eszközök' }} />
        <Stack.Screen name="ArduinoControl" component={ArduinoControl} options={{ title: 'Arduino vezérlés' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
