module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      '@babel/plugin-transform-class-properties',
      { loose: true }
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      { loose: true }
    ]
  ]
};
