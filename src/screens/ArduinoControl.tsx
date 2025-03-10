import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import LayoutButton from '../components/LayoutComponent';
import { useRoute } from '@react-navigation/native';

const ArduinoControl = () => {
  const route = useRoute();
  const { connectedDevice } = route.params || {}; // Ellenőrizd, hogy van-e csatlakoztatott eszköz

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {connectedDevice ? (
        <LayoutButton deviceId={connectedDevice.id} />
      ) : (
        <View style={styles.errorContainer}>
          {/* A szöveges tartalmat mindig <Text> komponensbe kell ágyazni */}
          <Text style={styles.error}>Nincs csatlakoztatott eszköz</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // A konténer rugalmasan kitölti a képernyőt
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20, // A görgetéshez szükséges extra hely
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,  // Néhány szépítési mód
  },
  error: {
    color: 'red',
    fontSize: 16
  },
});

export default ArduinoControl;
