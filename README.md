# React Native Bluetooth Alkalmazás

Ez egy React Native alapú alkalmazás, amely Bluetooth-on keresztül kommunikál egy Arduinoval.

## Telepítés
1. **A projekt futtatásához az alábbi eszközök szükségesek:**

- **Node.js** (LTS verzió, pl. 18.x vagy újabb)
- **Git** a verziókezeléshez
- **Android Studio** az Android alkalmazás fejlesztéséhez és teszteléséhez
- **Expo CLI** az Expo projekt futtatásához

2. **Projekt klónozása:**
   ```sh
   git clone <repository-url>
   cd <project-directory>
   ```

3. **Függőségek telepítése:**
   ```sh
   npm install
   ```

## Futtatás

Androidon a következő paranccsal lehet build-elni:
```sh
EAS build -p android
```

## `layout.json` fájl beállításai

A `layout.json` fájl segítségével testreszabhatod az alkalmazás kinézetét és működését.

### **Gombok (`buttons`):**
- `title`: A gomb felirata (pl. "1", "Balra").
- `command`: A gombhoz tartozó parancs (pl. "LEFT", "FORWARD").
- `image`: Opcionális kép a gombhoz.
- `marginLeft`, `marginTop`: A gomb elhelyezkedése.
- `width`, `height`: A gomb méretei (alapértelmezett 50px).

### **Szövegbevitel (`textInput`):**
- `label`: Az input mező fölötti szöveg.
- `placeholder`: Alapértelmezett szöveg a mezőben.
- `width`, `height`: A mező mérete.
- `borderColor`, `borderWidth`, `borderRadius`: A mező szegélyének beállításai.
- `backgroundColor`, `color`: A mező és a szöveg színei.
- `textAlign`: A beírt szöveg igazítása.
- `padding`: Belső margó.

### **Üzenet doboz (`messageBox`):**
- `label`: Az üzenet doboz feletti szöveg.
- `width`, `height`: Az üzenet doboz méretei.
- `backgroundColor`, `borderColor`, `borderWidth`, `borderRadius`: Stílusbeli beállítások.
- `padding`: Belső margó.

## Kód felépítése

- **`components/CustomButton.tsx`** – Egyedi gomb komponens.
- **`components/TextInputButton.tsx`** – Szövegbevitel és küldés.
- **`components/MessageDisplay.tsx`** – Beérkező üzenetek megjelenítése.
- **`services/ArduinoService.ts`** – Bluetooth kommunikáció kezelése.

## Fejlesztőknek

A fejlesztés során a következő parancsokat használhatod:
```sh
npx expo build:android    # Android alkalmazás futtatása
```
