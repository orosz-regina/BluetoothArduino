import { Asset } from 'expo-asset';

// A layout konfiguráció betöltése
export const loadLayoutConfig = async () => {
try {
// Betöltjük a layout.json fájlt
const config = require('../assets/config/layout.json');

// Visszaadjuk a konfigurációt
return config;
} catch (error) {
console.error('Error loading layout config:', error);
    // Hibakezelés, ha nem sikerül betölteni a konfigurációt
    return { buttons: [] };
  }
};
