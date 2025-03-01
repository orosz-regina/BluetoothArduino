import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Linking } from "react-native";
import { useBluetooth } from "../hooks/useBluetooth";

const BluetoothScreen = () => {
const { discoveredDevices, startBluetoothScan, isScanning, bluetoothState } = useBluetooth();
const [connectingDevice, setConnectingDevice] = useState<string | null>(null);

const handleConnect = async (deviceId: string) => {
setConnectingDevice(deviceId);
    try {
      // Csatlakozás a kiválasztott eszközhöz (ha van ilyen implementálás)
      Alert.alert("Sikeres csatlakozás!", `Csatlakoztál az eszközhöz: ${deviceId}`);
    } catch (error) {
      Alert.alert("Hiba!", `Nem sikerült csatlakozni az eszközhöz: ${deviceId}`);
    } finally {
      setConnectingDevice(null);
    }
  };

  const handleBluetoothStateChange = () => {
    if (bluetoothState === "off") {
      Alert.alert("Bluetooth ki van kapcsolva", "Kérlek, kapcsold be a Bluetooth-t.", [
        {
          text: "Beállítások",
          onPress: () => Linking.openSettings(),
        },
        { text: "Mégse", style: "cancel" },
      ]);
    }
  };

  useEffect(() => {
    handleBluetoothStateChange();
  }, [bluetoothState]);

  const renderDevice = ({ item }: { item: { id: string; name: string } }) => (
    <View style={styles.deviceContainer}>
      <Text style={styles.deviceName}>{item.name || "Ismeretlen eszköz"}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
      <TouchableOpacity
        style={[styles.connectButton, connectingDevice === item.id && styles.connecting]}
        onPress={() => handleConnect(item.id)}
        disabled={connectingDevice === item.id}
      >
        <Text style={styles.connectButtonText}>
          {connectingDevice === item.id ? "Csatlakozás..." : "Csatlakozás"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elérhető Bluetooth eszközök</Text>
      <Button
        title={isScanning ? "Keresés folyamatban..." : "Frissítés"}
        onPress={() => startBluetoothScan()} // Hívjuk a startBluetoothScan funkciót
        disabled={isScanning} // Ne engedje újraindítani a keresést, ha már fut
      />
      {isScanning && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}
      <FlatList
        data={discoveredDevices}
        keyExtractor={(item) => item.id}
        renderItem={renderDevice}
        ListEmptyComponent={<Text style={styles.noDevices}>Nem található eszköz</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loading: {
    marginTop: 20,
  },
  deviceContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deviceId: {
    fontSize: 14,
    color: "#666",
  },
  connectButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  connectButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  connecting: {
    backgroundColor: "#FFA500",
  },
  connected: {
    backgroundColor: "#28A745",
  },
  noDevices: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default BluetoothScreen;
