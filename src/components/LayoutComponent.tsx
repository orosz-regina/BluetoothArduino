import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
  const [messageBoxConfig, setMessageBoxConfig] = useState<any>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = require('../assets/config/layout.json');
        setButtons(config.buttons);
        setTextInputConfig(config.textInput || null);
        setMessageBoxConfig(config.messageBox || null);
      } catch (error) {
        console.error('Error loading layout config:', error);
      }
    };
    loadConfig();
  }, []);

  // Különválasztjuk a dinamikus és fix pozíciós gombokat
  const dynamicButtons = buttons.filter((btn) => !btn.marginLeft && !btn.marginTop);
  const fixedButtons = buttons.filter((btn) => btn.marginLeft || btn.marginTop);

  // Kiszámoljuk a fix gombokhoz szükséges maximális magasságot és szélességet
  const fixedBoxHeight = fixedButtons.length > 0
    ? Math.max(...fixedButtons.map((btn) => (btn.marginTop || 0) + (btn.height || 50)))
    : 0; // Alapértelmezett érték, ha nincsenek fix gombok
  const fixedBoxWidth = fixedButtons.length > 0
    ? Math.max(...fixedButtons.map((btn) => (btn.marginLeft || 0) + (btn.width || 50)))
    : 0; // Alapértelmezett érték, ha nincsenek fix gombok

  return (
    <View style={styles.container}>
      {/* Dinamikus gombok (számozott gombok) */}
      <View style={styles.dynamicBox}>
        {dynamicButtons.map((btn, index) => {
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
            />
          );
        })}
      </View>

      {/* Fix gombok konténere (marginnal rendelkező gombok) */}
      <View style={[styles.fixedBoxContainer, { height: fixedBoxHeight, width: fixedBoxWidth }]}>
        <View style={styles.fixedBox}>
          {fixedButtons.map((btn, index) => {
            const imageKey = btn.image || '';
            const imageSource = imageKey ? imageMap[imageKey] || imageMap.default : null;
            const width = btn.width || 50;
            const height = btn.height || 50;

            // A marginok alkalmazása
            const buttonStyle = {
              position: 'absolute', // Fix pozíció
              left: btn.marginLeft || 0,
              top: btn.marginTop || 0,
            };

            return (
              <CustomButton
                key={index}
                imageSource={imageSource}
                onPress={() => sendMessageToDevice(deviceId, btn.command)}
                label={!imageSource ? btn.title : undefined}
                width={width}
                height={height}
                style={buttonStyle}
              />
            );
          })}
        </View>
      </View>

      {/* Text input és message box */}
      {textInputConfig && (
        <TextInputButton config={textInputConfig} deviceId={deviceId} />
      )}

      {messageBoxConfig && (
        <MessageDisplay config={messageBoxConfig} deviceId={deviceId} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',  // Vertikális elrendezés
    paddingTop: 20,
    paddingHorizontal: 20,
    width: '100%', // A konténer szélessége most már 100%-os
  },
  dynamicBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    width: '100%', // A dinamikus gombok is 100%-ra vannak állítva
  },
  fixedBoxContainer: {
    position: 'relative',
    marginBottom: 20,
    width: '100%', // A fix gombok konténere is kitölti a szélességet
  },
  fixedBox: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
});

export default LayoutComponent;
