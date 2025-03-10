import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { sendMessageToDevice } from '../services/ArduinoService';

interface TextInputButtonProps {
  config: any;
  deviceId: string;
}

const TextInputButton: React.FC<TextInputButtonProps> = ({ config, deviceId }) => {
  const [text, setText] = useState('');

  const inputStyle = {
    width: config.width || '100%',
    height: config.height || 50,
    padding: 10,
    marginBottom: 10,
    textAlign: 'left',
    borderColor: config.borderColor || '#000',
    borderWidth: config.borderWidth || 1,
    borderRadius: config.borderRadius || 5,
    backgroundColor: config.backgroundColor || '#ddd',
    color: config.textColor || '#000',
    ...config.input,
  };

  const buttonStyle = {
    backgroundColor: config.buttonBackgroundColor || '#007bff',
    padding: config.buttonPadding || 10,
    borderRadius: config.buttonBorderRadius || 5,
    ...config.button,
  };

  const buttonTextStyle = {
    color: config.buttonTextColor || '#fff',
    fontSize: config.buttonTextSize || 16,
    textAlign: 'center',
  };

  const handleSendText = () => {
    if (text.trim() !== '') {
      sendMessageToDevice(deviceId, text);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={inputStyle}
        value={text}
        onChangeText={setText}
        placeholder={config.placeholder || 'Írj be egy üzenetet...'}
      />
      <TouchableOpacity
        style={buttonStyle}
        onPress={handleSendText}
      >
        {/* A szövegek mindig Text komponensben */}
        <Text style={buttonTextStyle}>{config.label || 'Küldés'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 30,
  },
});

export default TextInputButton;
