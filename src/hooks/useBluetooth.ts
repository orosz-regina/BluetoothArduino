import { useEffect, useState } from 'react';
import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules, PermissionsAndroid, Platform, Alert } from 'react-native';

type BluetoothDevice = {
id: string;
name: string | null;
};

const useBluetooth = () => {
const [devices, setDevices] = useState<BluetoothDevice[]>([]);
const [scanning, setScanning] = useState(false);

useEffect(() => {
    // Inicializáljuk a BleManager-t
    BleManager.start({ showAlert: false })
      .then(() => console.log('BLE Manager started'))
      .catch((error) => console.log('BLE Manager start error:', error));

    const BleManagerModule = NativeModules.BleManager;
    const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

    // Eszközök felfedezése
    const handleDiscoverPeripheral = (peripheral: any) => {
      console.log('Discovered Device:', peripheral);
      setDevices((prevDevices) => {
        if (!prevDevices.some((dev) => dev.id === peripheral.id)) {
          return [...prevDevices, { id: peripheral.id, name: peripheral.name || 'Unknown' }];
        }
        return prevDevices;
      });
    };

    // Listener hozzáadása a felfedezett eszközökhöz
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

    // Takarítás, amikor a komponens eltávolításra kerül
    return () => {
      // Használjuk a removeAllListeners metódust
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    };
  }, []);

  // Bluetooth engedélyek kérése Android esetén
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        console.log('Permissions:', granted);

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

  // Bluetooth eszközök keresése
  const startScan = async () => {
    if (scanning) return;
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setDevices([]); // Előző eszközök törlése
    setScanning(true);
    BleManager.scan([], 30, true) // Alapértelmezett paraméterekkel
      .then(() => console.log('📡 Keresés elindult...'))
      .catch((error) => console.log('⚠️ Hiba a keresésnél:', error));

    // Várakozási idő, hogy 30 másodperc után leállítsuk a keresést
    setTimeout(() => {
      setScanning(false);
      getDiscoveredDevices(); // Eszközök manuális lekérdezése
    }, 30000);
  };

  // Felfedezett eszközök lekérdezése
  const getDiscoveredDevices = () => {
    BleManager.getDiscoveredPeripherals()
      .then((peripherals) => {
        console.log('Discovered peripherals:', peripherals);
        setDevices(
          peripherals.map((peripheral: any) => ({
            id: peripheral.id,
            name: peripheral.name || 'Unknown',
          }))
        );
      })
      .catch((error) => {
        console.log('Error getting discovered peripherals:', error);
      });
  };

  return { devices, scanning, startScan };
};

export default useBluetooth;
