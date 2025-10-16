import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Easy Control',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    cleartext: true,
    hostname: '192.168.192.185'
  }
};

export default config;
