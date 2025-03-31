import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import useBluetooth from '../hooks/useBluetooth';

const HomeScreen = () => {
  // A navigációs hook és a route hook inicializálása
  const navigation = useNavigation();
  const route = useRoute();

  // Bluetooth eszközhöz csatlakozó eszköz lekérése a useBluetooth hook-ból
  const { connectedDevice } = useBluetooth();

  // Az átadott paraméterekből, vagy ha nem található, akkor a lokális állapotból kérjük le az eszközt
  const deviceFromParams = route.params?.connectedDevice || connectedDevice;

  useEffect(() => {
    // Ha csatlakoztatott eszközt találunk, navigálunk az ArduinoControl képernyőre
    if (deviceFromParams) {
      console.log("Navigálás az ArduinoControl képernyőre:", deviceFromParams);
      navigation.navigate('ArduinoControl', { connectedDevice: deviceFromParams });
    }
  }, [deviceFromParams]);

  return (
    <View style={styles.container}>
      {/* Üdvözlő szöveg a képernyőn */}
      <Text style={styles.title}>Üdv az Appban!</Text>

      <Button title="Bluetooth eszközök keresése" onPress={() => navigation.navigate('BluetoothScreen')} />

      <View style={styles.buttonSpacing} />

      {/* Gomb az Arduino vezérléséhez, ha van csatlakoztatott eszköz */}
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

// Stílusok a komponenshez
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
  buttonSpacing: { height: 20 },
});

export default HomeScreen;
