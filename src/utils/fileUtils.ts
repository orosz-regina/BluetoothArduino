import { Asset } from 'expo-asset';

export const loadLayoutConfig = async () => {
try {
// Közvetlenül betöltjük a layout.json fájlt
const config = require('../assets/config/layout.json');

// Visszaadjuk a JSON konfigurációt
return config;
} catch (error) {
console.error('Error loading layout config:', error);
    return { buttons: [] };  // Hibakezelés, ha nem sikerül betölteni a konfigurációt
  }
};


