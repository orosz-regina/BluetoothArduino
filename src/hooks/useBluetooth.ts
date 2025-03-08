import { useState, useEffect, useRef } from 'react';
import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules, Platform, PermissionsAndroid, Alert } from 'react-native';

type BluetoothDevice = {
id: string;
name: string;
};

const useBluetooth = () => {
const [devices, setDevices] = useState<BluetoothDevice[]>([]);
const [scanning, setScanning] = useState(false);
const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
const [connectionError, setConnectionError] = useState<string | null>(null);

const bleManagerEmitterRef = useRef<any>(null);

useEffect(() => {
    BleManager.start({ showAlert: false })
      .then(() => console.log('BLE Manager started'))
      .catch((error) => console.log('BLE Manager start error:', error));

    const BleManagerModule = NativeModules.BleManager;
    bleManagerEmitterRef.current = new NativeEventEmitter(BleManagerModule);

    // Felfedezett eszközök figyelése
    const handleDiscoverPeripheral = (peripheral: any) => {
      if (peripheral.name) {
        setDevices((prevDevices) => {
          if (!prevDevices.some((dev) => dev.id === peripheral.id)) {
            return [...prevDevices, { id: peripheral.id, name: peripheral.name }];
          }
          return prevDevices;
        });
      }
    };

    // Kapcsolódási események figyelése
    const handleConnect = (peripheral: any) => {
      console.log("Csatlakozotttttt eszköz:", peripheral);
      setConnectedDevice({ id: peripheral.id, name: peripheral.name || "Unknown" });
    };

    const handleDisconnect = (peripheral: any) => {
      console.log("Eszköz leválasztva:", peripheral);
      setConnectedDevice(null);
    };

    bleManagerEmitterRef.current.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    bleManagerEmitterRef.current.addListener('BleManagerConnectPeripheral', handleConnect);
    bleManagerEmitterRef.current.addListener('BleManagerDisconnectPeripheral', handleDisconnect);

    return () => {
      if (bleManagerEmitterRef.current) {
        bleManagerEmitterRef.current.removeAllListeners('BleManagerDiscoverPeripheral');
        bleManagerEmitterRef.current.removeAllListeners('BleManagerConnectPeripheral');
        bleManagerEmitterRef.current.removeAllListeners('BleManagerDisconnectPeripheral');
      }
    };
  }, []); // Csak egyszer fusson le, amikor a komponens betöltődik

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert('Permissions required', 'Please enable Bluetooth and Location permissions.');
          return false;
        }
        return true;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const startScan = async () => {
    if (scanning) return;
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setDevices([]);
    setScanning(true);
    BleManager.scan([], 15, true)
      .then(() => console.log('Keresés elindult...'))
      .catch((error) => console.log('Hiba a keresésnél:', error));

    setTimeout(() => {
      setScanning(false);
      getDiscoveredDevices();
    }, 10000);
  };

  const getDiscoveredDevices = () => {
    BleManager.getDiscoveredPeripherals()
      .then((peripherals) => {
        setDevices(
          peripherals
            .filter((peripheral: any) => peripheral.name)
            .map((peripheral: any) => ({
              id: peripheral.id,
              name: peripheral.name || 'Unknown',
            }))
        );
      })
      .catch((error) => {
        console.log('Error getting discovered peripherals:', error);
      });
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      await BleManager.connect(deviceId);
      const device = devices.find((d) => d.id === deviceId);
      setConnectedDevice(device || null);
      setConnectionError(null);
      console.log(`Csatlakoztatott eszköz: ${device?.name}`);
    } catch (error) {
      setConnectionError('Nem sikerült csatlakozni az eszközhöz');
      console.log('Connection error:', error);
    }
  };

  const sendMessage = async (message: string) => {
    try {
      // A Bluetooth kommunikáció küldése itt történik.
      console.log('Üzenet küldése:', message);
      // Adjunk hozzá egy példát a Bluetooth üzenet küldésére
      await BleManager.write(
        connectedDevice.id,
        '0000fff0-0000-1000-8000-00805f9b34fb', // A szolgáltatás UUID-ja
        '0000fff1-0000-1000-8000-00805f9b34fb', // A jellemző UUID-ja
        [message]
      );
      console.log('Üzenet sikeresen elküldve:', message);
    } catch (error) {
      console.log('Hiba történt az üzenet küldésénél:', error);
    }
  };

  return {
    devices,
    scanning,
    connectedDevice,
    connectionError,
    startScan,
    connectToDevice,
    sendMessage,  // Üzenet küldése
  };
};

export default useBluetooth;
