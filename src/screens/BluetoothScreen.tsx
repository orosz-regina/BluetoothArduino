import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import useBluetooth from '../hooks/useBluetooth';
import { useNavigation } from '@react-navigation/native';

const BluetoothScreen = () => {
  const navigation = useNavigation();
  const { devices, scanning, startScan, connectToDevice, connectedDevice } = useBluetooth();

  const handleConnectDevice = async (deviceId: string) => {
    await connectToDevice(deviceId);

    setTimeout(() => {
      const updatedDevice = devices.find((d) => d.id === deviceId);
      if (updatedDevice) {
        console.log("Navigating with connectedDevice:", updatedDevice);
        navigation.navigate('Home', { connectedDevice: updatedDevice });
      } else {
        Alert.alert('Connection failed', 'Failed to connect to the device.');
      }
    }, 1000); // Adjunk időt a frissítésre
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
              <Text>{item.name || 'Unknown Device'}</Text>
              <Text>ID: {item.id}</Text>
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