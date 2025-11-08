/**
 * Configuração do Expo
 * As credenciais do Firebase são lidas do arquivo config.json
 */

export default {
  expo: {
    name: "ToDo",
    slug: "ToDo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    plugins: [
      [
        "expo-media-library",
        {
          photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
          savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
          isAccessMediaLocationEnabled: true
        }
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/icon.png",
          color: "#51c1f5",
          sounds: ["./assets/notification.wav"],
        }
      ],
      "expo-font"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "READ_EXTERNAL_STORAGE",
        "READ_MEDIA_IMAGES",
        "READ_MEDIA_AUDIO" // Necessário para o expo-media-library funcionar corretamente
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  }
};

