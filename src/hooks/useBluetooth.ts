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
    // BLE Manager inicializálása
    BleManager.start({ showAlert: false })
      .then(() => console.log('BLE Manager started'))
      .catch((error) => console.log('BLE Manager start error:', error));

    const BleManagerModule = NativeModules.BleManager;
    bleManagerEmitterRef.current = new NativeEventEmitter(BleManagerModule);

    // Bluetooth eszközök felfedezése
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

    // Eszköz csatlakozása
    const handleConnect = (peripheral: any) => {
      console.log("Csatlakozott eszköz:", peripheral);
      setConnectedDevice({ id: peripheral.id, name: peripheral.name || "Unknown" });
    };

    // Eszköz leválasztása
    const handleDisconnect = (peripheral: any) => {
      console.log("Eszköz leválasztva:", peripheral);
      setConnectedDevice(null);
    };

    // Eseménykezelők hozzáadása
    bleManagerEmitterRef.current.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    bleManagerEmitterRef.current.addListener('BleManagerConnectPeripheral', handleConnect);
    bleManagerEmitterRef.current.addListener('BleManagerDisconnectPeripheral', handleDisconnect);

    return () => {
      // Események törlése a komponens eltávolításakor
      if (bleManagerEmitterRef.current) {
        bleManagerEmitterRef.current.removeAllListeners('BleManagerDiscoverPeripheral');
        bleManagerEmitterRef.current.removeAllListeners('BleManagerConnectPeripheral');
        bleManagerEmitterRef.current.removeAllListeners('BleManagerDisconnectPeripheral');
      }
    };
  }, []); // Eltérítetlenül egyszer lefut, amikor a komponens betöltődik

  // Engedélyek kérése Androidon
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

  // Bluetooth keresés elindítása
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

  // Felfedezett eszközök listájának lekérése
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

  // Csatlakozás egy eszközhöz
  const connectToDevice = async (deviceId: string) => {
    try {
      console.log('Connecting to device:', deviceId);  // Debugging log
      await BleManager.connect(deviceId);
      const device = devices.find((d) => d.id === deviceId);
      if (device) {
        setConnectedDevice(device);
        console.log("Device connected:", device);  // Debugging log
        return true;
      } else {
        console.log("Device not found after connection attempt");
        return false;
      }
    } catch (error) {
      console.error('Connection error:', error);
      return false;
    }
  };

  return {
    devices,
    scanning,
    connectedDevice,
    connectionError,
    startScan,
    connectToDevice,
  };
};

export default useBluetooth;
