import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Dimensions } from 'react-native';
import { sendMessageToDevice } from '../services/ArduinoService'; // Győződj meg róla, hogy a megfelelő import van itt

interface TextInputButtonProps {
  config: any;
  deviceId: string;
}

const TextInputButton: React.FC<TextInputButtonProps> = ({ config, deviceId }) => {
  const [text, setText] = useState('');
  const { width, height } = config;

  // Képernyő szélessége
  const screenWidth = Dimensions.get('window').width;

  // Ha nincs megadva szélesség, akkor a képernyő szélessége legyen az alapértelmezett
  const inputWidth = width || screenWidth - 40; // 40 az oldalakon lévő padding miatt

  const handleSendText = () => {
    if (text.trim() !== '') {
      console.log('Text to send:', text);
      // Küldd el a szöveget az eszközre
      sendMessageToDevice(deviceId, text);
      setText(''); // Ürítsd ki a beviteli mezőt a küldés után
    } else {
      console.log('Nem érvényes szöveg!');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { width: inputWidth, height }]}
        value={text}
        onChangeText={setText}
        placeholder="Enter text"
      />
      <View style={styles.buttonContainer}>
        <Button title="Küldés" onPress={handleSendText} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 20, // Oldalra rakott padding
    width: '100%', // Az egész képernyőt lefedi
    justifyContent: 'center', // Függőlegesen középre igazít
    alignItems: 'center', // Horizontálisan középre igazít
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%', // Gomb szélességét is maximálisan kihasználjuk
    alignItems: 'center', // Gomb középre igazítása
  },
});

export default TextInputButton;
