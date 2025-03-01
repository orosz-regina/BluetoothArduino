import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { connectToDevice, sendMessageToDevice } from "../services/ArduinoService";

const ArduinoControl = () => {
  const [isConnected, setIsConnected] = useState(false);

  const connectToArduino = async () => {
    const success = await connectToDevice();
    setIsConnected(success);
  };

  const sendMessage = async (message: string) => {
    if (!isConnected) {
      Alert.alert("Hiba", "Nincs kapcsolat az Arduinóval.");
      return;
    }
    await sendMessageToDevice(message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arduino vezérlés</Text>
      {!isConnected ? (
        <Button title="Csatlakozás Arduinóhoz" onPress={connectToArduino} />
      ) : (
        <Button title="Üzenet küldése" onPress={() => sendMessage("1")} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ArduinoControl;
