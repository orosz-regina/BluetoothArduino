import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import TextInputButton from './TextInputButton';
import MessageDisplay from './MessageDisplay';
import { sendMessageToDevice } from '../services/ArduinoService';
import imageMap from '../utils/imageMap';
import { loadLayoutConfig } from '../utils/fileUtils';

interface LayoutComponentProps {
  deviceId: string;
}

const LayoutComponent: React.FC<LayoutComponentProps> = ({ deviceId }) => {
  const [buttons, setButtons] = useState<any[]>([]);
  const [textInputConfig, setTextInputConfig] = useState<any>(null);
  const [messageBoxConfig, setMessageBoxConfig] = useState<any>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const config = await loadLayoutConfig(); // A fileUtils.ts fájlból olvasunk
      setButtons(config.buttons);
      setTextInputConfig(config.textInput || null);
      setMessageBoxConfig(config.messageBox || null);
    };
    loadConfig();
  }, []);

  // Dinamikus gombok és fix gombok szétválasztása
  const dynamicButtons = buttons.filter((btn) => !btn.marginLeft && !btn.marginTop);
  const fixedButtons = buttons.filter((btn) => btn.marginLeft || btn.marginTop);

  // Fix gombok maximális méretének kiszámítása
  const fixedBoxHeight = fixedButtons.length > 0
    ? Math.max(...fixedButtons.map((btn) => (btn.marginTop || 0) + (btn.height || 50)))
    : 0;
  const fixedBoxWidth = fixedButtons.length > 0
    ? Math.max(...fixedButtons.map((btn) => (btn.marginLeft || 0) + (btn.width || 50)))
    : 0;

  return (
    <View style={styles.container}>
      {/* Dinamikus gombok megjelenítése */}
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

      {/* Fix gombok konténere */}
      <View style={[styles.fixedBoxContainer, { height: fixedBoxHeight, width: fixedBoxWidth }]}>
        <View style={styles.fixedBox}>
          {fixedButtons.map((btn, index) => {
            const imageKey = btn.image || '';
            const imageSource = imageKey ? imageMap[imageKey] || imageMap.default : null;
            const width = btn.width || 50;
            const height = btn.height || 50;

            // Pozíció beállítása fix gombokhoz
            const buttonStyle = {
              position: 'absolute',
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

      {/* Text input és message box megjelenítése */}
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
    flexDirection: 'column',
    paddingTop: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  dynamicBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    width: '100%',
  },
  fixedBoxContainer: {
    position: 'relative',
    marginBottom: 20,
    width: '100%',
  },
  fixedBox: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
});

export default LayoutComponent;
