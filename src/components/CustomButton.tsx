// CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

interface CustomButtonProps {
  title: string;
  imageSource: any;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, imageSource, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {imageSource && <Image source={imageSource} style={styles.icon} />}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CustomButton;
