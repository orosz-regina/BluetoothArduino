import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

// Konstans UUID-k
const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';  // Szolgáltatás UUID
const CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';  // Jellemző UUID

// Üzenet küldése az eszközre
export const sendMessageToDevice = async (deviceId: string, message: string) => {
try {
console.log('Küldés előtt próbálkozás:', deviceId);

    // Ellenőrzés: biztosan van-e ilyen eszköz
    const devices = await BleManager.getDiscoveredPeripherals();
    const deviceExists = devices.some(device => device.id === deviceId);
    if (!deviceExists) {
      console.log('Eszköz nem található:', deviceId);
      throw new Error('Invalid peripheral uuid');
    }

    // Csatlakozunk a Bluetooth eszközhöz
    await BleManager.connect(deviceId);
    console.log('Csatlakozva:', deviceId);

    // Szolgáltatások és jellemzők lekérése
    const services = await BleManager.retrieveServices(deviceId);

    // Az üzenet küldése a jellemzőre
    await BleManager.write(
      deviceId,               // Bluetooth eszköz ID
      SERVICE_UUID,           // Szolgáltatás UUID
      CHARACTERISTIC_UUID,    // Jellemző UUID
      Buffer.from(message, 'utf-8').toJSON().data  // Az üzenet bájtokká alakítása
    );
    console.log('Üzenet sikeresen elküldve:', message);

  } catch (error) {
    console.error("Hiba üzenet küldésekor:", error);
    throw new Error('Failed to send message');
  }
};

// Üzenet fogadás beállítása
export const startReceivingMessages = async (deviceId: string) => {
  try {
    console.log('Csatlakozunk az eszközhöz:', deviceId);

    // Ellenőrzés: biztosan van-e ilyen eszköz
    const devices = await BleManager.getDiscoveredPeripherals();
    const deviceExists = devices.some(device => device.id === deviceId);
    if (!deviceExists) {
      console.log('Eszköz nem található:', deviceId);
      throw new Error('Invalid peripheral uuid');
    }

    await BleManager.connect(deviceId);
    console.log('Csatlakozva:', deviceId);

    // Szolgáltatások és jellemzők lekérése
    await BleManager.retrieveServices(deviceId);
    console.log('Szolgáltatások lekérése sikeres');

    // Értesítés beállítása a jellemzőn
    await BleManager.startNotification(deviceId, SERVICE_UUID, CHARACTERISTIC_UUID);
    console.log('Értesítés sikeresen beállítva');

    // Beérkező adatok figyelése
    BleManager.on('BleManagerDidUpdateValueForCharacteristic', (data) => {
      console.log('Beérkezett adat:', data);

      // Ellenőrizzük, hogy a helyes eszköztől és jellemzőtől érkezett adat
      if (data.peripheral === deviceId && data.characteristic === CHARACTERISTIC_UUID) {
        const receivedMessage = Buffer.from(data.value).toString('utf-8');
        console.log('Bejövő üzenet:', receivedMessage);

        // Az üzenet feldolgozása
        // Például itt beállíthatjuk a UI-ban a megfelelő üzenetet
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
