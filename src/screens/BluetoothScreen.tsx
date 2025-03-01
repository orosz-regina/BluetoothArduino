import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import useBluetooth from '../hooks/useBluetooth';

const BluetoothScreen = () => {
  const { devices, scanning, startScan, connectToDevice, connectedDevice, connectionError } = useBluetooth();

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
              <Button
                title={`Connect to ${item.name}`}
                onPress={() => connectToDevice(item.id)}
              />
            </View>
          )}
        />
      )}
      {connectedDevice && (
        <Text style={styles.connected}>
          Connected to: {connectedDevice.name}
        </Text>
      )}
      {connectionError && (
        <Alert
          title="Connection Error"
          message={connectionError}
          onDismiss={() => {}}
        />
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
