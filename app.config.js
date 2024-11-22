import 'dotenv/config';

export default {
  expo: {
    name: "Bus Fet",
    slug: "proyecto-bus",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo_fet.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: "$(PRODUCT_NAME) needs access to your Camera.",
        NSMicrophoneUsageDescription: "$(PRODUCT_NAME) needs access to your Microphone."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.fet.bus_fet",
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "react-native-vision-camera",
        {
          cameraPermissionText: "$(PRODUCT_NAME) needs access to your Camera.",
          enableMicrophonePermission: true,
          microphonePermissionText: "$(PRODUCT_NAME) needs access to your Microphone."
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      apiHost: process.env.EXPO_PUBLIC_HOST, 
      eas: {
        projectId: "1933cc32-9385-4e22-b48e-95643767ec5e"
      }
    },
    owner: "juancamilo44"
  }
};