// babel.config.js
// NativeWind v4 requiere:
//   1. jsxImportSource: 'nativewind' en babel-preset-expo
//   2. El preset 'nativewind/babel' para la transformación de className
module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  }
}
