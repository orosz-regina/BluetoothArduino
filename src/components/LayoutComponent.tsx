import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import TextInputButton from './TextInputButton';
import MessageDisplay from './MessageDisplay';
import { sendMessageToDevice } from '../services/ArduinoService';
import imageMap from '../utils/imageMap';

interface LayoutComponentProps {
  deviceId: string;
}

const LayoutComponent: React.FC<LayoutComponentProps> = ({ deviceId }) => {
  const [buttons, setButtons] = useState<any[]>([]);
  const [textInputConfig, setTextInputConfig] = useState<any>(null);
  const [messageBoxConfig, setMessageBoxConfig] = useState<any>(null); // Üzenetdoboz beállítás

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = require('../assets/config/layout.json');
        setButtons(config.buttons);
        setTextInputConfig(config.textInput || null);
        setMessageBoxConfig(config.messageBox || null); // Üzenetdoboz beállítása
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
        const width = btn.width || 50;
        const height = btn.height || 50;

        return (
          <CustomButton
            key={index}
            imageSource={imageSource}
            onPress={() => sendMessageToDevice(deviceId, btn.command)}
            label={!imageSource ? btn.title : undefined}
            width={width}
            height={height}
            style={{
              ...(btn.marginLeft || btn.marginTop
                ? { position: 'absolute', marginLeft: btn.marginLeft || 0, marginTop: btn.marginTop || 0 }
                : {}),
            }}
          />
        );
      })}

      {textInputConfig && <TextInputButton config={textInputConfig} deviceId={deviceId} />}

      {/* Üzenetdoboz megjelenítése, ha van konfiguráció */}
      {messageBoxConfig && <MessageDisplay config={messageBoxConfig} deviceId={deviceId} />}
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
