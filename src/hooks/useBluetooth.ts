import { useState, useEffect } from "react";
import { startBluetoothScan, getDiscoveredDevices, getConnectedDevices } from "../services/BluetoothService";

export const useBluetooth = () => {
const [devices, setDevices] = useState<{ id: string; name: string }[]>([]);
const [isScanning, setIsScanning] = useState(false);

const scanForDevices = async () => {
setDevices([]); // Ürítjük a listát az új keresés előtt
    setIsScanning(true);
    await startBluetoothScan();

    setTimeout(async () => {
      const discoveredDevices = getDiscoveredDevices();
      const connectedDevices = await getConnectedDevices();
      setDevices([...discoveredDevices, ...connectedDevices]);
      setIsScanning(false);
    }, 5000); // Várunk, hogy az eszközök listája feltöltődjön
  };

  useEffect(() => {
    scanForDevices();
  }, []);

  return { devices, scanForDevices, isScanning };
};
