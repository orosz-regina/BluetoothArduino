import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import LayoutButton from '../components/LayoutComponent';
import { useRoute } from '@react-navigation/native';

const ArduinoControl = () => {
  const route = useRoute();
  const { connectedDevice } = route.params || {}; // Csak akkor használjuk, ha van csatlakoztatott eszköz

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Ha csatlakoztatott eszköz van, megjelenítjük a vezérlőt */}
      {connectedDevice ? (
        <LayoutButton deviceId={connectedDevice.id} />
      ) : (
        <View style={styles.errorContainer}>
          {/* Ha nincs csatlakoztatott eszköz, hibaüzenet jelenik meg */}
          <Text style={styles.error}>Nincs csatlakoztatott eszköz</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default ArduinoControl;
