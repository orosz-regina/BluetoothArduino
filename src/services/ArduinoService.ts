import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

// Konstans UUID-k
const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';  // Szolgáltatás UUID
const CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';  // Jellemző UUID

// Üzenet küldése az eszközre
export const sendMessageToDevice = async (deviceId: string, message: string) => {
try {
// Ellenőrizzük, hogy az eszköz létezik-e
const devices = await BleManager.getDiscoveredPeripherals();
const deviceExists = devices.some(device => device.id === deviceId);
if (!deviceExists) {
      console.log('Eszköz nem található:', deviceId);
      throw new Error('Invalid peripheral uuid');
    }

    // Csatlakozunk az eszközhöz
    await BleManager.connect(deviceId);
    console.log('Csatlakozva:', deviceId);

    // Szolgáltatások és jellemzők lekérése
    await BleManager.retrieveServices(deviceId);

    // Az üzenet elküldése
    await BleManager.write(
      deviceId,               // Eszköz ID
      SERVICE_UUID,           // Szolgáltatás UUID
      CHARACTERISTIC_UUID,    // Jellemző UUID
      Buffer.from(message, 'utf-8').toJSON().data  // Üzenet bájtokká alakítása
    );
    console.log('Üzenet sikeresen elküldve:', message);

  } catch (error) {
    console.error("Hiba üzenet küldésekor:", error);
    throw new Error('Failed to send message');
  }
};

// Üzenet fogadása
export const startReceivingMessages = async (deviceId: string) => {
  try {
    // Ellenőrizzük, hogy az eszköz létezik-e
    const devices = await BleManager.getDiscoveredPeripherals();
    const deviceExists = devices.some(device => device.id === deviceId);
    if (!deviceExists) {
      console.log('Eszköz nem található:', deviceId);
      throw new Error('Invalid peripheral uuid');
    }

    // Csatlakozás az eszközhöz
    await BleManager.connect(deviceId);
    console.log('Csatlakozva:', deviceId);

    // Szolgáltatások és jellemzők lekérése
    await BleManager.retrieveServices(deviceId);
    console.log('Szolgáltatások lekérése sikeres');

    // Értesítés beállítása
    await BleManager.startNotification(deviceId, SERVICE_UUID, CHARACTERISTIC_UUID);
    console.log('Értesítés sikeresen beállítva');

    // Beérkező üzenetek figyelése
    BleManager.on('BleManagerDidUpdateValueForCharacteristic', (data) => {
      console.log('Beérkezett adat:', data);

      // Ellenőrizzük, hogy a várt eszköztől érkezik-e adat
      if (data.peripheral === deviceId && data.characteristic === CHARACTERISTIC_UUID) {
        const receivedMessage = Buffer.from(data.value).toString('utf-8');
        console.log('Bejövő üzenet:', receivedMessage);
        // Üzenet feldolgozása
      } else {
        console.log('Az üzenet nem a várt jellemzőből érkezett');
      }
    });
  } catch (error) {
    console.error('Hiba üzenet fogadásakor:', error);
    throw new Error('Failed to start receiving messages');
  }
};

// Eszköz leválasztása
export const disconnectDevice = async (deviceId: string) => {
  try {
    await BleManager.disconnect(deviceId);
    console.log('Eszközhöz való kapcsolat bontása:', deviceId);
  } catch (error) {
    console.error("Hiba kapcsolat bontásakor:", error);
    throw new Error('Failed to disconnect from device');
  }
};
