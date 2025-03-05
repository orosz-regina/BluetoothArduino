import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
        setButtons(config.buttons || []);
      } catch (error) {
        console.error('Error loading layout config:', error);
      }
    };
    loadConfig();
  }, []);

  return (
    <View style={styles.container}>
      {buttons.length > 0 ? (
        buttons.map((btn, index) => {
          const imageKey = btn.image || '';
          const imageSource = imageKey ? imageMap[imageKey] || imageMap.default : null;

          let positionStyle = {};
          if (btn.position === 'center') {
            positionStyle = { alignSelf: 'center' };
          } else if (btn.position === 'left') {
            positionStyle = { alignSelf: 'flex-start' };
          } else if (btn.position === 'right') {
            positionStyle = { alignSelf: 'flex-end' };
          }

          if (btn.marginLeft !== undefined || btn.marginTop !== undefined) {
            positionStyle = {
              position: 'absolute',
              marginLeft: btn.marginLeft || 0,
              marginTop: btn.marginTop || 0,
            };
          }

          const width = btn.width || btn.size || 50;
          const height = btn.height || btn.size || 50;

          return (
            <CustomButton
              key={index}
              imageSource={imageSource}
              onPress={() => sendMessageToDevice(deviceId, btn.command)}
              label={!imageSource ? btn.title : undefined}
              style={positionStyle}
              width={width}
              height={height}
            />
          );
        })
      ) : (
        <Text style={styles.noButtonsText}>Nincsenek gombok megadva</Text>
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
  noButtonsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default LayoutButton;
