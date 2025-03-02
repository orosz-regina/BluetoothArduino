import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

// Konstans UUID-k
const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';  // Szolgáltatás UUID
const CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';  // Jellemző UUID

// Az üzenet küldése a kiválasztott Bluetooth eszközre
export const sendMessageToDevice = async (deviceId, message) => {
try {
// Ellenőrizzük, hogy a Bluetooth eszköz csatlakozott-e
await BleManager.connect(deviceId);

    // Jellemzők regisztrálása (hogy biztosan elérhetők legyenek)
    await BleManager.retrieveServices(deviceId);

    // Az üzenet küldése a konstans UUID-kkel
    await BleManager.write(
      deviceId,            // Bluetooth eszköz ID
      SERVICE_UUID,        // Szolgáltatás UUID (konstans)
      CHARACTERISTIC_UUID, // Jellemző UUID (konstans)
      Buffer.from(message, 'utf-8').toJSON().data // Az üzenet UTF-8 bájtokká alakítása
    );
    console.log("Message sent:", message); // Üzenet sikeres küldése
  } catch (error) {
    console.error("Error sending message:", error); // Hiba esetén
    throw new Error('Failed to send message');
  }
};
