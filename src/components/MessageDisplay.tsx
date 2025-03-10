import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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
  const [receivedMessage, setReceivedMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
  const CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

  // Alapértelmezett konfiguráció
  const containerStyle = {
    width: config.width || '100%',
    height: config.height || 100, // Beállíthatod, ha szeretnéd limitálni
    backgroundColor: config.backgroundColor || '#ddd',
    borderRadius: config.borderRadius || 10,
    borderColor: config.borderColor || '#000',
    justifyContent: config.justifyContent || 'center',
    alignItems: config.alignItems || 'left',
    position: config.position || 'relative',
    top: config.top || undefined,
    left: config.left || undefined,
    ...config.input,
  };

  const textStyle = {
    color: config.textColor || '#000',  // Szöveg színe (default: piros)
    fontSize: config.fontSize || 18, // Alapértelmezett fontSize 18, ha nincs megadva
  };

  useEffect(() => {
    const initializeBluetooth = async () => {
      try {
        await BleManager.start({ showAlert: false });
        await BleManager.connect(deviceId);
        await BleManager.retrieveServices(deviceId);
        await BleManager.startNotification(deviceId, SERVICE_UUID, CHARACTERISTIC_UUID);
        setConnected(true);
      } catch (error) {
        console.error('Bluetooth kapcsolódás hiba:', error);
        setConnected(false);
      }
    };

    const handleUpdateValueForCharacteristic = (data: any) => {
      const receivedData = Buffer.from(data.value).toString('utf-8');

      // Azonnali logolás a kapott adat előtt

      // Mivel minden új üzenetnél törölni akarjuk az előzőt,
      // az előző üzenet törléséhez az üzenetet egy üres stringre állítjuk
      setReceivedMessage(receivedData);  // Csak az új adatot tároljuk
    };

    const eventListener = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
    initializeBluetooth();

    return () => {
      if (connected) {
        BleManager.stopNotification(deviceId, SERVICE_UUID, CHARACTERISTIC_UUID);
      }
      eventListener.remove();
    };
  }, [deviceId, connected]);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* A ScrollView vízszintes görgetést biztosít */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <Text style={[styles.messageText, textStyle]}>
          {receivedMessage}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    marginTop: 30,
    overflow: 'hidden', // Biztosítja, hogy a konténer ne törjön meg
  },
  messageText: {
    flexShrink: 0,  // Ne zsugorodjon a szöveg
  },
});

export default MessageDisplay;
