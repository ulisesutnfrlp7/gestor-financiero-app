import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Gestor Financiero",
  slug: "gestor-financiero-app",
  version: "1.0.0",
  scheme: "gestor-financiero-app",
  orientation: "portrait",
  icon: "./assets/icono.png",
  splash: {
    image: "./assets/splashscreen.png",
    resizeMode: "contain",
    backgroundColor: "#4F46E5"
  },
  userInterfaceStyle: "light",
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.tuempresa.gestorfinanciero"
  },
  android: {
    package: "com.tuempresa.gestorfinanciero",
    // Esta es la línea clave: lee la ruta del archivo temporal de EAS o el local
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json"
  },
  web: {
    bundler: "metro",
    output: "single"
  },
  plugins: [
    "expo-router",
    "expo-asset",
    "@react-native-community/datetimepicker",
    "@react-native-google-signin/google-signin",
    [
      "expo-notifications",
      {
        icon: "./assets/icono.png",
        color: "#4F46E5"
      }
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "La app necesita acceder a tu galería para adjuntar comprobantes.",
        cameraPermission: "La app necesita acceder a tu cámara para tomar fotos de comprobantes."
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {},
    eas: {
      projectId: "36a7e254-d33e-4186-af93-e9d19c80e157"
    }
  }
});