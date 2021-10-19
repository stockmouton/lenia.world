/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
const path = require('path')
const webpack = require('webpack')

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        assert: false,
        Buffer: false,
        crypto: false,
        http: false,
        https: false,
        os: false,
        stream: false,
        electron: false,
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: path.join(__dirname, 'shims/buffer.js'),
        process: 'process/browser'
      }),
    ],
    experiments: {
      asyncWebAssembly: true,
    }
  })
}
