import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import { sendMessageToDevice } from '../services/ArduinoService';
import imageMap from '../utils/imageMap';

interface LayoutButtonProps {
  deviceId: string;
}

const LayoutButton: React.FC<LayoutButtonProps> = ({ deviceId }) => {
  const [buttons, setButtons] = useState<any[]>([]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = require('../assets/config/layout.json');
        setButtons(config.buttons);
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

        return (
          <CustomButton
            key={index}
            imageSource={imageSource}
            onPress={() => sendMessageToDevice(deviceId, btn.command)}
            label={!imageSource ? btn.title : undefined} // Ha nincs kép, akkor a szöveg jelenjen meg
            style={[
              btn.marginLeft !== undefined || btn.marginTop !== undefined
                ? { position: 'absolute', left: btn.marginLeft || 0, top: btn.marginTop || 0 }
                : {}, // Ha nincs margin megadva, akkor flexboxban marad
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 30, // **Nagyobb margó a bal és jobb szélen**
    paddingVertical: 20, // **Nagyobb térköz fent és lent**
  },
});


export default LayoutButton;
