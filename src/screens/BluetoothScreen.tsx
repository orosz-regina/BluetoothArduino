import React from "react";
import { View, Text, FlatList, Button, ActivityIndicator, StyleSheet } from "react-native";
import { useBluetooth } from "../hooks/useBluetooth";

const BluetoothScreen = () => {
  const { devices, scanForDevices, isScanning } = useBluetooth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elérhető Bluetooth eszközök</Text>
      <Button title={isScanning ? "Keresés folyamatban..." : "Frissítés"} onPress={scanForDevices} disabled={isScanning} />
      {isScanning && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceContainer}>
            <Text style={styles.deviceName}>{item.name || "Ismeretlen eszköz"}</Text>
            <Text style={styles.deviceId}>{item.id}</Text>
          </View>
        )}
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
    marginBottom: 10,
  },
  deviceContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deviceId: {
    fontSize: 14,
    color: "#555",
  },
  loading: {
    marginVertical: 10,
  },
  noDevices: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default BluetoothScreen;
