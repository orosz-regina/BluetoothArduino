import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { Buffer } from 'buffer';

const { BleManagerModule } = NativeModules;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

interface MessageDisplayProps {
  config: any;
  deviceId: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ config, deviceId }) => {
  const [receivedMessage, setReceivedMessage] = useState('Várakozás...');
  const [connected, setConnected] = useState(false);
  const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
  const CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

  const { width, height, backgroundColor = '#f0f0f0' } = config;
  const screenWidth = Dimensions.get('window').width;
  const containerWidth = width || screenWidth - 40;

  useEffect(() => {
    const initializeBluetooth = async () => {
      try {
        await BleManager.start({ showAlert: false });
        console.log('Bluetooth inicializálva.');

        // Kapcsolódunk az eszközhöz
        await BleManager.connect(deviceId);
        console.log('Csatlakozva:', deviceId);

        // Szolgáltatások lekérése
        await BleManager.retrieveServices(deviceId);
        console.log('Szolgáltatások lekérése sikeres');

        // Értesítések beállítása
        await BleManager.startNotification(deviceId, SERVICE_UUID, CHARACTERISTIC_UUID);
        console.log('Értesítés beállítva a jellemzőhöz!');

        setConnected(true);
      } catch (error) {
        console.error('Bluetooth kapcsolódás hiba:', error);
        setConnected(false);
      }
    };

    // Bluetooth események figyelése
    const handleUpdateValueForCharacteristic = (data: any) => {
      const receivedData = Buffer.from(data.value).toString('utf-8');
      console.log('Bejövő üzenet:', receivedData);
      setReceivedMessage(receivedData);
    };

    // Az eseményfigyelő regisztrálása
    const eventListener = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

    // Az inicializálás végrehajtása
    initializeBluetooth();

    // Cleanup: eltávolítjuk az eseményfigyelőt és leállítjuk az értesítést
    return () => {
      if (connected) {
        BleManager.stopNotification(deviceId, SERVICE_UUID, CHARACTERISTIC_UUID)
          .then(() => console.log('Bluetooth értesítés leállítva!'))
          .catch((error) => console.error('Bluetooth értesítés leállítása hiba:', error));
      }

      // Eseményfigyelő eltávolítása a helyes módon
      eventListener.remove();
    };
  }, [deviceId, connected]);

  return (
    <View style={[styles.container, { width: containerWidth, height, backgroundColor }]}>
      <Text style={styles.messageText}>{receivedMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  messageText: {
    fontSize: 18,
    color: '#333',
  },
});

export default MessageDisplay;
