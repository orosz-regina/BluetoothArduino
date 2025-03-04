// LayoutButton.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import { sendMessageToDevice } from '../services/ArduinoService';
import { loadLayoutConfig } from '../utils/fileUtils';

interface LayoutButtonProps {
  deviceId: string;
}

const LayoutButton: React.FC<LayoutButtonProps> = ({ deviceId }) => {
  const [buttons, setButtons] = useState<any[]>([]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await loadLayoutConfig();
        setButtons(config.buttons); // Betöltjük a konfigurációt és a gombokat
      } catch (error) {
        console.error('Error loading layout config:', error);
      }
    };

    loadConfig();
  }, []);

  return (
    <View style={styles.container}>
      {buttons.map((btn, index) => (
        <CustomButton
          key={index}
          title={btn.title}
          imageSource={btn.imageSource} // A megfelelő kép betöltése
          onPress={() => sendMessageToDevice(deviceId, btn.command)} // Parancs küldése az Arduino eszköznek
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default LayoutButton;
