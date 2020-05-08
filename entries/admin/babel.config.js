module.exports = {
  presets: [
    // "es2015", 
    // "stage-0",
    ['@vue/app',
      {
        modules: "commonjs",
      }
    ]
  ],
  plugins: [
    ['import', { libraryName: '@h3/awesome-ui', libraryDirectory: 'lib', style: true }],
    ['import', { libraryName: '@h3/report', libraryDirectory: 'lib', style: true }, '@h3/report']
  ]
};
