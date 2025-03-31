import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { sendMessageToDevice } from '../services/ArduinoService';

interface TextInputButtonProps {
  config: any;  // A konfigurációs objektum, amely a stílusokat és egyéb beállításokat tartalmaz
  deviceId: string;  // Az eszköz azonosítója
}

const TextInputButton: React.FC<TextInputButtonProps> = ({ config, deviceId }) => {
  const [text, setText] = useState('');  // A felhasználó által beírt szöveg

  // Dinamikus stílusok a bemeneti mezőhöz (alapértelmezett stílusok a második kódból)
  const inputStyle = {
    width: config.width || '100%',
    height: config.height || 50,
    borderColor: config.borderColor || '#000',
    borderWidth: 1,
    borderRadius: config.borderRadius || 10,
    backgroundColor: config.backgroundColor || '#ddd',
    paddingLeft: 10,
    paddingRight: 10,
    ...config.input,
  };

  // Dinamikus stílusok a gombhoz (alapértelmezett gombstílusok a második kódból)
  const buttonStyle = {
    backgroundColor: config.buttonBackgroundColor || '#007bff',
    borderRadius: config.buttonBorderRadius || 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    ...config.button,
  };

  // Az üzenet küldése
  const handleSendText = () => {
    if (text.trim() !== '') {
      sendMessageToDevice(deviceId, text);  // Küldje el a szöveget az eszközhöz
      setText('');  // Törölje a szöveget a mezőből
    }
  };

  return (
    <View style={styles.container}>
      {/* Bemeneti mező */}
      <TextInput
        style={inputStyle}
        value={text}
        onChangeText={setText}
        placeholder={config.placeholder || 'Írj be egy üzenetet...'}
      />
      {/* Gomb a szöveg küldésére */}
      <TouchableOpacity style={buttonStyle} onPress={handleSendText}>
        <Text style={styles.buttonText}>{config.label || 'Küldés'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TextInputButton;
