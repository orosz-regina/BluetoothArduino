import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { sendMessageToDevice } from '../services/ArduinoService'; // Bluetooth üzenetküldéshez szükséges függvény importálása
import BleManager from 'react-native-ble-manager';

const ArduinoControl = () => {
  const route = useRoute();
  const { connectedDevice } = route.params || {};  // Az eszköz, amelyhez csatlakozunk

  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Ellenőrizzük, hogy a device csatlakozott-e
    if (connectedDevice) {
      BleManager.isPeripheralConnected(connectedDevice.id)
        .then((isConnected) => {
          setIsConnected(isConnected);
          if (!isConnected) {
            Alert.alert('Device not connected', 'Please make sure the device is connected.');
          }
        })
        .catch((error) => {
          console.error("Error checking connection:", error);
        });
    }
  }, [connectedDevice]);

  // Üzenet küldése a Bluetooth eszközhöz
  const sendMessageToArduino = async () => {
    if (!connectedDevice) {
      Alert.alert('No device connected', 'Please connect to a Bluetooth device first.');
      return;
    }

    if (!isConnected) {
      Alert.alert('Device not connected', 'Please make sure the device is connected before sending a message.');
      return;
    }

    try {
      await sendMessageToDevice(connectedDevice.id, message);
      Alert.alert('Success', 'Message sent to Arduino!');
      console.log(`Message sent to ${connectedDevice.name}: ${message}`);
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  return (
    <View style={styles.container}>
      {connectedDevice ? (
        <>
          <Text style={styles.deviceName}>Connected to: {connectedDevice.name}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter message"
            value={message}
            onChangeText={setMessage}
          />
          <Button title="Send Message" onPress={sendMessageToArduino} />
        </>
      ) : (
        <Text>No device connected</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  deviceName: { fontSize: 18, marginBottom: 10 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingLeft: 8 },
});

export default ArduinoControl;
