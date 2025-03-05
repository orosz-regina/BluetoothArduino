import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';

interface CustomButtonProps {
  imageSource?: any; // Kép forrása (opcionális)
  onPress: () => void; // A gombra kattintás eseménye
  label?: string; // Ha nincs kép, a szöveg jelenik meg
  width?: number;
  height?: number;
  style?: object; // Egyedi pozicionálás
}

const CustomButton: React.FC<CustomButtonProps> = ({ imageSource, onPress, label, width = 50, height = 50, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {imageSource ? (
        <Image source={imageSource} style={[styles.icon, { width, height }]} />
      ) : (
        <View style={[styles.textButton, { width, height }]}>
          <Text style={styles.text}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10, // Alap térköz a gombok között
  },
  icon: {
    resizeMode: 'contain', // Kép méretezése
  },
  textButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, // Körvonal vastagság
    borderColor: 'black', // Körvonal színe
    borderRadius: 10, // Lekerekített sarkok
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomButton;
