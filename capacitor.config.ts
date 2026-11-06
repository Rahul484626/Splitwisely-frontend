import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rahul.splitwisely',
  appName: 'Splitwisely',
  webDir: 'www',
  server: {
    // Allow cleartext HTTP to local API during development (Android 9+)
    cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: '#0B1020',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0B1020',
    },
  },
};

export default config;
