// ArduinoControl.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LayoutButton from '../components/LayoutButton';
import { useRoute } from '@react-navigation/native';

const ArduinoControl = () => {
  const route = useRoute();
  const { connectedDevice } = route.params || {}; // Csatlakoztatott eszköz információja

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arduino Vezérlés</Text>
      {connectedDevice ? (
        <LayoutButton deviceId={connectedDevice.id} /> // Ha van csatlakoztatott eszköz, a gombok megjelenítése
      ) : (
        <Text style={styles.error}>Nincs csatlakoztatott eszköz</Text> // Ha nincs csatlakoztatott eszköz
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
  error: { color: 'red', fontSize: 16 },
});

export default ArduinoControl;
