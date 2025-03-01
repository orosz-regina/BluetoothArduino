import BleManager from "react-native-ble-manager";
import { Alert } from "react-native";

const ARDUINO_DEVICE_ID = "XX:XX:XX:XX:XX:XX"; // Az Arduino Bluetooth MAC-címe
const SERVICE_UUID = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"; // Szolgáltatás UUID
const CHARACTERISTIC_UUID = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"; // Jellemző UUID

export const connectToDevice = async (): Promise<boolean> => {
try {
await BleManager.connect(ARDUINO_DEVICE_ID);
    await BleManager.retrieveServices(ARDUINO_DEVICE_ID);
    return true;
  } catch (error) {
    Alert.alert("Hiba", "Nem sikerült csatlakozni az Arduino-hoz.");
    return false;
  }
};

export const sendMessageToDevice = async (message: string) => {
  try {
    const data = Buffer.from(message, "utf-8").toString("base64");
    await BleManager.write(ARDUINO_DEVICE_ID, SERVICE_UUID, CHARACTERISTIC_UUID, data);
    Alert.alert("Siker", "Üzenet elküldve az Arduino-nak.");
  } catch (error) {
    Alert.alert("Hiba", "Nem sikerült üzenetet küldeni.");
  }
};
