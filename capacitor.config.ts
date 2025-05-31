import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.relevamiento',
  appName: 'Relevamiento Visual',
  webDir: 'www',
  //bundledWebRuntime: false,
  plugins: {
    Camera: {
      // Esto permite que la cámara nativa use correctamente la galería o cámara
      photoAlbumSaveLocation: 'Public',
      saveToGallery: true,
    },
    SplashScreen: {
      launchShowDuration: 100, // 🔥 dura 100ms
      autoHide: true,
    },
  },
};

export default config;
