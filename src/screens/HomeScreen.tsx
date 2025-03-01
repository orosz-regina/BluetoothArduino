import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Üdv a Bluetooth Appban!</Text>

      {/* Bluetooth keresés gomb */}
      <Button title="Bluetooth eszközök keresése" onPress={() => navigation.navigate('BluetoothScreen')} />

      {/* Arduino vezérlés gomb */}
      <View style={styles.buttonSpacing} />
      <Button title="Arduino vezérlés" onPress={() => navigation.navigate('ArduinoControl')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonSpacing: {
    height: 20, // Távolság a két gomb között
  },
});

export default HomeScreen;
