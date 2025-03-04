import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';

interface CustomButtonProps {
  imageSource?: any;
  onPress: () => void;
  label?: string;
  style?: object;
}

const CustomButton: React.FC<CustomButtonProps> = ({ imageSource, onPress, label, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {imageSource ? (
        <Image source={imageSource} style={styles.icon} />
      ) : (
        <View style={styles.background}>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15, // Nagyobb térköz
  },
  background: {
    width: 60,
    height: 60,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  icon: {
    width: 50,
    height: 50,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CustomButton;
