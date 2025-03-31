import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';

interface CustomButtonProps {
  imageSource?: any; // Kép forrása (opcionális)
  onPress: () => void; // A gombra kattintás eseménye
  label?: string; // Ha nincs kép, a szöveg jelenik meg
  width?: number; // Gomb szélessége
  height?: number; // Gomb magassága
  style?: object; // Egyedi pozicionálás
}

const CustomButton: React.FC<CustomButtonProps> = ({ imageSource, onPress, label, width = 50, height = 50, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {imageSource ? (
        // Ha van kép forrás, megjelenítjük azt
        <Image source={imageSource} style={[styles.icon, { width, height }]} />
      ) : (
        // Ha nincs kép, akkor egy szöveges gombot jelenítünk meg
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
    margin: 10,
  },
  icon: {
    resizeMode: 'contain',
  },
  textButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomButton;
