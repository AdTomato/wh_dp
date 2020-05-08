module.exports = {
  presets: [
    ['@vue/app',
      {
        modules: "commonjs",
      }
    ]
  ],
  plugins: [
    // 'syntax-dynamic-import',
    // 'transform-vue-jsx',
    ['import', { libraryName: '@h3/awesome-ui', libraryDirectory: 'lib', style: true }, 'h3-awesome-ui'],
    ['import', { libraryName: 'h3-antd-vue', libraryDirectory: 'lib', style: true }, 'h3-antd-vue'],
    ['import', { libraryName: '@h3/report', libraryDirectory: 'lib', style: true }, '@h3/report']
  ]
};
