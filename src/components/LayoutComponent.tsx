import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import TextInputButton from './TextInputButton';  // Beviteli mező kezelése
import { sendMessageToDevice } from '../services/ArduinoService';
import imageMap from '../utils/imageMap';

interface LayoutComponentProps {
  deviceId: string;
}

const LayoutComponent: React.FC<LayoutComponentProps> = ({ deviceId }) => {
  const [buttons, setButtons] = useState<any[]>([]);
  const [textInputConfig, setTextInputConfig] = useState<any>(null); // Beviteli mező konfiguráció

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = require('../assets/config/layout.json'); // JSON fájl betöltése
        setButtons(config.buttons); // Gombok beállítása
        setTextInputConfig(config.textInput || null); // Szövegdoboz beállítása
      } catch (error) {
        console.error('Error loading layout config:', error);
      }
    };
    loadConfig();
  }, []);

  return (
    <View style={styles.container}>
      {buttons.map((btn, index) => {
        const imageKey = btn.image || '';
        const imageSource = imageKey ? imageMap[imageKey] || imageMap.default : null;

        const width = btn.width || 50;  // Alapértelmezett szélesség, ha nincs megadva
        const height = btn.height || 50;  // Alapértelmezett magasság, ha nincs megadva

        return (
          <CustomButton
            key={index}
            imageSource={imageSource}
            onPress={() => sendMessageToDevice(deviceId, btn.command)}  // Gomb megnyomásának kezelése
            label={!imageSource ? btn.title : undefined}  // Ha nincs kép, akkor a címke jelenjen meg
            width={width}  // Méret beállítása
            height={height}  // Méret beállítása
            style={{
              ...(btn.marginLeft || btn.marginTop
                ? { position: 'absolute', marginLeft: btn.marginLeft || 0, marginTop: btn.marginTop || 0 }
                : {}),
            }}
          />
        );
      })}

      {/* Szövegbeviteli mező megjelenítése, ha van beállítva */}
      {textInputConfig && (
        <TextInputButton config={textInputConfig} deviceId={deviceId} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default LayoutComponent;
