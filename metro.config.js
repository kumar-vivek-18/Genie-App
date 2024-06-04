
// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require('nativewind/metro');

// module.exports = (async () => {
//     const defaultConfig = getDefaultConfig(__dirname);

//     // Apply NativeWind configuration
//     const configWithNativeWind = withNativeWind(defaultConfig, { input: './global.css' });

//     // Modify resolver and transformer for SVG support
//     const { transformer, resolver } = configWithNativeWind;

//     const modifiedTransformer = {
//         ...transformer,
//         babelTransformerPath: require.resolve("react-native-svg-transformer")
//     };

//     const modifiedResolver = {
//         ...resolver,
//         assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
//         sourceExts: [...resolver.sourceExts, "svg"]
//     };

//     // Update the configuration with modified resolver and transformer
//     const updatedConfig = {
//         ...configWithNativeWind,
//         transformer: modifiedTransformer,
//         resolver: modifiedResolver
//     };

//     return updatedConfig;
// })();


const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

module.exports = (async () => {
    const defaultConfig = await getDefaultConfig(__dirname);

    // Apply NativeWind configuration
    const configWithNativeWind = withNativeWind(defaultConfig, { input: './global.css' });

    // Modify resolver and transformer for SVG support
    const { transformer, resolver } = configWithNativeWind;

    const modifiedTransformer = {
        ...transformer,
        babelTransformerPath: require.resolve("react-native-svg-transformer")
    };

    const modifiedResolver = {
        ...resolver,
        assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
        sourceExts: [...resolver.sourceExts, "svg", "css"]
    };

    // Update the configuration with modified resolver and transformer
    const updatedConfig = {
        ...configWithNativeWind,
        transformer: modifiedTransformer,
        resolver: modifiedResolver
    };

    return updatedConfig;
})();
