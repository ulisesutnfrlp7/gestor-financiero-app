// metro.config.js
// withNativeWind envuelve la config de Metro para procesar el archivo global.css
// y habilitar la transformación de clases Tailwind en tiempo de build.
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, { input: './global.css' })
