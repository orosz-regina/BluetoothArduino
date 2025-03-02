import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import useBluetooth from '../hooks/useBluetooth';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Az átadott paraméterekhez hozzáférés
  const { connectedDevice } = useBluetooth();

  // Az átadott connectedDevice érték fogadása a route.params-ból
  const deviceFromParams = route.params?.connectedDevice || connectedDevice;

  useEffect(() => {
    if (deviceFromParams) {
      console.log("Navigálás az ArduinoControl képernyőre:", deviceFromParams);
      navigation.navigate('ArduinoControl', { connectedDevice: deviceFromParams });
    }
  }, [deviceFromParams]); // Ha a deviceFromParams változik, újra navigálunk

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Üdv a Bluetooth Appban!</Text>

      <Button title="Bluetooth eszközök keresése" onPress={() => navigation.navigate('BluetoothScreen')} />

      <View style={styles.buttonSpacing} />
      <Button
        title="Arduino vezérlés"
        onPress={() => {
          if (!deviceFromParams) {
            Alert.alert('Nincs csatlakoztatott eszköz', 'Először csatlakozz egy Bluetooth eszközhöz.');
            return;
          }
          console.log('Navigating with connectedDevice:', deviceFromParams);
          navigation.navigate('ArduinoControl', { connectedDevice: deviceFromParams });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
  buttonSpacing: { height: 20 },
});

export default HomeScreen;
