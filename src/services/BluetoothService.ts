import BleManager from "react-native-ble-manager";
import { NativeEventEmitter, NativeModules, PermissionsAndroid, Platform, Linking, Alert } from "react-native";
import { useState, useEffect } from "react";

const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
let discoveredDevices = [];

const requestPermissions = async () => {
if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    console.log("Engedélyek állapota:", granted);

    if (
      granted["android.permission.BLUETOOTH_SCAN"] === "never_ask_again" ||
      granted["android.permission.BLUETOOTH_CONNECT"] === "never_ask_again"
    ) {
      Alert.alert(
        "Engedély szükséges",
        "A Bluetooth működéséhez engedélyezned kell a beállításokban.",
        [
          { text: "Mégse", style: "cancel" },
          { text: "Beállítások", onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }

    return (
      granted["android.permission.BLUETOOTH_SCAN"] === PermissionsAndroid.RESULTS.GRANTED &&
      granted["android.permission.BLUETOOTH_CONNECT"] === PermissionsAndroid.RESULTS.GRANTED &&
      granted["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};

export const startBluetoothScan = async () => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    console.error("Bluetooth engedélyek hiányoznak!");
    return;
  }

  discoveredDevices = [];
  console.log("Bluetooth keresés indítása...");

  await BleManager.start();
  await BleManager.scan([], 15, true);

  const handleDiscoverPeripheral = (peripheral) => {
    console.log("Talált eszköz:", peripheral);
    if (peripheral && peripheral.id) {
      const exists = discoveredDevices.some((d) => d.id === peripheral.id);
      if (!exists) {
        discoveredDevices.push({
          id: peripheral.id,
          name: peripheral.name || "Ismeretlen eszköz",
        });
      }
    }
  };

  bleManagerEmitter.addListener("BleManagerDiscoverPeripheral", handleDiscoverPeripheral);

  setTimeout(() => {
    BleManager.stopScan().then(() => {
      console.log("Bluetooth keresés leállt.");
      bleManagerEmitter.removeListener("BleManagerDiscoverPeripheral", handleDiscoverPeripheral);
    });
  }, 15000);
};

export const getDiscoveredDevices = () => {
  console.log("Visszaadott eszközök:", discoveredDevices);
  return discoveredDevices;
};

export const getConnectedDevices = async () => {
  try {
    const connectedDevices = await BleManager.getConnectedPeripherals([]);
    return connectedDevices.map((device) => ({
      id: device.id,
      name: device.name || "Ismeretlen eszköz",
    }));
  } catch (error) {
    console.error("Hiba a kapcsolódott eszközök lekérésekor:", error);
    return [];
  }
};
