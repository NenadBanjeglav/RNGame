const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

// Get the default configuration
const config = getDefaultConfig(__dirname);

// Apply the NativeWind wrapper
const nativeWindConfig = withNativeWind(config, { input: "./globals.css" });

// Apply the Reanimated wrapper
const finalConfig = wrapWithReanimatedMetroConfig(nativeWindConfig);

module.exports = finalConfig;
