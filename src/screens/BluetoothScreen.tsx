import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import useBluetooth from '../hooks/useBluetooth';
import { useNavigation } from '@react-navigation/native';

const BluetoothScreen = () => {
  const navigation = useNavigation();
  const { devices, scanning, startScan, connectToDevice, connectedDevice } = useBluetooth();

  const handleConnectDevice = async (deviceId: string) => {
    try {
      // Ellenőrzés, hogy a csatlakozás sikeres volt
      const success = await connectToDevice(deviceId);

      if (success) {
        console.log("Eszközhöz való csatlakozás sikeres!");

        // Megkeressük az eszközt az eszközök listájában
        const updatedDevice = devices.find((d) => d.id === deviceId);
        if (updatedDevice) {
          console.log("Navigálunk a Home képernyőre:", updatedDevice);
          navigation.navigate('Home', { connectedDevice: updatedDevice });
        } else {
          Alert.alert('Connection failed', 'Failed to connect to the device.');
        }
      } else {
        Alert.alert('Connection failed', 'Failed to connect to the device.');
      }
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Connection error', 'An error occurred while connecting.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title={scanning ? 'Scanning...' : 'Scan Bluetooth'} onPress={startScan} disabled={scanning} />
      {devices.length === 0 && !scanning ? (
        <Text style={styles.noDevices}>No devices found</Text>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.device}>
              <Text>{item.name ? item.name : 'Unknown Device'}</Text>
              <Text>ID: {item.id}</Text>
              {/* A kommentet most kívül helyezzük */}
              <Button
                title={`Connect to ${item.name || 'Device'}`}
                onPress={() => handleConnectDevice(item.id)}
              />
            </View>
          )}
        />
      )}
      {connectedDevice && (
        <Text style={styles.connected}>
          Connected to: {connectedDevice.name} (ID: {connectedDevice.id})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  noDevices: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
  device: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  connected: { marginTop: 20, fontSize: 16, color: 'green' },
});

export default BluetoothScreen;
