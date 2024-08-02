
const name = process.env['VUE_APP_TITLE ']
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      [process.env.VUE_APP_API_ROOT]: {
        target: 'https://cgm-api-test.ihealthlabs.com',
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('worker-loader')
      .test(/\.worker\.js$/)
      .use({
        loader: 'worker-loader',
        options: {
          inline: true
        }
      })
      .loader('worker-loader')
      .end()
  },
  configureWebpack: {
    name: name,
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
  }
}
