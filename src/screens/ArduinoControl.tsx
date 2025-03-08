import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LayoutButton from '../components/LayoutComponent';
import { useRoute } from '@react-navigation/native';

const ArduinoControl = () => {
  const route = useRoute();
  const { connectedDevice } = route.params || {};

  return (
    <View style={styles.container}>
      {connectedDevice ? (
        <LayoutButton deviceId={connectedDevice.id} />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>Nincs csatlakoztatott eszköz</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center' },  // Gombok felül
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: { color: 'red', fontSize: 16 },
});

export default ArduinoControl;
