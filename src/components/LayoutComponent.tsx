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
  const fixedBoxHeight = Math.max(...fixedButtons.map((btn) => (btn.marginTop || 0) + (btn.height || 50)));
  const fixedBoxWidth = Math.max(...fixedButtons.map((btn) => (btn.marginLeft || 0) + (btn.width || 50)));

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
  },
  dynamicBox: {
    flexDirection: 'row', // A dinamikus gombok vízszintesen
    flexWrap: 'wrap', // Ha nincs hely, új sorba kerülnek
    marginBottom: 20, // Térköz a dinamikus gombok és a fix gombok között
  },
  fixedBoxContainer: {
    position: 'relative', // A konténer relatív pozícióban van
    marginBottom: 20, // Térköz a fix gombok és a többi elem között
  },
  fixedBox: {
    position: 'absolute', // A fix gombok abszolút pozícióban vannak
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none', // A gombok interaktívak maradnak
  },
});

export default LayoutComponent;